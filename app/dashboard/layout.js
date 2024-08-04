'use client';

import { useState } from 'react';
import { Box, Drawer, List, ListItem, ListItemIcon, ListItemText, AppBar, Toolbar, Typography, IconButton, useMediaQuery, BottomNavigation, BottomNavigationAction } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import KitchenIcon from '@mui/icons-material/Kitchen';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import SettingsIcon from '@mui/icons-material/Settings';
import { useRouter, usePathname } from 'next/navigation';

const mainMenuItems = [
  { text: 'Pantry', icon: <KitchenIcon />, path: '/dashboard/pantry' },
  { text: 'Recipes', icon: <RestaurantIcon />, path: '/dashboard/recipes' },
];

const settingsMenuItem = { text: 'Settings', icon: <SettingsIcon />, path: '/dashboard/settings' };

export default function DashboardLayout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const router = useRouter();
  const pathname = usePathname();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleNavigation = (path) => {
    router.push(path);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const drawer = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Toolbar />
      <List>
        {mainMenuItems.map((item) => (
          <ListItem button key={item.text} onClick={() => handleNavigation(item.path)}>
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
      <Box sx={{ flexGrow: 1 }} />
      <List>
        <ListItem button onClick={() => handleNavigation(settingsMenuItem.path)}>
          <ListItemIcon>{settingsMenuItem.icon}</ListItemIcon>
          <ListItemText primary={settingsMenuItem.text} />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row' }}>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          {!isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h6" noWrap component="div">
            Pantry Tracker
          </Typography>
        </Toolbar>
      </AppBar>
      {!isMobile && (
        <Drawer
          variant="permanent"
          sx={{
            width: 240,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: { width: 240, boxSizing: 'border-box' },
          }}
        >
          {drawer}
        </Drawer>
      )}
      <Box component="main" sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - 240px)` } }}>
        <Toolbar />
        {children}
      </Box>
      {isMobile && (
        <BottomNavigation
          value={pathname}
          onChange={(event, newValue) => {
            handleNavigation(newValue);
          }}
          showLabels
          sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }}
        >
          {[...mainMenuItems, settingsMenuItem].map((item) => (
            <BottomNavigationAction key={item.text} label={item.text} icon={item.icon} value={item.path} />
          ))}
        </BottomNavigation>
      )}
    </Box>
  );
}