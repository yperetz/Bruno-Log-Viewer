const METHOD_COLORS: Record<string, string> = {
  GET: 'bg-blue-500',
  POST: 'bg-emerald-500',
  PUT: 'bg-amber-500',
  DELETE: 'bg-red-500',
  PATCH: 'bg-violet-500',
  OPTIONS: 'bg-gray-500',
};

export function MethodBadge({ method }: { method: string }) {
  const color = METHOD_COLORS[method.toUpperCase()] ?? 'bg-gray-500';
  return (
    <span
      className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-semibold text-white ${color}`}
    >
      {method}
    </span>
  );
}
