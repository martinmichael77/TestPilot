import { Alert, Card, CardContent, Stack, Typography } from '@mui/material';
import PageHeader from '../components/common/PageHeader';

export default function SettingsPage() {
  return (
    <Stack spacing={2}>
      <PageHeader title="Settings" subtitle="Simple configuration options for TestPilot users and teams." />
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Backend API Endpoint
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'}
          </Typography>
        </CardContent>
      </Card>
      <Alert severity="info">
        Future-ready placeholders: scheduled runs, Slack notifications, Jira integration, and CI/CD webhooks.
      </Alert>
    </Stack>
  );
}
