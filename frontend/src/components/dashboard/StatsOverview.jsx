import { Card, CardContent, Grid, Typography } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function StatsOverview({ history }) {
  const totalRuns = history.length;
  const passedApis = history.reduce((sum, row) => sum + (row.passedRequests || 0), 0);
  const failedApis = history.reduce((sum, row) => sum + (row.failedRequests || 0), 0);
  const avgResponse =
    totalRuns === 0
      ? 0
      : Math.round(history.reduce((sum, row) => sum + (row.averageResponseTime || 0), 0) / totalRuns);

  const chartData = history.slice(0, 8).map((row, index) => ({
    name: `Run ${history.length - index}`,
    pass: row.passedRequests || 0,
    fail: row.failedRequests || 0,
  }));

  const cards = [
    { label: 'Total Test Runs', value: totalRuns },
    { label: 'Passed APIs', value: passedApis },
    { label: 'Failed APIs', value: failedApis },
    { label: 'Average Response (ms)', value: avgResponse },
  ];

  return (
    <Grid container spacing={2}>
      {cards.map((card) => (
        <Grid item xs={12} sm={6} md={3} key={card.label}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                {card.label}
              </Typography>
              <Typography variant="h5" fontWeight={700}>
                {card.value}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6" mb={2}>
              Recent Pass/Fail Trend
            </Typography>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={chartData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="pass" fill="#16a34a" name="Pass" />
                <Bar dataKey="fail" fill="#dc2626" name="Fail" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}
