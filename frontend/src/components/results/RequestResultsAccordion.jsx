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

// Enhanced AI-style beginner error explanations
function beginnerHint(statusCode, errorMessage) {
  const text = `${statusCode || ''} ${errorMessage || ''}`.toLowerCase();
  if (text.includes('401')) {
    return {
      main: 'Authentication failed.',
      causes: [
        'Expired token',
        'Missing Authorization header',
        'Incorrect environment variable',
      ],
    };
  }
  if (text.includes('403')) {
    return {
      main: 'Access forbidden. Your account may not have permission to access this API.',
      causes: [
        'Insufficient user role/permissions',
        'Trying to access a restricted resource',
        'Environment variable points to wrong server',
      ],
    };
  }
  if (text.includes('404')) {
    return {
      main: 'Resource not found. The endpoint path may be wrong or missing.',
      causes: [
        'Incorrect URL or path',
        'Environment variable not set',
        'API not deployed or typo in endpoint',
      ],
    };
  }
  if (text.includes('500')) {
    return {
      main: 'Server error. The backend failed to process your request.',
      causes: [
        'Bug in backend code',
        'Database/server outage',
        'Unexpected input or missing data',
      ],
    };
  }
  if (text.includes('timeout')) {
    return {
      main: 'API response is slow or timing out.',
      causes: [
        'Network/server load',
        'Long-running backend operation',
        'Unoptimized query or code',
      ],
    };
  }
  return {
    main: 'Verify expected status, payload, and auth values in your test assertion.',
    causes: [],
  };
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
              {result.errorMessage ? (() => {
                const hint = beginnerHint(result.statusCode, result.errorMessage);
                return (
                  <>
                    <Typography variant="body2" color="error.main">
                      <strong>Error:</strong> {result.errorMessage}
                    </Typography>
                    <Typography variant="body2" color="warning.main" sx={{ mt: 0.5 }}>
                      <strong>AI Explanation:</strong> {hint.main}
                    </Typography>
                    {hint.causes && hint.causes.length > 0 && (
                      <ul style={{ margin: '4px 0 0 20px', color: '#fbbf24', fontSize: '0.95em' }}>
                        {hint.causes.map((cause, i) => (
                          <li key={i}>{cause}</li>
                        ))}
                      </ul>
                    )}
                  </>
                );
              })() : null}
              {/* Slow API Detection */}
              {result.responseTime > 1000 && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                  <Typography variant="body2" color="warning.main" fontWeight={600}>
                    ⚠ Slow Endpoint
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Response Time: {(result.responseTime / 1000).toFixed(2)}s
                  </Typography>
                </Box>
              )}
              <Divider sx={{ mt: 1 }} />
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
