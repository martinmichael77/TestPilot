import { Box, Typography } from '@mui/material';

export default function WebhookEndpoints() {
  return (
    <Box>
      <Typography variant="h4" mb={3} fontWeight={700}>
        Active Webhook Endpoints
      </Typography>
      {/* TODO: List, create, delete endpoints */}
    </Box>
  );
}
