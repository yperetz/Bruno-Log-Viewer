import { MethodBadge } from '@/components/shared/MethodBadge';
import type { LogEntry } from '@/types/log.types';

interface RequestOverviewProps {
  entry: LogEntry;
}

export function RequestOverview({ entry }: RequestOverviewProps) {
  const handleCopyUrl = async () => {
    await navigator.clipboard.writeText(entry.request.url);
  };

  return (
    <div className="space-y-2">
      <h2 className="text-xl font-semibold text-gray-800">{entry.requestName}</h2>
      <div className="flex items-center gap-2 flex-wrap">
        <MethodBadge method={entry.request.method} />
        <span className="text-sm text-gray-500 font-mono">{entry.timestamp}</span>
      </div>
      <div className="flex items-center gap-2">
        <code className="text-sm font-mono text-gray-700 break-all flex-1">
          {entry.request.url}
        </code>
        <button
          type="button"
          onClick={handleCopyUrl}
          className="px-2 py-1 text-xs bg-gray-200 hover:bg-gray-300 rounded shrink-0"
        >
          Copy
        </button>
      </div>
    </div>
  );
}
