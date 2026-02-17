function formatHeaderValue(value: unknown): string {
  if (value === false) return 'false';
  if (value === true) return 'true';
  if (value === null || value === undefined) return '';
  return String(value);
}

export function HeadersTable({
  headers,
  highlightKeys,
}: {
  headers: Record<string, unknown>;
  highlightKeys?: string[];
}) {
  const entries = Object.entries(headers).sort(([a], [b]) =>
    a.localeCompare(b, undefined, { sensitivity: 'base' })
  );

  if (entries.length === 0) {
    return (
      <p className="text-gray-500 text-sm font-mono">No headers</p>
    );
  }

  return (
    <table className="w-full border-collapse text-sm">
      <thead>
        <tr className="border-b border-gray-200">
          <th className="text-left py-2 px-3 font-semibold text-gray-700">
            Header
          </th>
          <th className="text-left py-2 px-3 font-semibold text-gray-700">
            Value
          </th>
        </tr>
      </thead>
      <tbody>
        {entries.map(([key, value]) => {
          const isHighlighted =
            highlightKeys?.includes(key.toLowerCase()) ?? false;
          return (
            <tr
              key={key}
              className={`border-b border-gray-100 ${
                isHighlighted ? 'bg-blue-50' : ''
              }`}
            >
              <td className="py-2 px-3 font-mono text-gray-600">{key}</td>
              <td className="py-2 px-3 font-mono text-gray-800 break-all">
                {formatHeaderValue(value)}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
