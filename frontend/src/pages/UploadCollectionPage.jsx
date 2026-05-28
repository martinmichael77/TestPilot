import { useMemo, useState } from 'react';
import { Alert, Box, Button, LinearProgress, Stack } from '@mui/material';
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

  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const canRun = useMemo(() => Boolean(collectionFile) && !loading, [collectionFile, loading]);

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

  const handleRun = async () => {
    if (!collectionFile) {
      setError('Please upload a collection file to run tests.');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const execution = await runCollection({
        collectionFile,
        environmentFile,
        environmentVariables: toEnvironmentObject(variables),
      });

      localStorage.setItem('latestExecutionId', execution.executionId);
      enqueueSnackbar('Collection run completed.', { variant: 'success' });
      navigate(`/results/${execution.executionId}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Collection run failed.');
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
    </Stack>
  );
}
