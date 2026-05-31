import { Box, Typography, Grid, Card, CardContent } from '@mui/material';

export default function WebhookDashboard() {
  // Placeholder summary cards
  return (
    <Box>
      <Typography variant="h4" mb={3} fontWeight={700}>
        Webhook Inspector Dashboard
      </Typography>
      <Grid container spacing={2}>
        {[
          { label: 'Active Endpoints', value: 0 },
          { label: 'Total Requests', value: 0 },
          { label: 'Requests Today', value: 0 },
          { label: 'Failed Validations', value: 0 },
          { label: 'Avg Payload Size', value: '0 B' },
        ].map((card) => (
          <Grid item xs={12} sm={6} md={2.4} key={card.label}>
            <Card>
              <CardContent>
                <Typography color="text.secondary" variant="body2">
                  {card.label}
                </Typography>
                <Typography variant="h5" fontWeight={700}>
                  {card.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      {/* TODO: Add charts for requests by day, validation rate, methods */}
    </Box>
  );
}
