// Display formatting for run values (BR7.1, BR7.2). Pure functions with no DOM or library dependency.

/**
 * Formats a duration in whole seconds as its non-zero hours, minutes and seconds, largest first
 * (e.g. 85 -> "1m 25s", 120 -> "2m", 3903 -> "1h 5m 3s"); zero gives "0s".
 * A value outside the API contract (negative or not a finite number) is shown as received rather than
 * breaking the whole screen, matching how formatCreated treats an unparseable date.
 */
export function formatDuration(totalSeconds: number): string {
  if (!Number.isFinite(totalSeconds) || totalSeconds < 0) return String(totalSeconds);
  const seconds = Math.floor(totalSeconds);
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const rest = seconds % 60;
  const parts = [
    hours > 0 ? `${hours}h` : '',
    minutes > 0 ? `${minutes}m` : '',
    rest > 0 ? `${rest}s` : '',
  ].filter(Boolean);
  return parts.length > 0 ? parts.join(' ') : '0s';
}

const createdFormatter = new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' });

/**
 * Formats an ISO-8601 timestamp as a medium date with short time in the browser's locale and time zone
 * (e.g. "Nov 8, 2026, 6:47 PM"). A value that does not parse as a date is returned unchanged.
 */
export function formatCreated(iso: string): string {
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? iso : createdFormatter.format(date);
}
