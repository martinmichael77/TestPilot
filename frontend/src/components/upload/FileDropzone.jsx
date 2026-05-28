import { useMemo } from 'react';
import { useDropzone } from 'react-dropzone';
import { Box, Typography, Paper, Button, Stack } from '@mui/material';
import UploadFileOutlinedIcon from '@mui/icons-material/UploadFileOutlined';

export default function FileDropzone({ label, file, onFileAccepted, onRemove, optional = false }) {
  const onDrop = (acceptedFiles, rejectedFiles) => {
    if (acceptedFiles.length > 0) {
      onFileAccepted(acceptedFiles[0]);
    }
    if (rejectedFiles.length > 0) {
      onFileAccepted(null);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      'application/json': ['.json'],
      'text/plain': ['.json'],
    },
  });

  const borderColor = useMemo(() => (isDragActive ? 'primary.main' : 'divider'), [isDragActive]);

  return (
    <Paper
      {...getRootProps()}
      variant="outlined"
      sx={{
        p: 3,
        borderStyle: 'dashed',
        borderWidth: 2,
        borderColor,
        cursor: 'pointer',
      }}
    >
      <input {...getInputProps()} />
      <Stack spacing={1.5} alignItems="center" textAlign="center">
        <UploadFileOutlinedIcon color="primary" fontSize="large" />
        <Typography variant="h6">{label}</Typography>
        <Typography color="text.secondary">
          Drag and drop a .json file here, or click to choose a file {optional ? '(optional)' : ''}
        </Typography>
        {file ? (
          <Box>
            <Typography fontWeight={600}>{file.name}</Typography>
            <Button
              variant="text"
              color="error"
              onClick={(event) => {
                event.stopPropagation();
                onRemove();
              }}
            >
              Remove file
            </Button>
          </Box>
        ) : null}
      </Stack>
    </Paper>
  );
}
