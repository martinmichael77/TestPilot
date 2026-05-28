import { Grid, Card, CardContent, Typography } from '@mui/material';

const cardConfig = [
  { key: 'totalRequests', label: 'Total Requests' },
  { key: 'passedRequests', label: 'Passed' },
  { key: 'failedRequests', label: 'Failed' },
  { key: 'averageResponseTime', label: 'Avg Response Time (ms)' },
  { key: 'duration', label: 'Duration (ms)' },
];

export default function ResultsSummaryCards({ summary }) {
  return (
    <Grid container spacing={2}>
      {cardConfig.map((card) => (
        <Grid item xs={12} sm={6} md={2.4} key={card.key}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" variant="body2">
                {card.label}
              </Typography>
              <Typography variant="h5" fontWeight={700}>
                {summary[card.key] ?? 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
