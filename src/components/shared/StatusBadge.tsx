function getStatusColor(status: number): string {
  if (status >= 200 && status < 300) return 'bg-emerald-500';
  if (status >= 300 && status < 400) return 'bg-yellow-500';
  if (status >= 400 && status < 500) return 'bg-orange-500';
  if (status >= 500) return 'bg-red-600';
  return 'bg-gray-500';
}

export function StatusBadge({ status }: { status: number }) {
  const color = getStatusColor(status);
  return (
    <span
      className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-semibold text-white ${color}`}
    >
      {status}
    </span>
  );
}
