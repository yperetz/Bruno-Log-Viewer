import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';
import Store from 'electron-store';
import chokidar from 'chokidar';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const store = new Store<{ logsFolderPath: string }>({
  name: 'bruno-logs-viewer-config',
});
const LOG_FILE_PATTERN = /^\d{4}-\d{2}-\d{2}-Bruno-log\.json$/;

/** Sort dates yyyy-mm-dd descending (newest first) */
function sortDatesNewestFirst(dates: string[]): string[] {
  return [...dates].sort((a, b) => b.localeCompare(a));
}

let mainWindow: BrowserWindow | null = null;
let fileWatcher: chokidar.FSWatcher | null = null;
let watchedFilePath: string | null = null;

function createWindow() {
  const iconPath = path.join(__dirname, '../build/icon.png');
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1024,
    minHeight: 720,
    icon: iconPath,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  if (process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }
}

function stopWatcher() {
  if (fileWatcher) {
    fileWatcher.close();
    fileWatcher = null;
    watchedFilePath = null;
  }
}

function startWatcher(filePath: string) {
  stopWatcher();
  watchedFilePath = filePath;

  let debounceTimer: ReturnType<typeof setTimeout> | null = null;
  const DEBOUNCE_MS = 400;

  const reloadFile = async () => {
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      const data = JSON.parse(content);
      if (!Array.isArray(data.logs))
        throw new Error('Invalid format: expected logs array');
      mainWindow?.webContents.send('logs:updated', { logs: data.logs });
    } catch (err) {
      setTimeout(async () => {
        try {
          const content = await fs.readFile(filePath, 'utf-8');
          const data = JSON.parse(content);
          if (!Array.isArray(data.logs))
            throw new Error('Invalid format: expected logs array');
          mainWindow?.webContents.send('logs:updated', { logs: data.logs });
        } catch {
          /* ignore retry failure */
        }
      }, 200);
    }
  };

  fileWatcher = chokidar.watch(filePath, { persistent: true });

  fileWatcher.on('change', () => {
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      debounceTimer = null;
      reloadFile();
    }, DEBOUNCE_MS);
  });

  fileWatcher.on('add', () => {
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      debounceTimer = null;
      reloadFile();
    }, DEBOUNCE_MS);
  });
}

app.whenReady().then(() => {
  ipcMain.handle('logs:getFolderPath', () => {
    return store.get('logsFolderPath') ?? null;
  });

  ipcMain.handle('logs:setFolderPath', async () => {
    const result = await dialog.showOpenDialog(mainWindow!, {
      properties: ['openDirectory'],
    });
    if (result.canceled) return null;
    const folderPath = result.filePaths[0];
    store.set('logsFolderPath', folderPath);
    const entries = await fs.readdir(folderPath);
    const dates = sortDatesNewestFirst(
      entries
        .filter((f) => LOG_FILE_PATTERN.test(f))
        .map((f) => f.replace('-Bruno-log.json', ''))
    );
    return { folderPath, dates };
  });

  ipcMain.handle('logs:listDates', async () => {
    const folderPath = store.get('logsFolderPath');
    if (!folderPath) return { dates: [], folderPath: null };
    try {
      const entries = await fs.readdir(folderPath);
      const dates = sortDatesNewestFirst(
        entries
          .filter((f) => LOG_FILE_PATTERN.test(f))
          .map((f) => f.replace('-Bruno-log.json', ''))
      );
      return { dates, folderPath };
    } catch {
      return { dates: [], folderPath };
    }
  });

  ipcMain.handle('logs:loadFile', async (_, date: string) => {
    const folderPath = store.get('logsFolderPath');
    if (!folderPath)
      return { error: 'Logs folder not configured. Please select a folder.' };
    const fileName = `${date}-Bruno-log.json`;
    const filePath = path.join(folderPath, fileName);
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      const data = JSON.parse(content);
      if (!Array.isArray(data.logs))
        return { error: `Invalid log file format: expected 'logs' array.` };
      startWatcher(filePath);
      return { logs: data.logs };
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      return {
        error: `Unable to parse log file for ${date}. ${msg}`,
      };
    }
  });

  ipcMain.handle('logs:deleteEntries', async (_, date: string, indicesToRemove: number[]) => {
    const folderPath = store.get('logsFolderPath');
    if (!folderPath)
      return { error: 'Logs folder not configured. Please select a folder.' };
    const fileName = `${date}-Bruno-log.json`;
    const filePath = path.join(folderPath, fileName);
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      const data = JSON.parse(content);
      if (!Array.isArray(data.logs))
        return { error: `Invalid log file format: expected 'logs' array.` };
      const indicesSet = new Set(indicesToRemove);
      const newLogs = data.logs.filter((_: unknown, i: number) => !indicesSet.has(i));
      await fs.writeFile(filePath, JSON.stringify({ logs: newLogs }, null, 2), 'utf-8');
      return { logs: newLogs };
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      return { error: `Unable to delete entries: ${msg}` };
    }
  });

  createWindow();
});

app.on('window-all-closed', () => {
  stopWatcher();
  if (process.platform !== 'darwin') app.quit();
});
