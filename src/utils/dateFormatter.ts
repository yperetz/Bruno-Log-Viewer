import { format, parseISO } from 'date-fns';

export function formatTimestamp(iso: string): string {
  try {
    const date = parseISO(iso);
    return format(date, 'HH:mm:ss');
  } catch {
    return iso;
  }
}

export function formatDateForDisplay(dateStr: string): string {
  try {
    const [y, m, d] = dateStr.split('-');
    const date = new Date(parseInt(y!, 10), parseInt(m!, 10) - 1, parseInt(d!, 10));
    return format(date, 'EEE, MMM d, yyyy');
  } catch {
    return dateStr;
  }
}
