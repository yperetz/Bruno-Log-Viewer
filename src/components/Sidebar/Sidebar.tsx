import { RequestListItem } from './RequestListItem';
import type { LogEntry } from '@/types/log.types';

interface SidebarProps {
  logs: LogEntry[];
  selectedIndex: number;
  selectedIndices: Set<number>;
  selectionMode: boolean;
  onSelectEntry: (index: number) => void;
  onToggleSelectionMode: () => void;
  onToggleSelection: (index: number) => void;
  onToggleSelectAll: () => void;
  onDeleteSelected: (indices: number[]) => void;
}

export function Sidebar({
  logs,
  selectedIndex,
  selectedIndices,
  selectionMode,
  onSelectEntry,
  onToggleSelectionMode,
  onToggleSelection,
  onToggleSelectAll,
  onDeleteSelected,
}: SidebarProps) {
  const handleDeleteSelected = () => {
    if (
      window.confirm(
        `This will delete ${selectedIndices.size} message(s). Are you sure?`
      )
    )
      onDeleteSelected(Array.from(selectedIndices).sort((a, b) => a - b));
  };

  const handleDeleteSingle = (index: number) => {
    if (window.confirm('Delete this request?'))
      onDeleteSelected([index]);
  };

  return (
    <aside className="w-80 shrink-0 bg-gray-100 border-r border-gray-200 flex flex-col overflow-hidden">
      <div className="p-3 border-b border-gray-200 bg-white flex items-center justify-between gap-2 flex-wrap">
        <h2 className="font-semibold text-gray-700">
          {logs.length} request{logs.length !== 1 ? 's' : ''}
        </h2>
        <div className="flex items-center gap-1">
          {selectionMode ? (
            <>
              <button
                type="button"
                onClick={onToggleSelectAll}
                className="px-2 py-1 text-xs text-blue-600 hover:bg-blue-50 rounded"
              >
                {selectedIndices.size === logs.length ? 'Deselect all' : 'Select all'}
              </button>
              {selectedIndices.size >= 1 && (
                <button
                  type="button"
                  onClick={handleDeleteSelected}
                  className="px-2 py-1 text-xs bg-red-500 hover:bg-red-600 text-white rounded"
                >
                  Delete selected ({selectedIndices.size})
                </button>
              )}
              <button
                type="button"
                onClick={onToggleSelectionMode}
                className="px-2 py-1 text-xs text-gray-600 hover:bg-gray-200 rounded"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={onToggleSelectionMode}
              className="px-2 py-1 text-xs text-blue-600 hover:bg-blue-50 rounded"
            >
              Select
            </button>
          )}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {logs.map((entry, index) => (
          <RequestListItem
            key={`${entry.requestName}-${entry.timestamp}-${index}`}
            entry={entry}
            isSelected={index === selectedIndex}
            onClick={() => onSelectEntry(index)}
            showCheckbox={selectionMode}
            isChecked={selectedIndices.has(index)}
            onToggleCheck={() => onToggleSelection(index)}
            onDelete={() => handleDeleteSingle(index)}
          />
        ))}
      </div>
    </aside>
  );
}
