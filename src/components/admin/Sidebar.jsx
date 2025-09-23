import React from 'react';
import { NavLink } from 'react-router-dom';
import { Box, Button } from '@mui/material';

const items = [
  { to: '/admin', label: 'Dashboard' },
  { to: '/admin/stations', label: 'Stations' },
  { to: '/admin/users', label: 'Users' },
  { to: '/admin/vehicles', label: 'Vehicles' },
  { to: '/admin/packages', label: 'Packages' },
  { to: '/admin/rentals', label: 'Rentals' },
  { to: '/admin/payments', label: 'Payments' }
];

export default function Sidebar() {
  return (
    <Box sx={{
      width: 240,
      flexShrink: 0,
      bgcolor: '#0f0f0f',
      borderRight: '1px solid #222',
      height: '100vh',
      position: 'sticky',
      top: 0,
      p: 2
    }}>
      {items.map((it) => (
        <Button
          key={it.to}
          component={NavLink}
          to={it.to}
          sx={{
            justifyContent: 'flex-start',
            color: 'white',
            mb: 1,
            width: '100%',
            '&.active': { bgcolor: '#1a1a1a' }
          }}
        >
          {it.label}
        </Button>
      ))}
    </Box>
  );
}


