import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Divider,
  Alert,
  CircularProgress,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import {
  ArrowBack,
  Payment,
  CheckCircle,
  AccessTime,
  LocalShipping,
  CreditCard,
  Security
} from '@mui/icons-material';
import { useRental } from '../context/RentalContext';
import { confirmRentalPayment, getRentalDetails } from '../api.jsx';

const PaymentPage = () => {
  const { rentalId } = useParams();
  const navigate = useNavigate();
  const { 
    currentRental, 
    setCurrentRental,
    loading,
    setLoading,
    error,
    setError
  } = useRental();

  const [rentalData, setRentalData] = useState(null);

  const loadRentalDetails = useCallback(async () => {
    try {
      setLoading(true);
      console.log('Fetching rental details for ID:', rentalId);
      const rental = await getRentalDetails(rentalId);
      console.log('Received rental details:', rental);
      setRentalData(rental);
      setCurrentRental(rental);
    } catch (error) {
      console.error('Failed to load rental details:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [rentalId, setCurrentRental, setLoading, setError]);

  useEffect(() => {
    console.log('PaymentPage - rentalId from URL:', rentalId);
    console.log('PaymentPage - currentRental from context:', currentRental);
    
    if (!rentalId || rentalId === 'undefined') {
      console.error('No valid rentalId found, redirecting to home');
      navigate('/');
      return;
    }

    // If we don't have rental data in context, fetch it
    if (!currentRental || (currentRental.id !== parseInt(rentalId) && currentRental.rentalId !== parseInt(rentalId))) {
      console.log('Loading rental details for ID:', rentalId);
      loadRentalDetails();
    } else {
      console.log('Using rental data from context');
      setRentalData(currentRental);
    }
  }, [rentalId, currentRental, navigate, loadRentalDetails]);


  const handlePayNow = async () => {
    try {
      setLoading(true);
      setError(null);

      const confirmedRental = await confirmRentalPayment(rentalId);
      setCurrentRental(confirmedRental);
      
      // Navigate to rental detail page using rentalId from response
      const confirmedRentalId = confirmedRental.rentalId || confirmedRental.id || rentalId;
      navigate(`/rental/${confirmedRentalId}`);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };


  if (loading && !rentalData) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
          <CircularProgress sx={{ color: '#ff0000' }} />
        </Box>
      </Container>
    );
  }

  if (!rentalData) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ bgcolor: 'rgba(244,67,54,0.1)', color: '#f44336' }}>
          Không tìm thấy thông tin đặt xe
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/')}
          sx={{ mb: 2, color: '#ff0000' }}
        >
          Quay lại
        </Button>
        <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold' }}>
          Thanh toán
        </Typography>
        <Typography variant="body1" sx={{ color: '#ccc', mt: 1 }}>
          Mã đặt xe: #{rentalData.id}
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
        {/* Rental Summary */}
        <Paper sx={{ 
          flex: 1, 
          p: 3, 
          bgcolor: '#111111', 
          border: '1px solid #333',
          borderRadius: 2
        }}>
          <Typography variant="h6" sx={{ color: '#ff0000', mb: 3, fontWeight: 'bold' }}>
            Tóm tắt đặt xe
          </Typography>
          
          {/* Vehicle Info */}
          <Card sx={{ bgcolor: '#222', border: '1px solid #444', mb: 3 }}>
            <CardMedia
              component="img"
              height="150"
              image={rentalData.vehicle?.imageUrl || '/src/assets/images/vinfast.jpg'}
              alt={rentalData.vehicle?.licensePlate}
              sx={{ objectFit: 'cover' }}
            />
            <CardContent>
              <Typography variant="h6" sx={{ color: 'white', mb: 1, fontWeight: 'bold' }}>
                {rentalData.vehicle?.licensePlate}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <Chip 
                  label={rentalData.vehicle?.make || 'Electric Bike'} 
                  size="small" 
                  sx={{ bgcolor: '#ff0000', color: 'white' }}
                />
                <Chip 
                  label={rentalData.vehicle?.stationName || 'Station'} 
                  size="small" 
                  sx={{ bgcolor: '#333', color: '#ccc' }}
                />
              </Box>
            </CardContent>
          </Card>

          {/* Package Info */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ color: 'white', mb: 2, fontWeight: 'bold' }}>
              Gói thuê
            </Typography>
            <List sx={{ bgcolor: '#222', borderRadius: 2, border: '1px solid #444' }}>
              <ListItem>
                <ListItemIcon>
                  <AccessTime sx={{ color: '#ff0000' }} />
                </ListItemIcon>
                <ListItemText
                  primary={rentalData.rentalPackage?.name || 'Gói thuê'}
                  secondary={`Thời gian: ${rentalData.rentalPackage?.duration || 24} giờ`}
                  primaryTypographyProps={{ color: 'white', fontWeight: 'bold' }}
                  secondaryTypographyProps={{ color: '#ccc' }}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <LocalShipping sx={{ color: '#ff0000' }} />
                </ListItemIcon>
                <ListItemText
                  primary="Trạng thái"
                  secondary={rentalData.status === 'PENDING' ? 'Chờ thanh toán' : rentalData.status}
                  primaryTypographyProps={{ color: 'white', fontWeight: 'bold' }}
                  secondaryTypographyProps={{ color: '#ccc' }}
                />
              </ListItem>
            </List>
          </Box>

          {/* Price Summary */}
          <Box sx={{ p: 2, bgcolor: '#222', borderRadius: 2, border: '1px solid #444' }}>
            <Typography variant="h6" sx={{ color: '#ff0000', mb: 2, fontWeight: 'bold' }}>
              Chi tiết thanh toán
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body1" sx={{ color: '#ccc' }}>
                Gói thuê
              </Typography>
              <Typography variant="body1" sx={{ color: 'white' }}>
                {formatPrice(rentalData.totalCost)}
              </Typography>
            </Box>
            <Divider sx={{ bgcolor: '#444', my: 1 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }}>
                Tổng cộng
              </Typography>
              <Typography variant="h6" sx={{ color: '#ff0000', fontWeight: 'bold' }}>
                {formatPrice(rentalData.totalCost)}
              </Typography>
            </Box>
          </Box>
        </Paper>

        {/* Payment Method */}
        <Paper sx={{ 
          flex: 1, 
          p: 3, 
          bgcolor: '#111111', 
          border: '1px solid #333',
          borderRadius: 2
        }}>
          <Typography variant="h6" sx={{ color: '#ff0000', mb: 3, fontWeight: 'bold' }}>
            Phương thức thanh toán
          </Typography>

          {/* Payment Method Selection */}
          <Card sx={{ 
            bgcolor: '#222', 
            border: '2px solid #ff0000', 
            mb: 3,
            cursor: 'pointer',
            '&:hover': { bgcolor: '#333' }
          }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <CreditCard sx={{ color: '#ff0000', fontSize: 32 }} />
              <Box>
                <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }}>
                  Thanh toán ngay
                </Typography>
                <Typography variant="body2" sx={{ color: '#ccc' }}>
                  Xác nhận thanh toán và bắt đầu thuê xe
                </Typography>
              </Box>
            </CardContent>
          </Card>

          {/* Security Info */}
          <Box sx={{ 
            p: 2, 
            bgcolor: '#222', 
            borderRadius: 2, 
            border: '1px solid #444',
            mb: 3
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Security sx={{ color: '#4caf50', fontSize: 20 }} />
              <Typography variant="body2" sx={{ color: '#4caf50', fontWeight: 'bold' }}>
                Bảo mật thanh toán
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: '#ccc', fontSize: '0.875rem' }}>
              Thông tin thanh toán của bạn được mã hóa và bảo mật. 
              Chúng tôi không lưu trữ thông tin thẻ tín dụng.
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3, bgcolor: 'rgba(244,67,54,0.1)', color: '#f44336' }}>
              {error}
            </Alert>
          )}

          <Button
            fullWidth
            variant="contained"
            size="large"
            onClick={handlePayNow}
            disabled={loading || rentalData.status !== 'PENDING'}
            startIcon={loading ? <CircularProgress size={20} sx={{ color: 'white' }} /> : <Payment />}
            sx={{
              py: 2,
              bgcolor: '#ff0000',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '1.1rem',
              '&:hover': { bgcolor: '#cc0000' },
              '&:disabled': { bgcolor: '#666' }
            }}
          >
            {loading ? 'Đang xử lý...' : 'Thanh toán ngay'}
          </Button>
          

          {rentalData.status !== 'PENDING' && (
            <Alert severity="info" sx={{ mt: 2, bgcolor: 'rgba(33,150,243,0.1)', color: '#2196f3' }}>
              Đơn hàng này đã được thanh toán hoặc không thể thanh toán.
            </Alert>
          )}
        </Paper>
      </Box>
    </Container>
  );
};

export default PaymentPage;
