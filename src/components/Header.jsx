import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  useTheme,
  useMediaQuery,
  Avatar,
  Menu,
  MenuItem
} from '@mui/material';
import { Menu as MenuIcon, Facebook, Twitter, Instagram, LinkedIn } from '@mui/icons-material';
import { AuthModal } from './AuthModal';
import { isAuthenticated, logoutUser, getCurrentUser, getUserId } from '../api.jsx';
import logo from '../assets/images/logo.svg';

export const Header = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);

  // Check authentication status on component mount
  React.useEffect(() => {
    if (isAuthenticated()) {
      loadCurrentUser();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  const loadCurrentUser = async () => {
    try {
      const userId = getUserId();
      if (!userId) {
        console.error('No user ID found');
        handleLogout();
        return;
      }
      
      const userData = await getCurrentUser(userId);
      setUser(userData);
    } catch (error) {
      console.error('Failed to load user data:', error);
      // Token might be invalid, logout user
      handleLogout();
    }
  };

  const handleAuthSuccess = (userData) => {
    setUser(userData);
    setAuthModalOpen(false);
  };

  const handleLogout = () => {
    logoutUser();
    setUser(null);
    setAnchorEl(null);
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <>
      <AppBar 
        position="fixed" 
        sx={{ 
          bgcolor: '#000000',
          borderBottom: '2px solid #ff0000',
          zIndex: theme.zIndex.drawer + 1
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          {/* Logo */}
          <Box 
            component="img"
            src={logo}
            alt="AutoBike Logo"
            sx={{ 
              height: 40,
              width: 'auto',
              cursor: 'pointer',
              '&:hover': {
                opacity: 0.8
              }
            }}
          />

          {/* Desktop Navigation */}
          {!isMobile && (
            <Box sx={{ display: 'flex', gap: 3 }}>
              <Button 
                color="inherit" 
                sx={{ 
                  fontFamily: 'Consolas, monospace',
                  '&:hover': { color: '#ff0000' }
                }}
              >
                HOME PAGE
              </Button>
              <Button 
                color="inherit" 
                sx={{ 
                  fontFamily: 'Consolas, monospace',
                  '&:hover': { color: '#ff0000' }
                }}
              >
                ABOUT US
              </Button>
              <Button 
                color="inherit" 
                sx={{ 
                  fontFamily: 'Consolas, monospace',
                  '&:hover': { color: '#ff0000' }
                }}
              >
                EVENTS
              </Button>
              <Button 
                color="inherit" 
                sx={{ 
                  fontFamily: 'Consolas, monospace',
                  '&:hover': { color: '#ff0000' }
                }}
              >
                CONTACT
              </Button>
            </Box>
          )}

          {/* Right Section */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {/* Social Media Icons */}
            {!isMobile && (
              <Box sx={{ display: 'flex', gap: 1 }}>
                <IconButton size="small" sx={{ color: '#ccc', '&:hover': { color: '#ff0000' } }}>
                  <Facebook />
                </IconButton>
                <IconButton size="small" sx={{ color: '#ccc', '&:hover': { color: '#ff0000' } }}>
                  <Twitter />
                </IconButton>
                <IconButton size="small" sx={{ color: '#ccc', '&:hover': { color: '#ff0000' } }}>
                  <Instagram />
                </IconButton>
                <IconButton size="small" sx={{ color: '#ccc', '&:hover': { color: '#ff0000' } }}>
                  <LinkedIn />
                </IconButton>
              </Box>
            )}

            {/* Auth Buttons / User Menu */}
            {user ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: '#ccc',
                    fontFamily: 'Consolas, monospace',
                    display: { xs: 'none', sm: 'block' }
                  }}
                >
                  {user.name}
                </Typography>
                <Avatar
                  onClick={handleProfileMenuOpen}
                  sx={{ 
                    bgcolor: '#ff0000', 
                    cursor: 'pointer',
                    width: 32,
                    height: 32,
                    fontSize: '0.875rem'
                  }}
                >
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </Avatar>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleProfileMenuClose}
                  PaperProps={{
                    sx: {
                      bgcolor: '#111111',
                      border: '1px solid #333',
                      mt: 1
                    }
                  }}
                >
                  <MenuItem 
                    onClick={handleProfileMenuClose}
                    sx={{ 
                      color: '#ccc',
                      fontFamily: 'Consolas, monospace',
                      '&:hover': { bgcolor: '#333' }
                    }}
                  >
                    Profile
                  </MenuItem>
                  <MenuItem 
                    onClick={handleLogout}
                    sx={{ 
                      color: '#ff0000',
                      fontFamily: 'Consolas, monospace',
                      '&:hover': { bgcolor: '#333' }
                    }}
                  >
                    Logout
                  </MenuItem>
                </Menu>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="outlined"
                  onClick={() => setAuthModalOpen(true)}
                  sx={{
                    borderColor: '#ff0000',
                    color: '#ff0000',
                    fontFamily: 'Consolas, monospace',
                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                    px: { xs: 1, sm: 2 },
                    py: { xs: 0.5, sm: 1 },
                    '&:hover': { 
                      borderColor: '#cc0000', 
                      bgcolor: 'rgba(255,0,0,0.1)' 
                    }
                  }}
                >
                  LOGIN
                </Button>
                <Button
                  variant="contained"
                  onClick={() => setAuthModalOpen(true)}
                  sx={{
                    bgcolor: '#ff0000',
                    color: 'white',
                    fontFamily: 'Consolas, monospace',
                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                    px: { xs: 1, sm: 2 },
                    py: { xs: 0.5, sm: 1 },
                    '&:hover': { bgcolor: '#cc0000' },
                    display: { xs: 'none', sm: 'block' }
                  }}
                >
                  REGISTER
                </Button>
              </Box>
            )}

            {/* Mobile Menu Button */}
            {isMobile && (
              <IconButton
                color="inherit"
                onClick={handleMobileMenuToggle}
                sx={{ ml: 1 }}
              >
                <MenuIcon />
              </IconButton>
            )}
          </Box>
        </Toolbar>

        {/* Mobile Menu */}
        {isMobile && mobileMenuOpen && (
          <Box sx={{ 
            bgcolor: '#111111', 
            borderTop: '1px solid #333',
            py: 2
          }}>
            {/* Mobile Logo */}
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              mb: 2,
              pb: 2,
              borderBottom: '1px solid #333'
            }}>
              <Box 
                component="img"
                src={logo}
                alt="AutoBike Logo"
                sx={{ 
                  height: 35,
                  width: 'auto'
                }}
              />
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, px: 2 }}>
              <Button 
                color="inherit" 
                fullWidth
                sx={{ 
                  fontFamily: 'Consolas, monospace',
                  justifyContent: 'flex-start',
                  '&:hover': { color: '#ff0000', bgcolor: 'rgba(255,0,0,0.1)' }
                }}
              >
                HOME PAGE
              </Button>
              <Button 
                color="inherit" 
                fullWidth
                sx={{ 
                  fontFamily: 'Consolas, monospace',
                  justifyContent: 'flex-start',
                  '&:hover': { color: '#ff0000', bgcolor: 'rgba(255,0,0,0.1)' }
                }}
              >
                ABOUT US
              </Button>
              <Button 
                color="inherit" 
                fullWidth
                sx={{ 
                  fontFamily: 'Consolas, monospace',
                  justifyContent: 'flex-start',
                  '&:hover': { color: '#ff0000', bgcolor: 'rgba(255,0,0,0.1)' }
                }}
              >
                EVENTS
              </Button>
              <Button 
                color="inherit" 
                fullWidth
                sx={{ 
                  fontFamily: 'Consolas, monospace',
                  justifyContent: 'flex-start',
                  '&:hover': { color: '#ff0000', bgcolor: 'rgba(255,0,0,0.1)' }
                }}
              >
                CONTACT
              </Button>
            </Box>
          </Box>
        )}
      </AppBar>

      {/* Auth Modal */}
      <AuthModal
        open={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />

      {/* Spacer for fixed header */}
      <Toolbar />
    </>
  );
};
