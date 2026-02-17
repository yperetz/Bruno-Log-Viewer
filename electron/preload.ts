import { contextBridge, ipcRenderer } from 'electron';

const logsApi = {
  getFolderPath: () => ipcRenderer.invoke('logs:getFolderPath'),
  setFolderPath: () => ipcRenderer.invoke('logs:setFolderPath'),
  listDates: () => ipcRenderer.invoke('logs:listDates'),
  loadFile: (date: string) => ipcRenderer.invoke('logs:loadFile', date),
  deleteEntries: (date: string, indices: number[]) =>
    ipcRenderer.invoke('logs:deleteEntries', date, indices),
  onUpdated: (callback: (data: { logs: unknown[] }) => void) => {
    const handler = (_: unknown, data: { logs: unknown[] }) => callback(data);
    ipcRenderer.on('logs:updated', handler);
    return () => ipcRenderer.removeListener('logs:updated', handler);
  },
};

contextBridge.exposeInMainWorld('logsApi', logsApi);

export type LogsApi = typeof logsApi;
