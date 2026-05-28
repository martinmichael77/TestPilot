import { useEffect, useState } from 'react';
import { Alert, CircularProgress, Stack } from '@mui/material';
import PageHeader from '../components/common/PageHeader';
import StatsOverview from '../components/dashboard/StatsOverview';
import { fetchExecutionHistory } from '../api/executionApi';

export default function DashboardPage() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    fetchExecutionHistory()
      .then((data) => {
        if (mounted) setHistory(data || []);
      })
      .catch((err) => {
        if (mounted) setError(err.response?.data?.message || 'Could not load dashboard data.');
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <Stack spacing={2}>
      <PageHeader
        title="QA Dashboard"
        subtitle="Track API run counts, pass/fail status, and performance in one place."
      />
      {loading ? <CircularProgress /> : null}
      {error ? <Alert severity="error">{error}</Alert> : null}
      {!loading && !error ? <StatsOverview history={history} /> : null}
    </Stack>
  );
}
