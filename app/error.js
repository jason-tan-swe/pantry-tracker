'use client';

import { Box, Typography, Button } from '@mui/material';
import Link from 'next/link';
import { useEffect } from 'react';

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
      <Typography variant="h4" gutterBottom>
        Oops! Something went wrong.
      </Typography>
      <Button variant="contained" component={Link} href="/dashboard">
        Try again
      </Button>
    </Box>
  );
}
