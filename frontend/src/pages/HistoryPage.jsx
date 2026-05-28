import { useCallback, useEffect, useState } from 'react';
import { Alert, Button, CircularProgress, Stack } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlineOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import PageHeader from '../components/common/PageHeader';
import { deleteExecution, fetchExecutionHistory } from '../api/executionApi';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';

export default function HistoryPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const loadHistory = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const data = await fetchExecutionHistory();
      setRows((data || []).map((row) => ({ id: row.executionId, ...row })));
    } catch (err) {
      setError(err.response?.data?.message || 'Could not fetch execution history.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const handleDelete = async (id) => {
    try {
      await deleteExecution(id);
      enqueueSnackbar('Execution deleted.', { variant: 'success' });
      loadHistory();
    } catch (err) {
      enqueueSnackbar(err.response?.data?.message || 'Failed to delete execution.', { variant: 'error' });
    }
  };

  const columns = [
    { field: 'collectionName', headerName: 'Collection Name', flex: 1.2 },
    { field: 'runDate', headerName: 'Run Date', flex: 1 },
    { field: 'passPercentage', headerName: 'Pass %', width: 100 },
    { field: 'duration', headerName: 'Duration (ms)', width: 130 },
    { field: 'averageResponseTime', headerName: 'Avg Response (ms)', width: 150 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 220,
      sortable: false,
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          <Button
            size="small"
            startIcon={<VisibilityOutlinedIcon />}
            onClick={() => navigate(`/results/${params.row.executionId}`)}
          >
            View
          </Button>
          <Button
            size="small"
            color="error"
            startIcon={<DeleteOutlineIcon />}
            onClick={() => handleDelete(params.row.executionId)}
          >
            Delete
          </Button>
        </Stack>
      ),
    },
  ];

  return (
    <Stack spacing={2}>
      <PageHeader title="Execution History" subtitle="Review previous runs and open full result details." />
      {loading ? <CircularProgress /> : null}
      {error ? <Alert severity="error">{error}</Alert> : null}
      <DataGrid
        autoHeight
        rows={rows}
        columns={columns}
        disableRowSelectionOnClick
        pageSizeOptions={[5, 10, 20]}
        initialState={{
          pagination: {
            paginationModel: { pageSize: 10, page: 0 },
          },
        }}
      />
    </Stack>
  );
}
