import { Link as RouterLink, Outlet, useLocation } from 'react-router-dom';
import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Switch,
  Divider,
} from '@mui/material';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import HistoryOutlinedIcon from '@mui/icons-material/HistoryOutlined';
// import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
// import LoginOutlinedIcon from '@mui/icons-material/LoginOutlined';
import RocketLaunchOutlinedIcon from '@mui/icons-material/RocketLaunchOutlined';
import MenuIcon from '@mui/icons-material/Menu';
import { useState } from 'react';
import { useThemeMode } from '../context/ThemeModeContext';

const drawerWidth = 250;

const navItems = [
  { label: 'Dashboard', path: '/', icon: <DashboardOutlinedIcon /> },
  { label: 'Upload Collection', path: '/upload', icon: <CloudUploadOutlinedIcon /> },
  { label: 'Run Results', path: '/results', icon: <RocketLaunchOutlinedIcon /> },
  { label: 'History', path: '/history', icon: <HistoryOutlinedIcon /> },
  // { label: 'Settings', path: '/settings', icon: <SettingsOutlinedIcon /> },
  // { label: 'Login', path: '/login', icon: <LoginOutlinedIcon /> },
];

function NavigationList({ onSelect }) {
  const location = useLocation();

  return (
    <List>
      {navItems.map((item) => (
        <ListItemButton
          key={item.path}
          component={RouterLink}
          to={item.path}
          selected={location.pathname === item.path}
          onClick={onSelect}
        >
          <ListItemIcon>{item.icon}</ListItemIcon>
          <ListItemText primary={item.label} />
        </ListItemButton>
      ))}
    </List>
  );
}

export default function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { mode, toggleMode } = useThemeMode();

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <AppBar
        position="fixed"
        sx={{
          ml: { md: `${drawerWidth}px` },
          width: { md: `calc(100% - ${drawerWidth}px)` },
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar>
          <IconButton color="inherit" edge="start" onClick={() => setMobileOpen(true)} sx={{ mr: 2, display: { md: 'none' } }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 600 }}>
            TestPilot
          </Typography>
          <Typography variant="body2" sx={{ mr: 1 }}>
            {mode === 'light' ? 'Light' : 'Dark'}
          </Typography>
          <Switch checked={mode === 'dark'} onChange={toggleMode} />
        </Toolbar>
      </AppBar>

      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
      >
        <Toolbar>
          <Typography variant="h6" fontWeight={700}>
            TestPilot
          </Typography>
        </Toolbar>
        <Divider />
        <NavigationList onSelect={() => setMobileOpen(false)} />
      </Drawer>

      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
        open
      >
        <Toolbar>
          <Typography variant="h6" fontWeight={700}>
            TestPilot
          </Typography>
        </Toolbar>
        <Divider />
        <NavigationList onSelect={() => {}} />
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}
