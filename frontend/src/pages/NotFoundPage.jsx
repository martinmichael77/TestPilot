import { Button, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <Stack spacing={2} alignItems="flex-start">
      <Typography variant="h3" fontWeight={700}>
        404
      </Typography>
      <Typography variant="body1">The page you are looking for does not exist.</Typography>
      <Button variant="contained" onClick={() => navigate('/')}>
        Go to Dashboard
      </Button>
    </Stack>
  );
}
