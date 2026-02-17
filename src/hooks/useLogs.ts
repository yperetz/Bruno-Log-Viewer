import { useState, useCallback, useEffect, useRef } from 'react';
import type { LogEntry } from '@/types/log.types';

export function useLogs() {
  const [logsPath, setLogsPath] = useState<string | null>(null);
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedIndices, setSelectedIndices] = useState<Set<number>>(new Set());
  const [selectionMode, setSelectionMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentDate, setCurrentDate] = useState<string | null>(null);
  const selectedIndexRef = useRef(selectedIndex);
  selectedIndexRef.current = selectedIndex;

  const loadDate = useCallback(async (date: string) => {
    if (!date) return;
    setLoading(true);
    setError(null);
    try {
      const result = await window.logsApi.loadFile(date);
      if (result.error) {
        setError(result.error);
        setLogs([]);
      } else if (result.logs) {
        setLogs(result.logs);
        setSelectedIndex(0);
        setCurrentDate(date);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }, []);

  const selectFolder = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await window.logsApi.setFolderPath();
      if (!result) {
        setLoading(false);
        return;
      }
      setLogsPath(result.folderPath);
      setAvailableDates(result.dates);
      if (result.dates.length > 0) {
        setCurrentDate(result.dates[0]);
        await loadDate(result.dates[0]);
      } else {
        setLogs([]);
        setCurrentDate(null);
        setLoading(false);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }, [loadDate]);

  const selectEntry = useCallback((index: number) => {
    setSelectedIndex(index);
  }, []);

  const toggleSelectionMode = useCallback(() => {
    setSelectionMode((prev) => !prev);
    setSelectedIndices(new Set());
  }, []);

  const toggleSelection = useCallback((index: number) => {
    setSelectedIndices((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedIndices(new Set());
  }, []);

  const toggleSelectAll = useCallback(() => {
    setSelectedIndices((prev) => {
      if (prev.size === logs.length)
        return new Set<number>();
      return new Set(logs.map((_, i) => i));
    });
  }, [logs.length]);

  const deleteEntries = useCallback(
    async (indices: number[]) => {
      if (!currentDate || indices.length === 0) return;
      setError(null);
      try {
        const result = await window.logsApi.deleteEntries(currentDate, indices);
        if (result.error) {
          setError(result.error);
          return;
        }
        if (result.logs) {
          const selectedEntry = logs[selectedIndex] ?? null;
          setLogs(result.logs);
          setSelectedIndices(new Set());
          setSelectionMode(false);
          const foundIdx = selectedEntry
            ? result.logs.findIndex(
                (e: LogEntry) =>
                  e.requestName === selectedEntry.requestName &&
                  e.timestamp === selectedEntry.timestamp
              )
            : -1;
          setSelectedIndex(
            foundIdx >= 0 ? foundIdx : Math.max(0, result.logs.length - 1)
          );
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      }
    },
    [currentDate, logs, selectedIndex]
  );

  useEffect(() => {
    const unsub = window.logsApi.onUpdated((data) => {
      const newLogs = data.logs as LogEntry[];
      const idx = selectedIndexRef.current;
      setLogs((prev) => {
        if (prev.length === 0) return newLogs;
        const selected = prev[idx];
        if (!selected) return newLogs;
        const foundIdx = newLogs.findIndex(
          (e) =>
            e.requestName === selected.requestName &&
            e.timestamp === selected.timestamp
        );
        if (foundIdx >= 0) setSelectedIndex(foundIdx);
        else if (idx >= newLogs.length)
          setSelectedIndex(Math.max(0, newLogs.length - 1));
        return newLogs;
      });
    });
    return unsub;
  }, []);

  useEffect(() => {
    let cancelled = false;
    window.logsApi.getFolderPath().then((path) => {
      if (cancelled) return;
      if (path) {
        setLogsPath(path);
        window.logsApi.listDates().then(({ dates, folderPath }) => {
          if (cancelled) return;
          setAvailableDates(dates);
          if (folderPath) setLogsPath(folderPath);
          if (dates.length > 0) {
            setCurrentDate(dates[0]);
            setLoading(true);
            window.logsApi.loadFile(dates[0]).then((result) => {
              if (cancelled) return;
              setLoading(false);
              if (result.error) setError(result.error);
              else if (result.logs) {
                setLogs(result.logs);
                setSelectedIndex(0);
                setCurrentDate(dates[0]);
              }
            });
          }
        });
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const selectedEntry = logs[selectedIndex] ?? null;

  return {
    logsPath,
    availableDates,
    logs,
    selectedEntry,
    selectedIndex,
    selectedIndices,
    selectionMode,
    currentDate,
    loading,
    error,
    selectFolder,
    loadDate,
    selectEntry,
    setCurrentDate,
    toggleSelectionMode,
    toggleSelection,
    toggleSelectAll,
    clearSelection,
    deleteEntries,
  };
}
