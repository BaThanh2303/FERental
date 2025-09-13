import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  Tabs,
  Tab,
  IconButton,
  Alert,
  CircularProgress
} from '@mui/material';
import { Close, Visibility, VisibilityOff, CheckCircle } from '@mui/icons-material';
import { loginUser, registerUser } from '../api.jsx';

export const AuthModal = ({ open, onClose, onAuthSuccess }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Login form state
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  });

  // Register form state
  const [registerForm, setRegisterForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    role: 'USER'
  });

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setError('');
    setSuccess('');
    setLoginForm({ email: '', password: '' });
    setRegisterForm({ email: '', password: '', confirmPassword: '', name: '', role: 'USER' });
  };

  const handleLoginChange = (field) => (event) => {
    setLoginForm(prev => ({ ...prev, [field]: event.target.value }));
    setError('');
    setSuccess('');
  };

  const handleRegisterChange = (field) => (event) => {
    setRegisterForm(prev => ({ ...prev, [field]: event.target.value }));
    setError('');
    setSuccess('');
  };

  const validateLoginForm = () => {
    if (!loginForm.email || !loginForm.password) {
      setError('Vui lòng điền đầy đủ thông tin');
      return false;
    }
    if (!loginForm.email.includes('@')) {
      setError('Email không hợp lệ');
      return false;
    }
    return true;
  };

  const validateRegisterForm = () => {
    if (!registerForm.email || !registerForm.password || !registerForm.confirmPassword || !registerForm.name) {
      setError('Vui lòng điền đầy đủ thông tin');
      return false;
    }
    if (!registerForm.email.includes('@')) {
      setError('Email không hợp lệ');
      return false;
    }
    if (registerForm.password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự');
      return false;
    }
    if (registerForm.password !== registerForm.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return false;
    }
    return true;
  };

  const handleLogin = async () => {
    if (!validateLoginForm()) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const result = await loginUser({
        email: loginForm.email,
        password: loginForm.password
      });

      console.log('Login successful:', result);
      
      // Show success message
      setSuccess('Bạn đã đăng nhập thành công! 🎉');
      
      // Wait a bit to show success message, then close modal and call callback
      setTimeout(() => {
        onAuthSuccess(result);
        onClose();
      }, 1500);
      
    } catch (error) {
      setError(error.message || 'Đăng nhập thất bại');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!validateRegisterForm()) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // In a real app, you should hash the password on frontend
      const result = await registerUser({
        email: registerForm.email,
        passwordHash: registerForm.password, // This should be hashed
        name: registerForm.name,
        role: registerForm.role
      });

      console.log('Registration successful:', result);
      setSuccess('Đăng ký thành công! Vui lòng đăng nhập.');
      
      // Switch to login tab after successful registration
      setTimeout(() => {
        setActiveTab(0);
        setLoginForm({ email: registerForm.email, password: '' });
        setSuccess('');
      }, 2000);
      
    } catch (error) {
      setError(error.message || 'Đăng ký thất bại');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setError('');
    setSuccess('');
    setLoginForm({ email: '', password: '' });
    setRegisterForm({ email: '', password: '', confirmPassword: '', name: '', role: 'USER' });
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: '#111111',
          color: 'white',
          borderRadius: 2,
          border: '2px solid #ff0000'
        }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        borderBottom: '1px solid #333',
        pb: 2
      }}>
        <Typography variant="h5" sx={{ color: '#ff0000', fontFamily: 'Consolas, monospace' }}>
          {activeTab === 0 ? 'ĐĂNG NHẬP' : 'ĐĂNG KÝ'}
        </Typography>
        <IconButton onClick={handleClose} sx={{ color: '#ccc' }}>
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: '#333', mb: 3 }}>
          <Tabs 
            value={activeTab} 
            onChange={handleTabChange}
            sx={{
              '& .MuiTab-root': {
                color: '#ccc',
                fontFamily: 'Consolas, monospace',
                '&.Mui-selected': { color: '#ff0000' }
              },
              '& .MuiTabs-indicator': { bgcolor: '#ff0000' }
            }}
          >
            <Tab label="ĐĂNG NHẬP" />
            <Tab label="ĐĂNG KÝ" />
          </Tabs>
        </Box>

        {/* Success Alert */}
        {success && (
          <Alert 
            severity="success" 
            icon={<CheckCircle />}
            sx={{ 
              mb: 3, 
              bgcolor: 'rgba(76,175,80,0.1)', 
              color: '#4caf50',
              border: '1px solid #4caf50',
              '& .MuiAlert-icon': { color: '#4caf50' }
            }}
          >
            {success}
          </Alert>
        )}

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 3, bgcolor: 'rgba(244,67,54,0.1)', color: '#f44336' }}>
            {error}
          </Alert>
        )}

        {/* Login Form */}
        {activeTab === 0 && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Email"
              type="email"
              value={loginForm.email}
              onChange={handleLoginChange('email')}
              placeholder="user2@example.com"
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: 'white',
                  '& fieldset': { borderColor: '#333' },
                  '&:hover fieldset': { borderColor: '#ff0000' },
                  '&.Mui-focused fieldset': { borderColor: '#ff0000' }
                },
                '& .MuiInputLabel-root': { color: '#ccc' },
                '& .MuiInputLabel-root.Mui-focused': { color: '#ff0000' }
              }}
            />
            
            <TextField
              label="Mật khẩu"
              type={showPassword ? 'text' : 'password'}
              value={loginForm.password}
              onChange={handleLoginChange('password')}
              placeholder="123456"
              fullWidth
              InputProps={{
                endAdornment: (
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    sx={{ color: '#ccc' }}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                )
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: 'white',
                  '& fieldset': { borderColor: '#333' },
                  '&:hover fieldset': { borderColor: '#ff0000' },
                  '&.Mui-focused fieldset': { borderColor: '#ff0000' }
                },
                '& .MuiInputLabel-root': { color: '#ccc' },
                '& .MuiInputLabel-root.Mui-focused': { color: '#ff0000' }
              }}
            />
          </Box>
        )}

        {/* Register Form */}
        {activeTab === 1 && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Họ và tên"
              value={registerForm.name}
              onChange={handleRegisterChange('name')}
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: 'white',
                  '& fieldset': { borderColor: '#333' },
                  '&:hover fieldset': { borderColor: '#ff0000' },
                  '&.Mui-focused fieldset': { borderColor: '#ff0000' }
                },
                '& .MuiInputLabel-root': { color: '#ccc' },
                '& .MuiInputLabel-root.Mui-focused': { color: '#ff0000' }
              }}
            />

            <TextField
              label="Email"
              type="email"
              value={registerForm.email}
              onChange={handleRegisterChange('email')}
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: 'white',
                  '& fieldset': { borderColor: '#333' },
                  '&:hover fieldset': { borderColor: '#ff0000' },
                  '&.Mui-focused fieldset': { borderColor: '#ff0000' }
                },
                '& .MuiInputLabel-root': { color: '#ccc' },
                '& .MuiInputLabel-root.Mui-focused': { color: '#ff0000' }
              }}
            />

            <TextField
              label="Mật khẩu"
              type={showPassword ? 'text' : 'password'}
              value={registerForm.password}
              onChange={handleRegisterChange('password')}
              fullWidth
              InputProps={{
                endAdornment: (
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    sx={{ color: '#ccc' }}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                )
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: 'white',
                  '& fieldset': { borderColor: '#333' },
                  '&:hover fieldset': { borderColor: '#ff0000' },
                  '&.Mui-focused fieldset': { borderColor: '#ff0000' }
                },
                '& .MuiInputLabel-root': { color: '#ccc' },
                '& .MuiInputLabel-root.Mui-focused': { color: '#ff0000' }
              }}
            />

            <TextField
              label="Xác nhận mật khẩu"
              type={showConfirmPassword ? 'text' : 'password'}
              value={registerForm.confirmPassword}
              onChange={handleRegisterChange('confirmPassword')}
              fullWidth
              InputProps={{
                endAdornment: (
                  <IconButton
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    sx={{ color: '#ccc' }}
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                )
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: 'white',
                  '& fieldset': { borderColor: '#333' },
                  '&:hover fieldset': { borderColor: '#ff0000' },
                  '&.Mui-focused fieldset': { borderColor: '#ff0000' }
                },
                '& .MuiInputLabel-root': { color: '#ccc' },
                '& .MuiInputLabel-root.Mui-focused': { color: '#ff0000' }
              }}
            />
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 1 }}>
        <Button 
          onClick={handleClose} 
          variant="outlined" 
          sx={{ 
            borderColor: '#333', 
            color: '#ccc', 
            fontFamily: 'Consolas, monospace',
            '&:hover': { borderColor: '#ff0000', color: '#ff0000' }
          }}
        >
          HỦY
        </Button>
        
        <Button
          onClick={activeTab === 0 ? handleLogin : handleRegister}
          variant="contained"
          disabled={loading}
          sx={{
            bgcolor: '#ff0000',
            color: 'white',
            fontFamily: 'Consolas, monospace',
            '&:hover': { bgcolor: '#cc0000' },
            '&:disabled': { bgcolor: '#666' }
          }}
        >
          {loading ? (
            <CircularProgress size={20} sx={{ color: 'white' }} />
          ) : (
            activeTab === 0 ? 'ĐĂNG NHẬP' : 'ĐĂNG KÝ'
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
