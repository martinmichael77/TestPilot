import { Box, Typography } from '@mui/material';

export default function WebhookHistory() {
  return (
    <Box>
      <Typography variant="h4" mb={3} fontWeight={700}>
        Webhook History
      </Typography>
      {/* TODO: Search, filter, export history */}
    </Box>
  );
}
