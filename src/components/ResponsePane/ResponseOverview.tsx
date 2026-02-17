import { StatusBadge } from '@/components/shared/StatusBadge';

const STATUS_TEXTS: Record<number, string> = {
  200: 'OK',
  201: 'Created',
  204: 'No Content',
  400: 'Bad Request',
  401: 'Unauthorized',
  403: 'Forbidden',
  404: 'Not Found',
  500: 'Internal Server Error',
};

function getStatusText(status: number): string {
  return STATUS_TEXTS[status] ?? '';
}

interface ResponseOverviewProps {
  status: number;
}

export function ResponseOverview({ status }: ResponseOverviewProps) {
  const text = getStatusText(status) || `Status ${status}`;
  return (
    <div className="flex items-center gap-2">
      <StatusBadge status={status} />
      <span className="text-lg font-semibold text-gray-800">
        {status} {text}
      </span>
    </div>
  );
}
