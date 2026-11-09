import { test, expect } from '@playwright/test';
import { statusStyles, tokens } from '../../../apps/web/src/tokens';

// WCAG 2.1 relative luminance and contrast ratio for #RRGGBB colors.
function luminance(hex: string): number {
    const match = /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(hex);
    if (!match) throw new Error(`Expected a #RRGGBB color, received "${hex}"`);
    const [r, g, b] = match.slice(1).map((part) => {
        const channel = parseInt(part, 16) / 255;
        return channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(foreground: string, background: string): number {
    const [light, dark] = [luminance(foreground), luminance(background)].sort((a, b) => b - a);
    return (light + 0.05) / (dark + 0.05);
}

const AA_NORMAL_TEXT = 4.5;

// U3 (FR1.3, NFR3, BR1.6): every text/background pair the theme defines reaches WCAG AA.
test('status, text and header colors reach at least 4.5:1 contrast', () => {
    expect(contrast('#FFFFFF', '#000000'), 'contrast helper sanity check').toBeCloseTo(21, 5);

    const pairs: [string, string, string][] = [
        ...Object.entries(statusStyles).map(
            ([status, style]): [string, string, string] => [`${status} badge`, style.foreground, style.background],
        ),
        ['primary text on page', tokens.textPrimary, tokens.pageBackground],
        ['primary text on surface', tokens.textPrimary, tokens.surface],
        ['secondary text on page', tokens.textSecondary, tokens.pageBackground],
        ['secondary text on surface', tokens.textSecondary, tokens.surface],
        ['header text on header', tokens.headerText, tokens.headerBackground],
    ];
    expect(Object.keys(statusStyles).sort()).toEqual(['failed', 'passed', 'queued', 'running']);
    for (const [label, foreground, background] of pairs) {
        expect(contrast(foreground, background), label).toBeGreaterThanOrEqual(AA_NORMAL_TEXT);
    }
});
