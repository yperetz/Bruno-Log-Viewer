import { RequestOverview } from './RequestOverview';
import { HeadersTable } from '@/components/shared/HeadersTable';
import { BodyViewer } from '@/components/shared/BodyViewer';
import type { LogEntry } from '@/types/log.types';

interface RequestPaneProps {
  entry: LogEntry | null;
}

export function RequestPane({ entry }: RequestPaneProps) {
  if (!entry) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        Select a request to view details
      </div>
    );
  }

  const headers = (entry.request.headers ?? {}) as Record<string, unknown>;

  return (
    <div className="p-4 space-y-6 overflow-y-auto h-full">
      <section>
        <h3 className="text-sm font-semibold text-gray-600 mb-2">
          Request Overview
        </h3>
        <RequestOverview entry={entry} />
      </section>
      <section>
        <h3 className="text-sm font-semibold text-gray-600 mb-2">
          Request Headers
        </h3>
        <HeadersTable headers={headers} />
      </section>
      <section>
        <h3 className="text-sm font-semibold text-gray-600 mb-2">
          Request Body
        </h3>
        <BodyViewer
          key={`req-${entry.requestName}-${entry.timestamp}`}
          body={entry.request.body}
          emptyMessage="No request body"
        />
      </section>
    </div>
  );
}
