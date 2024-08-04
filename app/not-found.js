import { Box, Typography, Button } from '@mui/material';
import Link from 'next/link';

export default function NotFound() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
      <Typography variant="h4" gutterBottom>
        404 - Page Not Found
      </Typography>
      <Typography variant="body1" gutterBottom>
        The page you&apos;re looking for doesn&apos;t exist.
      </Typography>
      <Button variant="contained" component={Link} href="/dashboard">
        Go to Dashboard
      </Button>
    </Box>
  );
}