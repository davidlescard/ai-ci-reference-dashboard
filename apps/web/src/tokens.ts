// Design tokens: the single source of the dashboard's colors and sizes (entities.md ThemeTokens, StatusStyle).
// Plain values only, with no MUI import, so the unit tests can load this module without a browser.
import type { Status } from './api';

const ACCENT = '#4F46E5';

export const tokens = {
  accent: ACCENT,
  pageBackground: '#F8FAFC',
  surface: '#FFFFFF',
  border: '#E2E8F0',
  borderWidth: 1,
  rowHover: '#F1F5F9',
  headerBackground: ACCENT,
  headerText: '#FFFFFF',
  textPrimary: '#0F172A',
  textSecondary: '#475569',
  radius: 8,
  focusRingWidth: 2,
  focusRingOffset: 2,
  focusRingColor: ACCENT,
  fontFamily: '"Inter", system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  contentMaxWidth: 1100,
  narrowBreakpoint: 600,
} as const;

export type StatusIconName = 'clock' | 'sync' | 'check-circle' | 'error';

export interface StatusStyle {
  background: string;
  foreground: string;
  icon: StatusIconName;
}

// Defined once (BR1.4); every status display reads from here. White text on each reaches >= 4.5:1 (BR1.6).
export const statusStyles: Record<Status, StatusStyle> = {
  queued: { background: '#475569', foreground: '#FFFFFF', icon: 'clock' },
  running: { background: '#1D4ED8', foreground: '#FFFFFF', icon: 'sync' },
  passed: { background: '#15803D', foreground: '#FFFFFF', icon: 'check-circle' },
  failed: { background: '#B91C1C', foreground: '#FFFFFF', icon: 'error' },
};

/** CSS outline value for the keyboard focus ring (BR1.5). */
export const focusRing = (color: string = tokens.focusRingColor) => `${tokens.focusRingWidth}px solid ${color}`;
