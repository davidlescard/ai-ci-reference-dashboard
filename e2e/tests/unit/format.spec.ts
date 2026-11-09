import { test, expect } from '@playwright/test';
import { formatCreated, formatDuration } from '../../../apps/web/src/format';

test.describe('formatDuration', () => {
    // U1 (FR7.1, BR7.1): non-zero units only, largest first; zero is "0s".
    test('shows only the non-zero hours, minutes and seconds', () => {
        const examples: [number, string][] = [
            [0, '0s'],
            [45, '45s'],
            [85, '1m 25s'],
            [120, '2m'],
            [3903, '1h 5m 3s'],
        ];
        for (const [seconds, expected] of examples) {
            expect(formatDuration(seconds), `${seconds} seconds`).toBe(expected);
        }
    });
});

test.describe('formatCreated', () => {
    // U2 (FR7.2, BR7.2): readable locale date for a valid timestamp; an unparseable value is shown as received.
    test('formats a valid timestamp readably and returns an invalid one unchanged', () => {
        const iso = '2026-01-05T09:00:00.000Z';
        const formatted = formatCreated(iso);
        expect(formatted).not.toBe(iso);
        expect(formatted).not.toContain('T09:00');
        expect(formatted).toContain('2026');

        expect(formatCreated('not a date')).toBe('not a date');
        expect(formatCreated('')).toBe('');
    });
});
