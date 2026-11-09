import AppBar from '@mui/material/AppBar';
import Link from '@mui/material/Link';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { focusRing, tokens } from './tokens';

// Indigo top bar with the level-1 title that links back to the runs list (BR2.1, BR1.1).
export function AppHeader() {
  return (
    <AppBar position="static" elevation={0} data-testid="app-header">
      <Toolbar sx={{ maxWidth: tokens.contentMaxWidth, width: '100%', mx: 'auto' }}>
        <Typography variant="h1" component="h1" sx={{ color: tokens.headerText }}>
          <Link
            href="#/"
            color="inherit"
            underline="none"
            data-testid="app-header-home-link"
            sx={{
              // White ring for contrast against the indigo bar (BR1.5).
              '&:focus-visible': { outline: focusRing(tokens.headerText), outlineOffset: `${tokens.focusRingOffset}px` },
            }}
          >
            Release Quality Dashboard
          </Link>
        </Typography>
      </Toolbar>
    </AppBar>
  );
}
