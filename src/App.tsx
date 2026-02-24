import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { RequestPane } from '@/components/RequestPane';
import { ResponsePane } from '@/components/ResponsePane';
import { useLogs } from '@/hooks/useLogs';

function App() {
  const {
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
    refreshDates,
    loadDate,
    selectEntry,
    setCurrentDate,
    toggleSelectionMode,
    toggleSelection,
    toggleSelectAll,
    deleteEntries,
  } = useLogs();

  const noFolder = !logsPath;
  const noLogs = logsPath && availableDates.length === 0 && !loading;
  const showEmptyState = noFolder || noLogs;

  return (
    <div className="h-screen flex flex-col bg-white">
      <Header
        logsPath={logsPath}
        availableDates={availableDates}
        currentDate={currentDate}
        loading={loading}
        error={error}
        onSelectFolder={selectFolder}
        onSelectDate={loadDate}
        onRefreshDates={refreshDates}
        setCurrentDate={setCurrentDate}
      />

      <div className="flex-1 flex min-h-0">
        {showEmptyState ? (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center max-w-md">
              <h2 className="text-xl font-semibold text-gray-700 mb-2">
                {noFolder ? 'No logs folder selected' : 'No log files found'}
              </h2>
              <p className="text-gray-500 mb-4">
                {noFolder
                  ? 'Click "Select folder" to choose the folder containing Bruno log files (YYYY-MM-DD-Bruno-log.json).'
                  : 'The selected folder does not contain any Bruno log files. Log files must match the pattern YYYY-MM-DD-Bruno-log.json.'}
              </p>
              <button
                type="button"
                onClick={selectFolder}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
              >
                {noFolder ? 'Select folder' : 'Choose different folder'}
              </button>
            </div>
          </div>
        ) : (
          <>
            <Sidebar
              logs={logs}
              selectedIndex={selectedIndex}
              selectedIndices={selectedIndices}
              selectionMode={selectionMode}
              onSelectEntry={selectEntry}
              onToggleSelectionMode={toggleSelectionMode}
              onToggleSelection={toggleSelection}
              onToggleSelectAll={toggleSelectAll}
              onDeleteSelected={deleteEntries}
            />
            <main className="flex-1 flex min-w-0 border-t border-gray-200">
              <div className="flex-1 min-w-0 border-r border-gray-200 overflow-hidden">
                <RequestPane entry={selectedEntry} />
              </div>
              <div className="flex-1 min-w-0 overflow-hidden">
                <ResponsePane entry={selectedEntry} />
              </div>
            </main>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
