import { Box, Typography } from '@mui/material';

export default function WebhookRequests() {
  return (
    <Box>
      <Typography variant="h4" mb={3} fontWeight={700}>
        Captured Webhook Requests
      </Typography>
      {/* TODO: Live viewer, request list */}
    </Box>
  );
}
