import { useState } from 'react';
import {
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TextField,
  IconButton,
  Stack,
  Button,
  Typography,
} from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlineOutlined';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutlineOutlined';

export default function EnvVariableTable({ variables, onChange }) {
  const [draftKey, setDraftKey] = useState('');
  const [draftValue, setDraftValue] = useState('');

  const updateVariable = (index, field, value) => {
    const next = [...variables];
    next[index] = { ...next[index], [field]: value };
    onChange(next);
  };

  const deleteVariable = (index) => {
    onChange(variables.filter((_, idx) => idx !== index));
  };

  const addVariable = () => {
    if (!draftKey.trim()) return;
    onChange([...variables, { key: draftKey.trim(), value: draftValue }]);
    setDraftKey('');
    setDraftValue('');
  };

  return (
    <Paper variant="outlined" sx={{ p: 2 }}>
      <Typography variant="h6" mb={2}>
        Environment Variables
      </Typography>

      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Variable Name</TableCell>
            <TableCell>Value</TableCell>
            <TableCell align="right">Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {variables.map((variable, index) => (
            <TableRow key={`${variable.key}-${index}`}>
              <TableCell>
                <TextField
                  size="small"
                  fullWidth
                  value={variable.key}
                  onChange={(event) => updateVariable(index, 'key', event.target.value)}
                />
              </TableCell>
              <TableCell>
                <TextField
                  size="small"
                  fullWidth
                  value={variable.value}
                  onChange={(event) => updateVariable(index, 'value', event.target.value)}
                />
              </TableCell>
              <TableCell align="right">
                <IconButton color="error" onClick={() => deleteVariable(index)}>
                  <DeleteOutlineIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
          <TableRow>
            <TableCell>
              <TextField
                size="small"
                fullWidth
                placeholder="e.g. baseUrl"
                value={draftKey}
                onChange={(event) => setDraftKey(event.target.value)}
              />
            </TableCell>
            <TableCell>
              <TextField
                size="small"
                fullWidth
                placeholder="e.g. https://api.example.com"
                value={draftValue}
                onChange={(event) => setDraftValue(event.target.value)}
              />
            </TableCell>
            <TableCell align="right">
              <Button startIcon={<AddCircleOutlineIcon />} onClick={addVariable} variant="contained">
                Add
              </Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <Stack direction="row" spacing={1} mt={2}>
        <Button
          variant="outlined"
          onClick={() =>
            onChange([
              { key: 'baseUrl', value: 'https://api.example.com' },
              { key: 'authToken', value: 'paste-token-here' },
            ])
          }
        >
          Load sample values
        </Button>
      </Stack>
    </Paper>
  );
}
