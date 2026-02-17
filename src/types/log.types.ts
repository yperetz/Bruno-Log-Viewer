export interface RequestPayload {
  url: string;
  method: string;
  headers: Record<string, unknown>;
  body?: unknown;
}

export interface ResponsePayload {
  status: number;
  headers: Record<string, unknown>;
  body: unknown;
}

export interface LogEntry {
  requestName: string;
  timestamp: string;
  request: RequestPayload;
  response: ResponsePayload;
}

export interface LogFile {
  logs: LogEntry[];
}
