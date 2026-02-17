export function prettifyBody(body: unknown): string {
  if (body === undefined || body === null) return '';
  if (typeof body === 'string') {
    try {
      const parsed = JSON.parse(body);
      return JSON.stringify(parsed, null, 2);
    } catch {
      return body;
    }
  }
  try {
    return JSON.stringify(body, null, 2);
  } catch {
    return String(body);
  }
}
