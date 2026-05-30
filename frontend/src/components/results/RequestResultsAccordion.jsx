import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Chip,
  Stack,
  Typography,
  Box,
  Divider,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

function beginnerHint(statusCode, errorMessage) {
  const text = `${statusCode || ''} ${errorMessage || ''}`.toLowerCase();
  if (text.includes('401')) return 'Authentication token may be missing or expired.';
  if (text.includes('403')) return 'Your account may not have permission to access this API.';
  if (text.includes('404')) return 'The endpoint path may be wrong or missing in this environment.';
  if (text.includes('500')) return 'Server-side issue detected. Ask backend team to check logs.';
  if (text.includes('timeout')) return 'API response is slow or timing out. Check network/server load.';
  return 'Verify expected status, payload, and auth values in your test assertion.';
}

export default function RequestResultsAccordion({ results }) {
  return (
    <Stack spacing={1.5}>
      {results.map((result, index) => (
        <Accordion key={`${result.requestName}-${index}`}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5} alignItems={{ md: 'center' }} width="100%">
              <Typography fontWeight={600}>{result.requestName}</Typography>
              <Chip label={result.method} size="small" />
              <Chip label={`Status ${result.statusCode}`} size="small" />
              <Chip label={`${result.responseTime} ms`} size="small" />
              <Chip
                label={result.passed ? 'Pass' : 'Fail'}
                color={result.passed ? 'success' : 'error'}
                size="small"
              />
            </Stack>
          </AccordionSummary>
          <AccordionDetails>
            <Stack spacing={1}>
              <Typography variant="body2">
                <strong>Response Status:</strong> {result.responseStatus}
              </Typography>
              {result.errorMessage ? (
                <>
                  <Typography variant="body2" color="error.main">
                    <strong>Error:</strong> {result.errorMessage}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>What this might mean:</strong> {beginnerHint(result.statusCode, result.errorMessage)}
                  </Typography>
                </>
              ) : null}
              <Divider />
              <Typography variant="subtitle2">Assertion Details</Typography>
              {result.assertionResults?.map((assertion, assertionIndex) => (
                <Box key={`${assertion.name}-${assertionIndex}`} sx={{ p: 1.2, borderRadius: 1.5, bgcolor: 'action.hover' }}>
                  <Typography variant="body2">
                    <strong>{assertion.name}</strong> - {assertion.passed ? 'Passed' : 'Failed'}
                  </Typography>
                  {!assertion.passed ? (
                    <Typography variant="caption" color="text.secondary">
                      Reason: {assertion.errorReason || 'Assertion failed.'}
                    </Typography>
                  ) : null}
                </Box>
              ))}

              {result.responseBodyPreview ? (
                <>
                  <Divider />
                  <Typography variant="subtitle2">Response Body Preview</Typography>
                  <Box
                    component="pre"
                    sx={{
                      p: 1.2,
                      borderRadius: 1.5,
                      bgcolor: (theme) => theme.palette.mode === 'dark' ? 'grey.900' : 'background.paper',
                      color: (theme) => theme.palette.mode === 'dark' ? 'grey.100' : 'text.primary',
                      overflowX: 'auto',
                      overflowY: 'auto',
                      m: 0,
                      fontFamily: 'monospace',
                      maxHeight: 320,
                      whiteSpace: 'pre',
                    }}
                  >
                    {(() => {
                      try {
                        return JSON.stringify(JSON.parse(result.responseBodyPreview), null, 2);
                      } catch {
                        return result.responseBodyPreview;
                      }
                    })()}
                  </Box>
                </>
              ) : null}
            </Stack>
          </AccordionDetails>
        </Accordion>
      ))}
    </Stack>
  );
}
