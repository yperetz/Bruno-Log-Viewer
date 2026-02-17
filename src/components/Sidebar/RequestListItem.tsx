import { MethodBadge } from '@/components/shared/MethodBadge';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { formatTimestamp } from '@/utils/dateFormatter';
import type { LogEntry } from '@/types/log.types';

function TrashIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <line x1="10" y1="11" x2="10" y2="17" />
      <line x1="14" y1="11" x2="14" y2="17" />
    </svg>
  );
}

interface RequestListItemProps {
  entry: LogEntry;
  isSelected: boolean;
  onClick: () => void;
  showCheckbox?: boolean;
  isChecked?: boolean;
  onToggleCheck?: () => void;
  onDelete?: () => void;
}

export function RequestListItem({
  entry,
  isSelected,
  onClick,
  showCheckbox,
  isChecked,
  onToggleCheck,
  onDelete,
}: RequestListItemProps) {
  const name =
    entry.requestName.length > 30
      ? `${entry.requestName.slice(0, 30)}...`
      : entry.requestName;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      className={`relative w-full text-left p-3 pr-8 border-b border-gray-200 hover:bg-gray-200 transition-colors cursor-pointer ${
        isSelected ? 'bg-blue-100 border-l-4 border-l-blue-500' : ''
      }`}
    >
      <div className="flex items-start gap-2">
        {showCheckbox && (
          <input
            type="checkbox"
            checked={isChecked}
            onChange={onToggleCheck}
            onClick={(e) => e.stopPropagation()}
            className="mt-0.5 shrink-0"
            aria-label="Select for bulk operations"
          />
        )}
        <div className="min-w-0 flex-1">
          <div
            className="font-semibold text-gray-800 truncate"
            title={entry.requestName}
          >
            {name}
          </div>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <MethodBadge method={entry.request.method} />
            <StatusBadge status={entry.response.status} />
            <span className="text-xs text-gray-500 font-mono">
              {formatTimestamp(entry.timestamp)}
            </span>
          </div>
        </div>
      </div>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onDelete?.();
        }}
        className="absolute right-2 top-2 p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded"
        aria-label="Delete request"
      >
        <TrashIcon />
      </button>
    </div>
  );
}
