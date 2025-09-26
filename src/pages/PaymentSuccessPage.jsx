import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Divider,
  Chip
} from '@mui/material';
import {
  CheckCircle,
  Error,
  ArrowForward,
  Home,
  Payment,
  Schedule
} from '@mui/icons-material';
import { getRentalDetails, getRentalPayment } from '../api.jsx';

const PaymentSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [rentalData, setRentalData] = useState(null);
  const [paymentData, setPaymentData] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState('checking');
  const [countdown, setCountdown] = useState(5);

  const rentalId = searchParams.get('rentalId');
  const paymentId = searchParams.get('paymentId');
  const vnpResponseCode = searchParams.get('vnp_ResponseCode');
  const vnpTxnRef = searchParams.get('vnp_TxnRef');
  const vnpAmount = searchParams.get('vnp_Amount') || searchParams.get('amount');
  const vnpSecureHash = searchParams.get('vnp_SecureHash');

  console.log('PaymentSuccessPage - URL params:', {
    rentalId,
    paymentId,
    vnpResponseCode,
    vnpTxnRef,
    vnpAmount,
    vnpSecureHash
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        console.log('Loading data for rentalId:', rentalId);
        
        if (rentalId) {
          // Load rental details
          console.log('Fetching rental details...');
          const rental = await getRentalDetails(rentalId);
          console.log('Rental details loaded:', rental);
          setRentalData(rental);
          
          // Load payment details
          try {
            console.log('Fetching payment details...');
            const payment = await getRentalPayment(rentalId);
            console.log('Payment details loaded:', payment);
            setPaymentData(payment);
          } catch (paymentError) {
            console.log('Payment details not found:', paymentError.message);
          }
        }
        
        // Determine payment status
        if (vnpResponseCode === '00') {
          console.log('Payment status: SUCCESS');
          setPaymentStatus('success');
        } else {
          console.log('Payment status: FAILED');
          setPaymentStatus('failed');
        }
        
      } catch (error) {
        console.error('Error loading data:', error);
        setError('Không thể tải thông tin thanh toán: ' + error.message);
        setPaymentStatus('error');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [rentalId, vnpResponseCode]);

  // Auto redirect after 5 seconds for success
  useEffect(() => {
    if (paymentStatus === 'success' && rentalId) {
      console.log('Setting up auto redirect to /rental/' + rentalId);
      
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            console.log('Auto redirecting to rental detail page...');
            navigate(`/rental/${rentalId}`);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [paymentStatus, rentalId, navigate]);

  const handleContinueToRental = () => {
    console.log('Manual redirect to rental detail page');
    if (rentalId) {
      navigate(`/rental/${rentalId}`);
    } else {
      navigate('/rentals');
    }
  };

  const handleGoHome = () => {
    navigate('/');
  };

  const formatAmount = (amount) => {
    if (!amount) return 'N/A';
    const numAmount = typeof amount === 'string' ? parseInt(amount) : amount;
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(numAmount / 100);
  };

  const getStatusInfo = () => {
    switch (paymentStatus) {
      case 'success':
        return {
          icon: <CheckCircle sx={{ fontSize: 60, color: '#4caf50' }} />,
          title: 'Thanh toán thành công!',
          message: 'Giao dịch của bạn đã được xử lý thành công.',
          color: '#4caf50',
          bgColor: 'rgba(76, 175, 80, 0.1)'
        };
      case 'failed':
        return {
          icon: <Error sx={{ fontSize: 60, color: '#f44336' }} />,
          title: 'Thanh toán thất bại',
          message: 'Giao dịch không thể hoàn tất. Vui lòng thử lại.',
          color: '#f44336',
          bgColor: 'rgba(244, 67, 54, 0.1)'
        };
      case 'error':
        return {
          icon: <Error sx={{ fontSize: 60, color: '#ff9800' }} />,
          title: 'Lỗi xử lý thanh toán',
          message: 'Có lỗi xảy ra khi xử lý thông tin thanh toán.',
          color: '#ff9800',
          bgColor: 'rgba(255, 152, 0, 0.1)'
        };
      default:
        return {
          icon: <Schedule sx={{ fontSize: 60, color: '#2196f3' }} />,
          title: 'Đang xử lý...',
          message: 'Vui lòng chờ trong giây lát.',
          color: '#2196f3',
          bgColor: 'rgba(33, 150, 243, 0.1)'
        };
    }
  };

  const statusInfo = getStatusInfo();

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
          <Box sx={{ textAlign: 'center' }}>
            <CircularProgress size={60} sx={{ color: '#0070ba', mb: 2 }} />
            <Typography variant="h6" sx={{ color: '#666' }}>
              Đang xử lý thông tin thanh toán...
            </Typography>
          </Box>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        {/* Status Icon and Title */}
        <Box sx={{ mb: 3 }}>
          {statusInfo.icon}
        </Box>
        
        <Typography variant="h4" sx={{ 
          fontWeight: 'bold', 
          color: statusInfo.color,
          mb: 2 
        }}>
          {statusInfo.title}
        </Typography>
        
        <Typography variant="body1" sx={{ 
          color: '#666', 
          mb: 4,
          maxWidth: '500px',
          mx: 'auto'
        }}>
          {statusInfo.message}
        </Typography>

        {/* VNPay Transaction Details */}
        {(vnpTxnRef || vnpAmount) && (
          <Card sx={{ 
            mb: 4, 
            bgcolor: statusInfo.bgColor,
            border: `1px solid ${statusInfo.color}20`
          }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, color: statusInfo.color }}>
                Thông tin giao dịch VNPay
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {vnpTxnRef && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" sx={{ color: '#666' }}>
                      Mã giao dịch:
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      {vnpTxnRef}
                    </Typography>
                  </Box>
                )}
                
                {vnpAmount && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" sx={{ color: '#666' }}>
                      Số tiền:
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      {formatAmount(vnpAmount)}
                    </Typography>
                  </Box>
                )}
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" sx={{ color: '#666' }}>
                    Mã phản hồi:
                  </Typography>
                  <Chip 
                    label={vnpResponseCode === '00' ? 'Thành công' : 'Thất bại'}
                    color={vnpResponseCode === '00' ? 'success' : 'error'}
                    size="small"
                  />
                </Box>
              </Box>
            </CardContent>
          </Card>
        )}

        {/* Rental Information */}
        {rentalData && (
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Thông tin đơn hàng
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" sx={{ color: '#666' }}>
                    Mã đơn hàng:
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    #{rentalData.id}
                  </Typography>
                </Box>
                
                {rentalData.vehicle && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" sx={{ color: '#666' }}>
                      Xe thuê:
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      {rentalData.vehicle.name || rentalData.vehicle.code}
                    </Typography>
                  </Box>
                )}
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" sx={{ color: '#666' }}>
                    Trạng thái:
                  </Typography>
                  <Chip 
                    label={rentalData.status === 'PAID' ? 'Đã thanh toán' : 'Chờ thanh toán'}
                    color={rentalData.status === 'PAID' ? 'success' : 'warning'}
                    size="small"
                  />
                </Box>
              </Box>
            </CardContent>
          </Card>
        )}

        {/* Error Message */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
          {paymentStatus === 'success' && rentalId && (
            <Button
              variant="contained"
              size="large"
              onClick={handleContinueToRental}
              startIcon={<ArrowForward />}
              sx={{
                bgcolor: '#4caf50',
                '&:hover': { bgcolor: '#45a049' }
              }}
            >
              Xem chi tiết đơn hàng
            </Button>
          )}
          
          <Button
            variant="outlined"
            size="large"
            onClick={handleGoHome}
            startIcon={<Home />}
            sx={{
              borderColor: '#0070ba',
              color: '#0070ba',
              '&:hover': { 
                borderColor: '#005ea6',
                bgcolor: 'rgba(0, 112, 186, 0.04)'
              }
            }}
          >
            Về trang chủ
          </Button>
        </Box>

        {/* Auto redirect countdown for success */}
        {paymentStatus === 'success' && rentalId && (
          <Typography variant="body2" sx={{ color: '#666', mt: 3 }}>
            Tự động chuyển đến trang đơn hàng trong {countdown} giây...
          </Typography>
        )}

        {/* Debug info */}
        <Box sx={{ mt: 4, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
          <Typography variant="caption" sx={{ color: '#666' }}>
            Debug Info:
            <br />• Rental ID: {rentalId}
            <br />• Payment ID: {paymentId}
            <br />• VNPay Response Code: {vnpResponseCode}
            <br />• VNPay TxnRef: {vnpTxnRef}
            <br />• Amount: {vnpAmount}
            <br />• Payment Status: {paymentStatus}
            <br />• Countdown: {countdown}
            <br />• Current URL: {window.location.href}
            <br />• Rental Data: {rentalData ? 'Loaded' : 'Not loaded'}
            <br />• Payment Data: {paymentData ? 'Loaded' : 'Not loaded'}
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default PaymentSuccessPage;