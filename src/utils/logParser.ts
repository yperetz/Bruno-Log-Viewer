import type { LogEntry, LogFile } from '@/types/log.types';

export function parseLogFile(json: string): LogFile {
  const data = JSON.parse(json) as unknown;
  if (!data || typeof data !== 'object')
    throw new Error("Invalid log file: expected object with 'logs' array");
  const logs = (data as Record<string, unknown>).logs;
  if (!Array.isArray(logs))
    throw new Error("Invalid log file format: expected 'logs' array");
  return { logs: logs as LogEntry[] };
}
