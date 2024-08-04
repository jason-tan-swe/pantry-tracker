'use client';

import { Box, Typography, Button } from "@mui/material";
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  const handleTryNow = () => {
    router.push('/dashboard');
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', textAlign: 'center' }}>
      <Typography variant="h2" gutterBottom>
        Welcome to Pantry Tracker
      </Typography>
      <Typography variant="h5" gutterBottom>
        Manage your pantry items with ease
      </Typography>
      <Button variant="contained" size="large" onClick={handleTryNow} sx={{ mt: 4 }}>
        Try Now
      </Button>
    </Box>
  );
}