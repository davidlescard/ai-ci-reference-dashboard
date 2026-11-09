import { useEffect, useState } from 'react';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { api, STATUSES, type Run } from './api';
import { formatDuration } from './format';
import { NewRunForm } from './NewRunForm';
import { StatusBadge } from './StatusBadge';

type SortKey = 'name' | 'branch' | 'status' | 'durationSeconds';
type SortDir = 'ascending' | 'descending';

const COLUMNS: { key: SortKey; label: string }[] = [
  { key: 'name', label: 'Name' },
  { key: 'branch', label: 'Branch' },
  { key: 'status', label: 'Status' },
  { key: 'durationSeconds', label: 'Duration' },
];

// MUI uses asc/desc; the state and aria-sort keep the ARIA words (BR3.2).
const toMuiDirection = (dir: SortDir) => (dir === 'ascending' ? 'asc' : 'desc');

function sortRuns(runs: Run[], sort: { key: SortKey; dir: SortDir } | null): Run[] {
  if (!sort) return runs;
  const factor = sort.dir === 'ascending' ? 1 : -1;
  return [...runs].sort((a, b) => {
    const x = a[sort.key];
    const y = b[sort.key];
    const result = typeof x === 'number' && typeof y === 'number' ? x - y : String(x).localeCompare(String(y));
    return result * factor;
  });
}

export function RunList() {
  const [runs, setRuns] = useState<Run[]>([]);
  const [sort, setSort] = useState<{ key: SortKey; dir: SortDir } | null>(null);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    api
      .listRuns(search, status)
      .then((data) => !cancelled && setRuns(data))
      .catch(() => !cancelled && setError('Unable to load test runs. Please try again.'))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [search, status, reloadKey]);

  const sortedRuns = sortRuns(runs, sort);
  const toggleSort = (key: SortKey) =>
    setSort((current) => ({ key, dir: current?.key === key && current.dir === 'ascending' ? 'descending' : 'ascending' }));

  return (
    <>
      <Card component="section" aria-labelledby="filters-heading" data-testid="run-list">
        <CardContent>
          <Stack spacing={2}>
            <Typography variant="h2" component="h2" id="filters-heading">
              Test runs
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                id="run-search"
                type="search"
                label="Search runs"
                size="small"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                sx={{ width: { xs: '100%', sm: 280 } }}
                slotProps={{ htmlInput: { 'data-testid': 'run-list-search-input' } }}
              />
              <TextField
                id="run-status-filter"
                select
                label="Status"
                size="small"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                sx={{ width: { xs: '100%', sm: 200 } }}
                slotProps={{
                  select: { native: true },
                  inputLabel: { shrink: true },
                  htmlInput: { 'data-testid': 'run-list-status-filter' },
                }}
              >
                <option value="">All statuses</option>
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </TextField>
            </Stack>

            {error && (
              <Alert
                severity="error"
                action={
                  <Button color="inherit" size="small" onClick={() => setReloadKey((k) => k + 1)} data-testid="run-list-retry-button">
                    Retry
                  </Button>
                }
              >
                {error}
              </Alert>
            )}
            {loading && !error && <Typography role="status">Loading runs...</Typography>}
            {!loading && !error && runs.length === 0 && <Typography color="text.secondary">No test runs match your filters.</Typography>}
            {!error && runs.length > 0 && (
              <TableContainer data-testid="run-list-table-container" sx={{ overflowX: 'auto' }}>
                <Table aria-label="Test runs" sx={{ minWidth: 560 }}>
                  <TableHead>
                    <TableRow>
                      {COLUMNS.map(({ key, label }) => {
                        const isSorted = sort?.key === key;
                        return (
                          <TableCell key={key} scope="col" sortDirection={isSorted ? toMuiDirection(sort.dir) : false}>
                            <TableSortLabel
                              active={isSorted}
                              direction={isSorted ? toMuiDirection(sort.dir) : 'asc'}
                              onClick={() => toggleSort(key)}
                              data-testid={`run-list-sort-${key}`}
                            >
                              {label}
                            </TableSortLabel>
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {sortedRuns.map((run) => (
                      <TableRow key={run.id} hover>
                        <TableCell>
                          <Link href={`#/runs/${run.id}`} data-testid="run-list-run-link">
                            {run.name}
                          </Link>
                        </TableCell>
                        <TableCell>{run.branch}</TableCell>
                        <TableCell>
                          <StatusBadge status={run.status} />
                        </TableCell>
                        <TableCell>{formatDuration(run.durationSeconds)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Stack>
        </CardContent>
      </Card>

      <NewRunForm onCreated={() => setReloadKey((k) => k + 1)} />
    </>
  );
}
