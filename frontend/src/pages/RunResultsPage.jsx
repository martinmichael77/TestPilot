import { useEffect, useMemo, useState } from 'react';
import { Alert, Button, CircularProgress, MenuItem, Stack, TextField } from '@mui/material';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import { useNavigate, useParams } from 'react-router-dom';
import PageHeader from '../components/common/PageHeader';
import ResultsSummaryCards from '../components/results/ResultsSummaryCards';
import RequestResultsAccordion from '../components/results/RequestResultsAccordion';
import { fetchExecutionById, getReportDownloadUrl } from '../api/executionApi';
import { calculateSummary } from '../utils/resultUtils';

export default function RunResultsPage() {
  const { executionId } = useParams();
  const navigate = useNavigate();
  const [execution, setExecution] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const id = executionId || localStorage.getItem('latestExecutionId');
    if (!id) {
      setLoading(false);
      setError('No execution selected yet. Run a collection first.');
      return;
    }

    fetchExecutionById(id)
      .then((data) => setExecution(data))
      .catch((err) => setError(err.response?.data?.message || 'Could not load execution details.'))
      .finally(() => setLoading(false));
  }, [executionId]);

  const summary = useMemo(() => calculateSummary(execution), [execution]);

  const filteredResults = useMemo(() => {
    if (!execution?.results) return [];

    return execution.results.filter((result) => {
      const matchQuery = result.requestName.toLowerCase().includes(query.toLowerCase());
      if (!matchQuery) return false;
      if (filter === 'passed') return result.passed;
      if (filter === 'failed') return !result.passed;
      if (filter === 'slow') return result.responseTime > 1000;
      return true;
    });
  }, [execution, query, filter]);

  const downloadButtons = execution ? (
    <Stack direction="row" spacing={1}>
      {['html', 'pdf', 'csv'].map((format) => (
        <Button
          key={format}
          variant="outlined"
          size="small"
          startIcon={<DownloadOutlinedIcon />}
          component="a"
          href={getReportDownloadUrl(execution.executionId, format)}
          target="_blank"
          rel="noreferrer"
        >
          {format.toUpperCase()}
        </Button>
      ))}
    </Stack>
  ) : null;

  return (
    <Stack spacing={2}>
      <PageHeader
        title="Run Results"
        subtitle="Review pass/fail outcomes and assertion details request-by-request."
        actions={downloadButtons}
      />

      {loading ? <CircularProgress /> : null}
      {error ? <Alert severity="error">{error}</Alert> : null}

      {!loading && !execution ? (
        <Button variant="contained" onClick={() => navigate('/upload')}>
          Go to Upload Page
        </Button>
      ) : null}

      {execution ? (
        <>
          <ResultsSummaryCards summary={summary} />
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5}>
            <TextField
              label="Search by request name"
              size="small"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              fullWidth
            />
            <TextField
              select
              label="Filter"
              size="small"
              value={filter}
              onChange={(event) => setFilter(event.target.value)}
              sx={{ minWidth: 180 }}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="passed">Passed only</MenuItem>
              <MenuItem value="failed">Failed only</MenuItem>
              <MenuItem value="slow">Slow APIs (over 1000ms)</MenuItem>
            </TextField>
          </Stack>
          <RequestResultsAccordion results={filteredResults} />
        </>
      ) : null}
    </Stack>
  );
}
