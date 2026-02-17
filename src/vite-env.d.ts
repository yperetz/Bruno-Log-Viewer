/// <reference types="vite/client" />

declare global {
  interface Window {
    logsApi: {
      getFolderPath: () => Promise<string | null>;
      setFolderPath: () => Promise<{ folderPath: string; dates: string[] } | null>;
      listDates: () => Promise<{ dates: string[]; folderPath: string | null }>;
      loadFile: (
        date: string
      ) => Promise<{ logs?: unknown[]; error?: string }>;
      deleteEntries: (
        date: string,
        indices: number[]
      ) => Promise<{ logs?: unknown[]; error?: string }>;
      onUpdated: (callback: (data: { logs: unknown[] }) => void) => () => void;
    };
  }
}
