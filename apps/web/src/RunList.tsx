import { useEffect, useState } from 'react';
import { api, STATUSES, type Run } from './api';
import { NewRunForm } from './NewRunForm';

export function RunList() {
  const [runs, setRuns] = useState<Run[]>([]);
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

  return (
    <>
      <section aria-labelledby="filters-heading">
        <h2 id="filters-heading">Test runs</h2>
        <div className="filters">
          <label>
            Search runs
            <input type="search" value={search} onChange={(e) => setSearch(e.target.value)} />
          </label>
          <label>
            Status
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="">All statuses</option>
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>
        </div>

        {error && (
          <div role="alert" className="error">
            <p>{error}</p>
            <button type="button" onClick={() => setReloadKey((k) => k + 1)}>
              Retry
            </button>
          </div>
        )}
        {loading && !error && <p role="status">Loading runs...</p>}
        {!loading && !error && runs.length === 0 && <p>No test runs match your filters.</p>}
        {!error && runs.length > 0 && (
          <table>
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Branch</th>
                <th scope="col">Status</th>
                <th scope="col">Duration (s)</th>
              </tr>
            </thead>
            <tbody>
              {runs.map((run) => (
                <tr key={run.id}>
                  <td>
                    <a href={`#/runs/${run.id}`}>{run.name}</a>
                  </td>
                  <td>{run.branch}</td>
                  <td>
                    <span className={`badge ${run.status}`}>{run.status}</span>
                  </td>
                  <td>{run.durationSeconds}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <NewRunForm onCreated={() => setReloadKey((k) => k + 1)} />
    </>
  );
}
