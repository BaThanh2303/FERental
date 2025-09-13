import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Alert, CircularProgress, Paper } from '@mui/material';
import { CheckCircle, Error, Warning } from '@mui/icons-material';

export const APIConnectionTest = () => {
  const [connectionStatus, setConnectionStatus] = useState('checking');
  const [lastChecked, setLastChecked] = useState(null);
  const [errorDetails, setErrorDetails] = useState('');

  const checkConnection = async () => {
    setConnectionStatus('checking');
    setErrorDetails('');
    
    try {
      const startTime = Date.now();
      const response = await fetch('http://localhost:8080/api/health', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        // Add timeout
        signal: AbortSignal.timeout(5000)
      });
      
      const endTime = Date.now();
      const responseTime = endTime - startTime;
      
      if (response.ok) {
        setConnectionStatus('connected');
        setLastChecked(new Date().toLocaleTimeString());
      } else {
        setConnectionStatus('error');
        setErrorDetails(`Server responded with status: ${response.status}`);
        setLastChecked(new Date().toLocaleTimeString());
      }
    } catch (error) {
      setConnectionStatus('error');
      setLastChecked(new Date().toLocaleTimeString());
      
      if (error.name === 'AbortError') {
        setErrorDetails('Request timeout - Server không phản hồi trong 5 giây');
      } else if (error.message.includes('Failed to fetch')) {
        setErrorDetails('Không thể kết nối đến server. Có thể server chưa khởi động hoặc đang gặp sự cố.');
      } else {
        setErrorDetails(`Lỗi kết nối: ${error.message}`);
      }
    }
  };

  useEffect(() => {
    checkConnection();
  }, []);

  const getStatusIcon = () => {
    switch (connectionStatus) {
      case 'connected':
        return <CheckCircle sx={{ color: '#4caf50', fontSize: 40 }} />;
      case 'error':
        return <Error sx={{ color: '#f44336', fontSize: 40 }} />;
      case 'checking':
        return <CircularProgress size={40} sx={{ color: '#ff0000' }} />;
      default:
        return <Warning sx={{ color: '#ff9800', fontSize: 40 }} />;
    }
  };

  const getStatusText = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'Kết nối thành công';
      case 'error':
        return 'Kết nối thất bại';
      case 'checking':
        return 'Đang kiểm tra kết nối...';
      default:
        return 'Trạng thái không xác định';
    }
  };

  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'connected':
        return '#4caf50';
      case 'error':
        return '#f44336';
      case 'checking':
        return '#ff0000';
      default:
        return '#ff9800';
    }
  };

  return (
    <Paper sx={{ 
      p: 3, 
      bgcolor: '#111111', 
      borderRadius: 2, 
      border: '1px solid #333',
      maxWidth: 500,
      mx: 'auto',
      mt: 2
    }}>
      <Typography variant="h6" sx={{ color: '#ff0000', mb: 3, fontFamily: 'Consolas, monospace', textAlign: 'center' }}>
        API Connection Status
      </Typography>

      <Box sx={{ textAlign: 'center', mb: 3 }}>
        {getStatusIcon()}
        <Typography 
          variant="h6" 
          sx={{ 
            color: getStatusColor(), 
            mt: 2, 
            fontFamily: 'Consolas, monospace',
            fontWeight: 'bold'
          }}
        >
          {getStatusText()}
        </Typography>
      </Box>

      {connectionStatus === 'connected' && (
        <Alert severity="success" sx={{ mb: 3, bgcolor: 'rgba(76,175,80,0.1)', color: '#4caf50' }}>
          Server API đang hoạt động bình thường
        </Alert>
      )}

      {connectionStatus === 'error' && (
        <Alert severity="error" sx={{ mb: 3, bgcolor: 'rgba(244,67,54,0.1)', color: '#f44336' }}>
          {errorDetails}
        </Alert>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
        <Button
          variant="contained"
          onClick={checkConnection}
          disabled={connectionStatus === 'checking'}
          sx={{
            bgcolor: '#ff0000',
            color: 'white',
            fontFamily: 'Consolas, monospace',
            '&:hover': { bgcolor: '#cc0000' },
            '&:disabled': { bgcolor: '#666' }
          }}
        >
          {connectionStatus === 'checking' ? 'Đang kiểm tra...' : 'Kiểm tra lại'}
        </Button>
      </Box>

      {lastChecked && (
        <Typography variant="body2" sx={{ color: '#999', textAlign: 'center', fontSize: '12px' }}>
          Lần kiểm tra cuối: {lastChecked}
        </Typography>
      )}

      <Box sx={{ mt: 3, p: 2, bgcolor: '#222', borderRadius: 1 }}>
        <Typography variant="body2" sx={{ color: '#ccc', mb: 1, fontFamily: 'Consolas, monospace' }}>
          <strong>API Endpoint:</strong> http://localhost:8080/api
        </Typography>
        <Typography variant="body2" sx={{ color: '#ccc', mb: 1, fontFamily: 'Consolas, monospace' }}>
          <strong>Health Check:</strong> GET /api/health
        </Typography>
        <Typography variant="body2" sx={{ color: '#ccc', fontFamily: 'Consolas, monospace' }}>
          <strong>Timeout:</strong> 5 giây
        </Typography>
      </Box>

      {connectionStatus === 'error' && (
        <Box sx={{ mt: 3, p: 2, bgcolor: 'rgba(255,152,0,0.1)', borderRadius: 1, border: '1px solid #ff9800' }}>
          <Typography variant="body2" sx={{ color: '#ff9800', mb: 1, fontFamily: 'Consolas, monospace', fontWeight: 'bold' }}>
            Khắc phục sự cố:
          </Typography>
          <Typography variant="body2" sx={{ color: '#ff9800', fontSize: '12px', fontFamily: 'Consolas, monospace' }}>
            1. Kiểm tra server backend có đang chạy không
          </Typography>
          <Typography variant="body2" sx={{ color: '#ff9800', fontSize: '12px', fontFamily: 'Consolas, monospace' }}>
            2. Kiểm tra port 3000 có bị block không
          </Typography>
          <Typography variant="body2" sx={{ color: '#ff9800', fontSize: '12px', fontFamily: 'Consolas, monospace' }}>
            3. Kiểm tra firewall/antivirus
          </Typography>
          <Typography variant="body2" sx={{ color: '#ff9800', fontSize: '12px', fontFamily: 'Consolas, monospace' }}>
            4. Thử restart server backend
          </Typography>
        </Box>
      )}
    </Paper>
  );
};
