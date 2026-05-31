import { Box, Typography } from '@mui/material';

export default function WebhookSettings() {
  return (
    <Box>
      <Typography variant="h4" mb={3} fontWeight={700}>
        Webhook Inspector Settings
      </Typography>
      {/* TODO: Secret token, IP whitelist, notifications */}
    </Box>
  );
}
