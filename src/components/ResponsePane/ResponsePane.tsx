import { ResponseOverview } from './ResponseOverview';
import { HeadersTable } from '@/components/shared/HeadersTable';
import { BodyViewer } from '@/components/shared/BodyViewer';
import type { LogEntry } from '@/types/log.types';

interface ResponsePaneProps {
  entry: LogEntry | null;
}

export function ResponsePane({ entry }: ResponsePaneProps) {
  if (!entry) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        Select a request to view response
      </div>
    );
  }

  const headers = (entry.response.headers ?? {}) as Record<string, unknown>;

  return (
    <div className="p-4 space-y-6 overflow-y-auto h-full">
      <section>
        <h3 className="text-sm font-semibold text-gray-600 mb-2">
          Response Overview
        </h3>
        <ResponseOverview status={entry.response.status} />
      </section>
      <section>
        <h3 className="text-sm font-semibold text-gray-600 mb-2">
          Response Headers
        </h3>
        <HeadersTable
          headers={headers}
          highlightKeys={['content-type', 'content-length']}
        />
      </section>
      <section>
        <h3 className="text-sm font-semibold text-gray-600 mb-2">
          Response Body
        </h3>
        <BodyViewer
          key={`res-${entry.requestName}-${entry.timestamp}`}
          body={entry.response.body}
          emptyMessage="No response body"
        />
      </section>
    </div>
  );
}
