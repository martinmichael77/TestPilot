import { Button, Card, CardContent, Stack, TextField, Typography } from '@mui/material';
import PageHeader from '../components/common/PageHeader';

export default function LoginPage() {
  return (
    <Stack spacing={2} maxWidth={520}>
      <PageHeader title="Login" subtitle="Optional access control for Admin and Tester roles." />
      <Card>
        <CardContent>
          <Stack spacing={2}>
            <TextField label="Email" type="email" fullWidth />
            <TextField label="Password" type="password" fullWidth />
            <Button variant="contained">Sign In</Button>
            <Typography variant="caption" color="text.secondary">
              Demo page placeholder. JWT auth endpoints can be added later.
            </Typography>
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
}
