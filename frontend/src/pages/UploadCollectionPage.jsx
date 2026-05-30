import { useMemo, useState } from 'react';
import { Alert, Box, Button, LinearProgress, Stack, Typography, Dialog, DialogContent } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import PageHeader from '../components/common/PageHeader';
import FileDropzone from '../components/upload/FileDropzone';
import EnvVariableTable from '../components/env/EnvVariableTable';
import { runCollection, validateUpload } from '../api/executionApi';

function toEnvironmentObject(variables) {
  return variables.reduce((acc, variable) => {
    if (variable.key?.trim()) {
      acc[variable.key.trim()] = variable.value || '';
    }
    return acc;
  }, {});
}


export default function UploadCollectionPage() {
  const [collectionFile, setCollectionFile] = useState(null);
  const [environmentFile, setEnvironmentFile] = useState(null);
  const [variables, setVariables] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [progressOpen, setProgressOpen] = useState(false);
  const [progressStep, setProgressStep] = useState(0);
  const [progressTotal, setProgressTotal] = useState(1);
  const [progressMsg, setProgressMsg] = useState('');

  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const canRun = useMemo(() => Boolean(collectionFile) && !loading, [collectionFile, loading]);

  // Simulated progress steps for demo and normal run
  const progressSteps = [
    '✓ Collection Uploaded',
    '✓ Environment Loaded',
    '⏳ Running Requests',
    '✓ Generating Report',
  ];

  // Helper to show progress dialog
  const showProgress = (step, total, msg) => {
    setProgressOpen(true);
    setProgressStep(step);
    setProgressTotal(total);
    setProgressMsg(msg);
  };

  // Hide progress dialog
  const hideProgress = () => {
    setProgressOpen(false);
    setProgressStep(0);
    setProgressMsg('');
  };

  const handleValidate = async () => {
    if (!collectionFile) {
      setError('Please upload a collection file first.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const response = await validateUpload(collectionFile, environmentFile);
      setVariables(response.environment.variables || []);
      enqueueSnackbar('Files validated successfully.', { variant: 'success' });
    } catch (err) {
      setError(err.response?.data?.message || 'Validation failed. Please check your files.');
    } finally {
      setLoading(false);
    }
  };

  // Simulate progress for normal and demo run
  const runWithProgress = async (runArgs) => {
    setError('');
    setLoading(true);
    setProgressOpen(true);
    setProgressStep(0);
    setProgressMsg(progressSteps[0]);
    setProgressTotal(progressSteps.length);
    try {
      // Step 1: Collection Uploaded
      showProgress(1, progressSteps.length, progressSteps[0]);
      await new Promise((res) => setTimeout(res, 400));
      // Step 2: Environment Loaded
      showProgress(2, progressSteps.length, progressSteps[1]);
      await new Promise((res) => setTimeout(res, 400));
      // Step 3: Running Requests (simulate progress for 5 requests)
      const totalRequests = 5;
      for (let i = 1; i <= totalRequests; i++) {
        showProgress(2 + i / (totalRequests + 1), progressSteps.length, `⏳ Running Request ${i}/${totalRequests}`);
        await new Promise((res) => setTimeout(res, 350));
      }
      // Step 4: Generating Report
      showProgress(progressSteps.length, progressSteps.length, progressSteps[3]);
      await new Promise((res) => setTimeout(res, 500));
      // Actually run the collection
      const execution = await runCollection(runArgs);
      localStorage.setItem('latestExecutionId', execution.executionId);
      enqueueSnackbar('Collection run completed.', { variant: 'success' });
      hideProgress();
      navigate(`/results/${execution.executionId}`);
    } catch (err) {
      hideProgress();
      setError(err.response?.data?.message || 'Collection run failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleRun = async () => {
    if (!collectionFile) {
      setError('Please upload a collection file to run tests.');
      return;
    }
    await runWithProgress({
      collectionFile,
      environmentFile,
      environmentVariables: toEnvironmentObject(variables),
    });
  };

  // DEMO MODE: Load demo files from public and run
  const handleDemo = async () => {
    setError('');
    setLoading(true);
    setProgressOpen(true);
    setProgressStep(0);
    setProgressMsg('Loading demo files...');
    setProgressTotal(progressSteps.length);
    try {
      // Fetch demo collection
      const [collectionResp, envResp] = await Promise.all([
        fetch('/demo-collection.json'),
        fetch('/demo-environment.json'),
      ]);
      const [collectionBlob, envBlob] = await Promise.all([
        collectionResp.blob(),
        envResp.blob(),
      ]);
      const collectionFile = new File([collectionBlob], 'demo-collection.json', { type: 'application/json' });
      const environmentFile = new File([envBlob], 'demo-environment.json', { type: 'application/json' });
      // Run with progress
      await runWithProgress({
        collectionFile,
        environmentFile,
        environmentVariables: {},
      });
    } catch (err) {
      hideProgress();
      setError('Failed to load demo files.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Stack spacing={2.5}>
      <PageHeader
        title="Upload & Run Collection"
        subtitle="Upload a Postman collection, configure variables, and run tests without command line tools."
      />

      {loading ? <LinearProgress /> : null}
      {error ? <Alert severity="error">{error}</Alert> : null}

      <Button
        variant="contained"
        color="secondary"
        sx={{ alignSelf: 'flex-start', mb: 1 }}
        onClick={handleDemo}
        disabled={loading}
      >
        🚀 Try Demo Collection
      </Button>

      <FileDropzone
        label="Postman Collection JSON"
        file={collectionFile}
        onFileAccepted={setCollectionFile}
        onRemove={() => setCollectionFile(null)}
      />

      <FileDropzone
        label="Environment JSON"
        file={environmentFile}
        optional
        onFileAccepted={setEnvironmentFile}
        onRemove={() => setEnvironmentFile(null)}
      />

      <EnvVariableTable variables={variables} onChange={setVariables} />

      <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
        <Button variant="outlined" onClick={handleValidate} disabled={!collectionFile || loading}>
          Validate Files
        </Button>
        <Button variant="contained" onClick={handleRun} disabled={!canRun}>
          Run Collection
        </Button>
      </Box>

      {/* Progress Dialog */}
      <Dialog open={progressOpen} maxWidth="xs" fullWidth>
        <DialogContent>
          <Stack spacing={2} alignItems="center" sx={{ py: 2 }}>
            <Typography variant="h6">Execution Progress</Typography>
            <LinearProgress variant="determinate" value={Math.min((progressStep / progressTotal) * 100, 100)} sx={{ width: '100%' }} />
            <Typography>{progressMsg}</Typography>
          </Stack>
        </DialogContent>
      </Dialog>
    </Stack>
  );
}
