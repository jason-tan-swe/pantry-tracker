import { Box, Typography } from "@mui/material";

export default function Recipes() {
  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      height: 'calc(100vh - 112px)', 
      textAlign: 'center' 
    }}>
      <Typography variant="h2" gutterBottom>
        Recipes
      </Typography>
      <Typography variant="h4" color="text.secondary">
        Coming Soon!
      </Typography>
      <Typography variant="body1" sx={{ mt: 2 }}>
        We&apos;re cooking up something special. Check back later for delicious recipes!
      </Typography>
    </Box>
  );
}