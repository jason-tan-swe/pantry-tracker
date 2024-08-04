'use client';

import { useEffect, useState } from 'react';
import { Typography, Button, Box, CircularProgress } from "@mui/material";
import { useRouter } from 'next/navigation';
import { getAllItems } from '@/utils/firebase/pantry';

export default function DashboardPage() {
  const [isFirstTimeUser, setIsFirstTimeUser] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkUserStatus = async () => {
      setIsLoading(true);
      try {
        const items = await getAllItems();
        if (items.length > 0) {
          setIsFirstTimeUser(false)
          router.push('/dashboard/pantry');
        } else {
          setIsFirstTimeUser(true);
        }
      } catch (error) {
        console.error('Error checking user status:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkUserStatus();
  }, [router]);

  const handleGetStarted = () => {
    router.push('/dashboard/pantry');
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!isFirstTimeUser) {
    return null;
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 'calc(100vh - 112px)', textAlign: 'center' }}>
      <Typography variant="h4" gutterBottom>
        Welcome to Your Pantry Tracker!
      </Typography>
      <Typography variant="body1" paragraph>
        Get started with managing your pantry items efficiently.
      </Typography>
      <Button variant="contained" color="primary" onClick={handleGetStarted}>
        Get Started
      </Button>
    </Box>
  );
}