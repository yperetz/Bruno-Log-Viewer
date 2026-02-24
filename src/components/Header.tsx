interface HeaderProps {
  logsPath: string | null;
  availableDates: string[];
  currentDate: string | null;
  loading: boolean;
  error: string | null;
  onSelectFolder: () => void;
  onSelectDate: (date: string) => void;
  onRefreshDates: () => void;
  setCurrentDate: (date: string) => void;
}

export function Header({
  logsPath,
  availableDates,
  currentDate,
  loading,
  error,
  onSelectFolder,
  onSelectDate,
  onRefreshDates,
  setCurrentDate,
}: HeaderProps) {
  const handleDateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const date = e.target.value;
    if (date) {
      setCurrentDate(date);
      onSelectDate(date);
    }
  };

  return (
    <header className="flex items-center gap-4 px-4 py-3 bg-white border-b border-gray-200 shrink-0">
      <h1 className="text-xl font-semibold text-gray-800">
        Bruno Log Viewer
      </h1>
      <button
        type="button"
        onClick={onSelectFolder}
        disabled={loading}
        className="px-3 py-1.5 text-sm bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white rounded"
      >
        {logsPath ? 'Change folder' : 'Select folder'}
      </button>
      {logsPath && (
        <span className="text-sm text-gray-500 max-w-xs truncate" title={logsPath}>
          {logsPath}
        </span>
      )}
      {logsPath && availableDates.length > 0 && (
        <select
          value={currentDate ?? ''}
          onChange={handleDateChange}
          onFocus={onRefreshDates}
          disabled={loading}
          className="px-3 py-1.5 text-sm border border-gray-300 rounded bg-white"
        >
          {availableDates.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      )}
      {loading && (
        <span className="text-sm text-gray-500">Loading...</span>
      )}
      {error && (
        <span className="text-sm text-red-600 flex-1 truncate" title={error}>
          {error}
        </span>
      )}
    </header>
  );
}
