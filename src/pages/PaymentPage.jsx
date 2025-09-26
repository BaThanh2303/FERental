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
  ListItemIcon,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl
} from '@mui/material';
import {
  ArrowBack,
  Payment,
  CheckCircle,
  AccessTime,
  LocalShipping,
  CreditCard,
  Security,
  DirectionsCar,
  LocationOn,
  Refresh
} from '@mui/icons-material';
import { useRental } from '../context/RentalContext';
import { confirmRentalPayment, getRentalDetails, getVehicleDetails, getRentalPayment } from '../api.jsx';
import VNPayPayment from '../components/VNPayPayment';

const PaymentPage = () => {
  const { rentalId } = useParams();
  //const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { 
    setCurrentRental,
    loading,
    setLoading,
    error,
    setError
  } = useRental();

  const [rentalData, setRentalData] = useState(null);
  const [vehicleData, setVehicleData] = useState(null);
  const [paymentData, setPaymentData] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('vnpay');
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [loadingTimeout, setLoadingTimeout] = useState(null);
  
  // No need for paymentId anymore - VNPay API creates payment record

  const loadRentalDetails = useCallback(async (forceReload = false) => {
    // Prevent multiple simultaneous calls
    if (loading && !forceReload) {
      console.log('Already loading, skipping...');
      return;
    }

    // Clear any existing timeout
    if (loadingTimeout) {
      clearTimeout(loadingTimeout);
    }

    try {
      setLoading(true);
      setError(null); // Clear any previous errors
      console.log('Fetching fresh rental details for ID:', rentalId);
      
      const rental = await getRentalDetails(rentalId);
      console.log('Received fresh rental details:', rental);
      setRentalData(rental);
      setCurrentRental(rental);
      
      // Load vehicle details if vehicleId exists
      const vehicleId = rental.vehicleId || rental.vehicle?.id || rental.vehicle?.vehicleId;
      if (vehicleId) {
        console.log('Loading fresh vehicle details for ID:', vehicleId);
        try {
          const vehicle = await getVehicleDetails(vehicleId);
          console.log('Received fresh vehicle details:', vehicle);
          setVehicleData(vehicle);
        } catch (vehicleError) {
          console.error('Failed to load vehicle details:', vehicleError);
          // Don't set error for vehicle loading failure, just log it
        }
      } else {
        console.log('No vehicleId found in rental data');
        setVehicleData(null);
      }

      // Load payment details if exists
      const payment = await getRentalPayment(rentalId);
      console.log('Received payment details:', payment);
      setPaymentData(payment);
    } catch (error) {
      console.error('Failed to load rental details:', error);
      setError(error.message);
    } finally {
      // Add a small delay to prevent rapid successive calls
      const timeout = setTimeout(() => {
        setLoading(false);
        setIsInitialLoad(false);
      }, 100);
      setLoadingTimeout(timeout);
    }
  }, [rentalId, setCurrentRental, setLoading, setError, loading, loadingTimeout]);

  useEffect(() => {
    console.log('PaymentPage - rentalId from URL:', rentalId);
    
    if (!rentalId || rentalId === 'undefined') {
      console.error('No valid rentalId found, redirecting to home');
      navigate('/');
      return;
    }

    // Only load on initial mount or when rentalId changes
    if (isInitialLoad) {
      console.log('Initial load - Loading fresh rental details for ID:', rentalId);
      loadRentalDetails();
    }
  }, [rentalId, navigate, isInitialLoad, loadRentalDetails]);

  // Reset states when rentalId changes
  useEffect(() => {
    setVehicleData(null);
    setPaymentData(null);
    setIsInitialLoad(true);
  }, [rentalId]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (loadingTimeout) {
        clearTimeout(loadingTimeout);
      }
    };
  }, [loadingTimeout]);


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
    <Container maxWidth="md" sx={{ py: 4, bgcolor: '#000000', minHeight: '100vh' }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate('/')}
            sx={{ color: '#ff0000' }}
          >
            Quay lại
          </Button>
          <Button
            startIcon={<Refresh />}
            onClick={() => loadRentalDetails(true)}
            disabled={loading}
            sx={{ color: '#ff0000' }}
          >
            Làm mới
          </Button>
        </Box>
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
          {vehicleData ? (
            <Card sx={{ bgcolor: '#222', border: '1px solid #444', mb: 3 }}>
              <CardMedia
                component="img"
                height="200"
                image={vehicleData.imageUrl || 
                       vehicleData.image || 
                       vehicleData.photo || 
                       '/src/assets/images/vinfast.jpg'}
                alt={vehicleData.name || 
                     vehicleData.code || 
                     vehicleData.make || 
                     'Xe điện'}
                sx={{ objectFit: 'cover' }}
              />
              <CardContent>
                <Typography variant="h5" sx={{ color: 'white', mb: 2, fontWeight: 'bold' }}>
                  {vehicleData.name || 
                   vehicleData.code || 
                   vehicleData.make || 
                   'Xe điện'}
                </Typography>
                
                <Box sx={{ display: 'grid', gap: 2, mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <DirectionsCar sx={{ color: '#ff0000', fontSize: 20 }} />
                    <Typography variant="body1" sx={{ color: '#ccc' }}>
                      Biển số: <strong style={{ color: 'white' }}>
                        {vehicleData.licensePlate || 
                         vehicleData.plateNumber || 
                         'N/A'}
                      </strong>
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LocationOn sx={{ color: '#ff0000', fontSize: 20 }} />
                    <Typography variant="body1" sx={{ color: '#ccc' }}>
                      Trạm: <strong style={{ color: 'white' }}>
                        {vehicleData.station?.name || 
                         vehicleData.stationName || 
                         'N/A'}
                      </strong>
                    </Typography>
                  </Box>
                </Box>
                
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <Chip 
                    label={vehicleData.type || 
                           vehicleData.vehicleType || 
                           'E-Scooter'} 
                    size="small" 
                    sx={{ bgcolor: '#ff0000', color: 'white' }}
                  />
                  <Chip 
                    label={`Pin: ${vehicleData.batteryLevel || 
                                   vehicleData.battery || 
                                   0}%`}
                    size="small" 
                    sx={{ bgcolor: '#4caf50', color: 'white' }}
                  />
                  <Chip 
                    label={vehicleData.status || 
                           vehicleData.vehicleStatus || 
                           'AVAILABLE'}
                    size="small" 
                    sx={{ bgcolor: '#333', color: '#ccc' }}
                  />
                </Box>
              </CardContent>
            </Card>
          ) : (
            <Card sx={{ bgcolor: '#222', border: '1px solid #444', mb: 3 }}>
              <CardContent>
                <Typography variant="h6" sx={{ color: '#ff0000', mb: 2, fontWeight: 'bold' }}>
                  Thông tin xe
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <CircularProgress size={20} sx={{ color: '#ff0000' }} />
                  <Typography variant="body2" sx={{ color: '#ccc' }}>
                    Đang tải thông tin xe...
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          )}

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
          <FormControl component="fieldset" sx={{ mb: 3 }}>
            <RadioGroup
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <Card sx={{ 
                bgcolor: '#222', 
                border: paymentMethod === 'vnpay' ? '2px solid #ff0000' : '1px solid #444', 
                mb: 2,
                cursor: 'pointer',
                '&:hover': { bgcolor: '#333' }
              }}>
                <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <FormControlLabel
                    value="vnpay"
                    control={<Radio sx={{ color: '#ff0000' }} />}
                    label=""
                    sx={{ m: 0 }}
                  />
                  <Box sx={{ 
                    width: 40, 
                    height: 40, 
                    bgcolor: '#0070ba', 
                    borderRadius: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '12px'
                  }}>
                    VNPay
                  </Box>
                  <Box>
                    <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }}>
                      VNPay
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#ccc' }}>
                      Thanh toán an toàn với VNPay
                    </Typography>
                  </Box>
                </CardContent>
              </Card>

              <Card sx={{ 
                bgcolor: '#222', 
                border: paymentMethod === 'cod' ? '2px solid #ff0000' : '1px solid #444', 
                mb: 2,
                cursor: 'pointer',
                '&:hover': { bgcolor: '#333' }
              }}>
                <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <FormControlLabel
                    value="cod"
                    control={<Radio sx={{ color: '#ff0000' }} />}
                    label=""
                    sx={{ m: 0 }}
                  />
                  <CreditCard sx={{ color: '#ff0000', fontSize: 32 }} />
                  <Box>
                    <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }}>
                      Thanh toán khi nhận xe
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#ccc' }}>
                      Thanh toán trực tiếp khi lấy xe
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </RadioGroup>
          </FormControl>

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

          {/* Payment Status */}
          {paymentData && (
            <Alert 
              severity={paymentData.status === 'COMPLETED' ? 'success' : 'info'} 
              sx={{ mb: 3, bgcolor: 'rgba(76,175,80,0.1)', color: '#4caf50' }}
            >
              <Typography variant="body2">
                <strong>Trạng thái thanh toán:</strong> {paymentData.status || 'PENDING'}
                {paymentData.paymentId && (
                  <><br /><strong>Payment ID:</strong> {paymentData.paymentId}</>
                )}
              </Typography>
            </Alert>
          )}

          {/* Payment Component */}
          {paymentData?.status === 'COMPLETED' ? (
            <Alert severity="success" sx={{ mb: 3, bgcolor: 'rgba(76,175,80,0.1)', color: '#4caf50' }}>
              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                ✅ Đã thanh toán thành công!
              </Typography>
              <Button
                fullWidth
                variant="contained"
                size="large"
                onClick={() => navigate(`/rental/${rentalId}`)}
                sx={{
                  mt: 2,
                  py: 2,
                  bgcolor: '#4caf50',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '1.1rem',
                  '&:hover': { bgcolor: '#388e3c' }
                }}
              >
                Xem chi tiết đơn hàng
              </Button>
            </Alert>
          ) : (
            <>
              {paymentMethod === 'vnpay' ? (
                <VNPayPayment
                  rentalData={rentalData}
                />
              ) : (
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
                  {loading ? 'Đang xử lý...' : 'Xác nhận đặt xe (COD)'}
                </Button>
              )}
            </>
          )}
          

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