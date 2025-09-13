import React, { useState } from 'react';
import { Box, Button, Typography, Alert, CircularProgress } from '@mui/material';
import { CheckCircle } from '@mui/icons-material';
import { loginUser, registerUser, getAllStations, getVehiclesInStation } from '../api.jsx';

export const TestAPI = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const clearMessages = () => {
    setError('');
    setSuccess('');
    setResult(null);
  };

  const testLogin = async () => {
    clearMessages();
    setLoading(true);

    try {
      const loginResult = await loginUser({
        email: 'user2@example.com',
        password: '123456'
      });
      
      setSuccess('Đăng nhập thành công! 🎉');
      setResult({
        type: 'Login Success',
        data: loginResult
      });
      console.log('Login test successful:', loginResult);
    } catch (error) {
      setError(`Đăng nhập thất bại: ${error.message}`);
      console.error('Login test failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const testRegister = async () => {
    clearMessages();
    setLoading(true);

    try {
      const registerResult = await registerUser({
        email: 'newuser@example.com',
        passwordHash: 'password123',
        name: 'Test User',
        role: 'USER'
      });
      
      setSuccess('Đăng ký thành công! 🎉');
      setResult({
        type: 'Register Success',
        data: registerResult
      });
      console.log('Register test successful:', registerResult);
    } catch (error) {
      setError(`Đăng ký thất bại: ${error.message}`);
      console.error('Register test failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const testGetStations = async () => {
    clearMessages();
    setLoading(true);

    try {
      const stations = await getAllStations();
      
      setSuccess('Lấy danh sách trạm thành công! 🎉');
      setResult({
        type: 'Stations Loaded',
        data: stations
      });
      console.log('Stations test successful:', stations);
    } catch (error) {
      setError(`Lấy danh sách trạm thất bại: ${error.message}`);
      console.error('Stations test failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const testGetVehicles = async () => {
    clearMessages();
    setLoading(true);

    try {
      const vehicles = await getVehiclesInStation(1);
      
      setSuccess('Lấy danh sách xe thành công! 🎉');
      setResult({
        type: 'Vehicles Loaded',
        data: vehicles
      });
      console.log('Vehicles test successful:', vehicles);
    } catch (error) {
      setError(`Lấy danh sách xe thất bại: ${error.message}`);
      console.error('Vehicles test failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ 
      p: 3, 
      bgcolor: '#111111', 
      borderRadius: 2, 
      border: '1px solid #333',
      maxWidth: 600,
      mx: 'auto',
      mt: 2
    }}>
      <Typography variant="h5" sx={{ color: '#ff0000', mb: 3, fontFamily: 'Consolas, monospace' }}>
        API Test Panel
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <Button
          variant="contained"
          onClick={testLogin}
          disabled={loading}
          sx={{ bgcolor: '#0066cc', '&:hover': { bgcolor: '#0052a3' } }}
        >
          Test Login
        </Button>
        
        <Button
          variant="contained"
          onClick={testRegister}
          disabled={loading}
          sx={{ bgcolor: '#ff6600', '&:hover': { bgcolor: '#e55a00' } }}
        >
          Test Register
        </Button>
        
        <Button
          variant="contained"
          onClick={testGetStations}
          disabled={loading}
          sx={{ bgcolor: '#00cc66', '&:hover': { bgcolor: '#00b359' } }}
        >
          Test Get Stations
        </Button>
        
        <Button
          variant="contained"
          onClick={testGetVehicles}
          disabled={loading}
          sx={{ bgcolor: '#cc00cc', '&:hover': { bgcolor: '#b300b3' } }}
        >
          Test Get Vehicles
        </Button>
      </Box>

      {loading && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <CircularProgress size={20} sx={{ color: '#ff0000' }} />
          <Typography sx={{ color: '#ccc' }}>Testing API...</Typography>
        </Box>
      )}

      {success && (
        <Alert 
          severity="success" 
          icon={<CheckCircle />}
          sx={{ mb: 2, bgcolor: 'rgba(76,175,80,0.1)', color: '#4caf50' }}
        >
          {success}
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2, bgcolor: 'rgba(244,67,54,0.1)', color: '#f44336' }}>
          {error}
        </Alert>
      )}

      {result && (
        <Box sx={{ 
          bgcolor: '#222', 
          p: 2, 
          borderRadius: 1, 
          border: '1px solid #444'
        }}>
          <Typography variant="h6" sx={{ color: '#00cc66', mb: 1, fontFamily: 'Consolas, monospace' }}>
            {result.type}
          </Typography>
          <Typography variant="body2" sx={{ color: '#ccc', fontFamily: 'Consolas, monospace' }}>
            <pre style={{ whiteSpace: 'pre-wrap', fontSize: '12px' }}>
              {JSON.stringify(result.data, null, 2)}
            </pre>
          </Typography>
        </Box>
      )}

      <Typography variant="body2" sx={{ color: '#999', mt: 2, fontSize: '12px' }}>
        Check browser console for detailed logs
      </Typography>
    </Box>
  );
};
