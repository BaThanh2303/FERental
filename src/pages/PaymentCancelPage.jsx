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
  CardContent
} from '@mui/material';
import {
  Cancel,
  ArrowBack,
  Home,
  Payment
} from '@mui/icons-material';
import { getRentalDetails } from '../api.jsx';

const PaymentCancelPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [rentalData, setRentalData] = useState(null);

  const rentalId = searchParams.get('rentalId');
  const vnpResponseCode = searchParams.get('vnp_ResponseCode');
  const vnpTxnRef = searchParams.get('vnp_TxnRef');

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        if (rentalId) {
          const rental = await getRentalDetails(rentalId);
          setRentalData(rental);
        }
      } catch (error) {
        console.error('Failed to load rental data:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [rentalId]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 4, bgcolor: '#000000', minHeight: '100vh' }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
          <CircularProgress sx={{ color: '#ff0000' }} />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4, bgcolor: '#000000', minHeight: '100vh' }}>
      <Paper sx={{ 
        p: 4, 
        bgcolor: '#111', 
        border: '1px solid #333', 
        borderRadius: 2,
        textAlign: 'center'
      }}>
        {/* Cancel Icon */}
        <Box sx={{ mb: 3 }}>
          <Cancel sx={{ fontSize: 80, color: '#ff9800' }} />
        </Box>

        {/* Cancel Message */}
        <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold', mb: 2 }}>
          Thanh toán đã bị hủy
        </Typography>
        
        <Typography variant="body1" sx={{ color: '#ccc', mb: 4 }}>
          Bạn đã hủy quá trình thanh toán. Đơn hàng của bạn vẫn chưa được thanh toán.
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3, bgcolor: 'rgba(244,67,54,0.1)', color: '#f44336' }}>
            {error}
          </Alert>
        )}

        {/* Rental Info */}
        {rentalData && (
          <Card sx={{ bgcolor: '#222', border: '1px solid #444', mb: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: '#ff0000', mb: 2, fontWeight: 'bold' }}>
                Thông tin đơn hàng
              </Typography>
              
              <Box sx={{ display: 'grid', gap: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" sx={{ color: '#aaa' }}>
                    Mã đơn hàng
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'white', fontWeight: 'bold' }}>
                    #{rentalData.id || rentalData.rentalId}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" sx={{ color: '#aaa' }}>
                    Xe
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'white' }}>
                    {rentalData.vehicle?.name || rentalData.vehicle?.code || 'E-Bike'}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" sx={{ color: '#aaa' }}>
                    Gói thuê
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'white' }}>
                    {rentalData.rentalPackage?.name || 'N/A'}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" sx={{ color: '#aaa' }}>
                    Tổng tiền
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#ff0000', fontWeight: 'bold' }}>
                    {formatPrice(rentalData.totalCost || 0)}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        )}

        {/* Info Alert */}
        <Alert 
          severity="info" 
          sx={{ 
            mb: 3, 
            bgcolor: 'rgba(33,150,243,0.1)', 
            color: '#2196f3',
            textAlign: 'left'
          }}
        >
          <Typography variant="body2">
            <strong>Lưu ý:</strong> Đơn hàng của bạn vẫn được giữ lại. Bạn có thể thanh toán lại bất cứ lúc nào.
          </Typography>
        </Alert>

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            startIcon={<Payment />}
            onClick={() => navigate(`/payment/${rentalId}`)}
            sx={{
              bgcolor: '#ff0000',
              color: 'white',
              fontWeight: 'bold',
              px: 3,
              py: 1.5,
              '&:hover': { bgcolor: '#cc0000' }
            }}
          >
            Thanh toán lại
          </Button>
          
          <Button
            variant="outlined"
            startIcon={<ArrowBack />}
            onClick={() => navigate(`/rental/${rentalId}`)}
            sx={{
              borderColor: '#666',
              color: '#666',
              px: 3,
              py: 1.5,
              '&:hover': { 
                borderColor: '#ff0000', 
                color: '#ff0000' 
              }
            }}
          >
            Xem đơn hàng
          </Button>
          
          <Button
            variant="outlined"
            startIcon={<Home />}
            onClick={() => navigate('/')}
            sx={{
              borderColor: '#666',
              color: '#666',
              px: 3,
              py: 1.5,
              '&:hover': { 
                borderColor: '#ff0000', 
                color: '#ff0000' 
              }
            }}
          >
            Về trang chủ
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default PaymentCancelPage;
