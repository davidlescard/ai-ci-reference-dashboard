import { useEffect, useState } from 'react';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import { AppHeader } from './AppHeader';
import { RunDetail } from './RunDetail';
import { RunList } from './RunList';
import { tokens } from './tokens';

function parseHash(): { runId: number | null } {
  const match = /^#\/runs\/(\d+)$/.exec(window.location.hash);
  return { runId: match ? Number(match[1]) : null };
}

export function App() {
  const [route, setRoute] = useState(parseHash);

  useEffect(() => {
    const onChange = () => setRoute(parseHash());
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);

  return (
    <>
      <AppHeader />
      <Container component="main" maxWidth={false} sx={{ maxWidth: tokens.contentMaxWidth, py: 3 }}>
        <Stack spacing={3}>{route.runId === null ? <RunList /> : <RunDetail id={route.runId} />}</Stack>
      </Container>
    </>
  );
}
