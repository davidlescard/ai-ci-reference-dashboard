import { useEffect, useState } from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { api, ApiError, STATUSES, type Run, type Status } from './api';
import { formatCreated, formatDuration } from './format';
import { StatusBadge } from './StatusBadge';

export function RunDetail({ id }: { id: number }) {
  const [run, setRun] = useState<Run | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [updateError, setUpdateError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setRun(null);
    setError(null);
    api
      .getRun(id)
      .then((data) => !cancelled && setRun(data))
      .catch((err) => !cancelled && setError(err instanceof ApiError && err.message === 'Run not found' ? 'Run not found.' : 'Unable to load this run.'));
    return () => {
      cancelled = true;
    };
  }, [id]);

  async function changeStatus(status: Status) {
    setUpdateError(null);
    try {
      setRun(await api.updateStatus(id, status));
    } catch {
      setUpdateError('Unable to update the status. Please try again.');
    }
  }

  return (
    <Card component="section" aria-labelledby="detail-heading" data-testid="run-detail">
      <CardContent>
        <Stack spacing={2}>
          {/* Outside the state branches so it shows while loading, loaded, not found and on error (BR5.1). */}
          <Link href="#/" data-testid="run-detail-back-link" sx={{ alignSelf: 'flex-start' }}>
            Back to runs
          </Link>
          {error && <Alert severity="error">{error}</Alert>}
          {!run && !error && <Typography role="status">Loading run...</Typography>}
          {run && (
            <>
              <Typography variant="h2" component="h2" id="detail-heading">
                {run.name}
              </Typography>
              <Box
                component="dl"
                sx={{
                  m: 0,
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', sm: 'max-content 1fr' },
                  columnGap: 3,
                  rowGap: { xs: 0.5, sm: 1.5 },
                  alignItems: 'center',
                  '& dt': { color: 'text.secondary', fontWeight: 500 },
                  '& dd': { m: 0, mb: { xs: 1, sm: 0 } },
                }}
              >
                <dt>Branch</dt>
                <dd>{run.branch}</dd>
                <dt>Status</dt>
                <dd>
                  <StatusBadge status={run.status} />
                </dd>
                <dt>Duration</dt>
                <dd>{formatDuration(run.durationSeconds)}</dd>
                <dt>Created</dt>
                <dd data-testid="run-detail-created">{formatCreated(run.createdAt)}</dd>
                <dt>Notes</dt>
                <dd>{run.notes || 'None'}</dd>
              </Box>
              <TextField
                id="run-update-status"
                select
                label="Update status"
                size="small"
                value={run.status}
                onChange={(e) => changeStatus(e.target.value as Status)}
                sx={{ width: { xs: '100%', sm: 220 } }}
                slotProps={{
                  select: { native: true },
                  inputLabel: { shrink: true },
                  htmlInput: { 'data-testid': 'run-detail-update-status' },
                }}
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </TextField>
              {updateError && <Alert severity="error">{updateError}</Alert>}
            </>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}
