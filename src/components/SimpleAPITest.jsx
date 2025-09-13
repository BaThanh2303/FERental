import React, { useState } from 'react';
import { Box, Button, Typography, Alert, Paper } from '@mui/material';

export const SimpleAPITest = () => {
  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  const testLogin = async () => {
    setResult('');
    setError('');

    try {
      console.log('Testing login API...');
      
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        mode: 'cors',
        credentials: 'omit',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          email: 'user2@example.com',
          password: '123456'
        })
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
      
      // Get response as text first to see what we're getting
      const responseText = await response.text();
      console.log('Response text:', responseText);
      
      if (response.ok) {
        try {
          const data = JSON.parse(responseText);
          setResult(`Login Success! Token: ${data.token ? data.token.substring(0, 50) + '...' : 'No token'}`);
          console.log('Parsed data:', data);
        } catch (parseError) {
          setResult(`Login Success but invalid JSON: ${responseText}`);
          console.error('JSON parse error:', parseError);
        }
      } else {
        setError(`Login Failed: ${response.status} - ${responseText}`);
      }
    } catch (error) {
      setError(`Request Error: ${error.message}`);
      console.error('Request error:', error);
    }
  };

  const testStations = async () => {
    setResult('');
    setError('');

    try {
      console.log('Testing stations API...');
      
      const response = await fetch('http://localhost:8080/api/stations', {
        method: 'GET',
        mode: 'cors',
        credentials: 'omit',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
      
      const responseText = await response.text();
      console.log('Response text:', responseText);
      
      if (response.ok) {
        try {
          const data = JSON.parse(responseText);
          setResult(`Stations Success! Count: ${Array.isArray(data) ? data.length : 'Not an array'}`);
          console.log('Parsed stations data:', data);
        } catch (parseError) {
          setResult(`Stations Success but invalid JSON: ${responseText}`);
          console.error('JSON parse error:', parseError);
        }
      } else {
        setError(`Stations Failed: ${response.status} - ${responseText}`);
      }
    } catch (error) {
      setError(`Request Error: ${error.message}`);
      console.error('Request error:', error);
    }
  };

  return (
    <Paper sx={{ 
      p: 3, 
      bgcolor: '#111111', 
      borderRadius: 2, 
      border: '1px solid #333',
      maxWidth: 600,
      mx: 'auto',
      mt: 2
    }}>
      <Typography variant="h6" sx={{ color: '#ff0000', mb: 3, fontFamily: 'Consolas, monospace', textAlign: 'center' }}>
        Simple API Test
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, mb: 3, justifyContent: 'center' }}>
        <Button
          variant="contained"
          onClick={testLogin}
          sx={{ bgcolor: '#0066cc', '&:hover': { bgcolor: '#0052a3' } }}
        >
          Test Login
        </Button>
        
        <Button
          variant="contained"
          onClick={testStations}
          sx={{ bgcolor: '#00cc66', '&:hover': { bgcolor: '#00b359' } }}
        >
          Test Stations
        </Button>
      </Box>

      {result && (
        <Alert severity="success" sx={{ mb: 2, bgcolor: 'rgba(76,175,80,0.1)', color: '#4caf50' }}>
          {result}
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2, bgcolor: 'rgba(244,67,54,0.1)', color: '#f44336' }}>
          {error}
        </Alert>
      )}

      <Typography variant="body2" sx={{ color: '#999', mt: 2, fontSize: '12px', textAlign: 'center' }}>
        Check browser console for detailed logs
      </Typography>
    </Paper>
  );
};
