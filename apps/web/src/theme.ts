// The one MUI theme for the dashboard (BR1.1–BR1.6), built from the plain design tokens.
import { createTheme } from '@mui/material/styles';
import { focusRing, statusStyles, tokens } from './tokens';

export { statusStyles };

const ringStyles = {
  outline: focusRing(),
  outlineOffset: `${tokens.focusRingOffset}px`,
} as const;

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: tokens.accent, contrastText: '#FFFFFF' },
    background: { default: tokens.pageBackground, paper: tokens.surface },
    text: { primary: tokens.textPrimary, secondary: tokens.textSecondary },
    divider: tokens.border,
  },
  shape: { borderRadius: tokens.radius },
  typography: {
    fontFamily: tokens.fontFamily,
    h1: { fontSize: '1.25rem', fontWeight: 600, lineHeight: 1.4 },
    h2: { fontSize: '1.125rem', fontWeight: 600, lineHeight: 1.4 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        // Plain anchors and MUI Links (BR1.5); the header bar swaps this for a white ring.
        'a:focus-visible': ringStyles,
      },
    },
    // ButtonBase sets `outline: 0`, so the ring is set per control type (Button, Retry, TableSortLabel).
    MuiButtonBase: {
      styleOverrides: { root: { '&.Mui-focusVisible': ringStyles } },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        // Text fields and native selects: the ring replaces MUI's focused border color change.
        root: {
          '&.Mui-focused': ringStyles,
          '&.Mui-focused:not(.Mui-error) .MuiOutlinedInput-notchedOutline': {
            borderColor: tokens.border,
            borderWidth: tokens.borderWidth,
          },
        },
      },
    },
    MuiPaper: {
      defaultProps: { elevation: 0 },
    },
    MuiCard: {
      // Flat, bordered surface (BR1.2): Paper's outlined variant draws a 1px divider-colored border.
      defaultProps: { variant: 'outlined' },
      styleOverrides: { root: { boxShadow: 'none' } },
    },
    MuiAppBar: {
      styleOverrides: {
        root: { backgroundColor: tokens.headerBackground, color: tokens.headerText, boxShadow: 'none' },
      },
    },
    MuiLink: {
      defaultProps: { underline: 'hover' },
    },
    MuiChip: {
      styleOverrides: { label: { textTransform: 'none' } },
    },
    MuiTableCell: {
      styleOverrides: {
        root: { borderBottomColor: tokens.border },
        head: { fontWeight: 600, color: tokens.textPrimary },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: { '&.MuiTableRow-hover:hover': { backgroundColor: tokens.rowHover } },
      },
    },
    MuiTableSortLabel: {
      styleOverrides: {
        root: {
          '&.Mui-active': { color: tokens.accent },
          '&.Mui-active .MuiTableSortLabel-icon': { color: tokens.accent },
        },
      },
    },
  },
});
