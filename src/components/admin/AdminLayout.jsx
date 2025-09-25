import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Box, Button } from '@mui/material';
import Sidebar from './Sidebar.jsx';
import { useUserInfo } from '../../context/UserContext.jsx';

export default function AdminLayout() {
  const { user } = useUserInfo();
  const navigate = useNavigate();
  
  const onBackHome = () => {
    navigate('/');
  };

  return (
    <Box sx={{ display: 'flex', bgcolor: '#000', color: 'white', minHeight: '100vh' }}>
      <Sidebar />
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <AppBar position="sticky" sx={{ bgcolor: '#111', borderBottom: '1px solid #222' }}>
          <Toolbar>
            <Typography variant="h6" sx={{ flex: 1 }}>Admin Dashboard</Typography>
            <Typography variant="body2" sx={{ mr: 2 }}>{user?.name} ({user?.role})</Typography>
            <Button color="inherit" onClick={onBackHome}>Back Home</Button>
          </Toolbar>
        </AppBar>
        <Box sx={{ p: 2 }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}


