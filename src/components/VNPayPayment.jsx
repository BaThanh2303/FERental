import React, { useState } from 'react';
import { Box, Button, Alert, CircularProgress, Typography } from '@mui/material';
import { Payment } from '@mui/icons-material';
import { createVNPayPayment } from '../api.jsx';

export default function VNPayPayment({ rentalData }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleVNPayPayment = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Validate rental data
      if (!rentalData) {
        throw new Error('Không có thông tin đơn hàng');
      }
      
      if (!rentalData.id && !rentalData.rentalId) {
        throw new Error('Không có ID đơn hàng');
      }
      
      if (!rentalData.totalCost || rentalData.totalCost <= 0) {
        throw new Error('Số tiền thanh toán không hợp lệ');
      }
      
      // Tạo payment data cho VNPay (API mới đơn giản)
      const paymentData = {
        rentalId: rentalData.id || rentalData.rentalId,
        amount: parseFloat(rentalData.totalCost) || 0,
        orderInfo: `Thanh toán thuê xe ${rentalData.vehicle?.name || rentalData.vehicle?.code || 'E-Bike'}`
      };
      
      console.log('Creating VNPay payment with data:', paymentData);
      console.log('Rental data:', rentalData);
      
      // Gọi API tạo VNPay payment (API mới đơn giản)
      const result = await createVNPayPayment(paymentData);
      
      console.log('VNPay API result:', result);
      
      // Kiểm tra các URL có thể có từ backend
      const vnpayUrl = result.paymentUrl || result.url || result.redirectUrl;
      
      if (result.success && vnpayUrl) {
        // Redirect đến VNPay
        console.log('Redirecting to VNPay:', vnpayUrl);
        window.location.href = vnpayUrl;
      } else {
        console.error('VNPay payment creation failed:', result);
        throw new Error(result.message || 'Failed to create VNPay payment');
      }
      
    } catch (error) {
      console.error('VNPay payment error:', error);
      console.error('Error stack:', error.stack);
      setError('Lỗi tạo thanh toán VNPay: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          <CircularProgress sx={{ color: '#0070ba' }} />
        </Box>
      )}
      
      <Button
        fullWidth
        variant="contained"
        size="large"
        onClick={handleVNPayPayment}
        disabled={loading || rentalData.status !== 'PENDING'}
        startIcon={loading ? <CircularProgress size={20} sx={{ color: 'white' }} /> : <Payment />}
        sx={{
          py: 2,
          bgcolor: '#0070ba',
          color: 'white',
          fontWeight: 'bold',
          fontSize: '1.1rem',
          '&:hover': { bgcolor: '#005ea6' },
          '&:disabled': { bgcolor: '#666' }
        }}
      >
        {loading ? 'Đang tạo thanh toán...' : 'Thanh toán với VNPay'}
      </Button>
      
      {error && (
        <Alert severity="error" sx={{ mt: 2, bgcolor: 'rgba(244,67,54,0.1)', color: '#f44336' }}>
          {error}
        </Alert>
      )}
      
      <Typography variant="body2" sx={{ color: '#ccc', mt: 2, textAlign: 'center' }}>
        Bạn sẽ được chuyển hướng đến VNPay để hoàn tất thanh toán
      </Typography>
    </Box>
  );
}
