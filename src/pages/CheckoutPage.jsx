import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Card,
  CardContent,
  CardMedia,
  Divider,
  Alert,
  CircularProgress,
  Chip
} from '@mui/material';
import {
  ArrowBack,
  CheckCircle,
  LocalShipping,
  AccessTime
} from '@mui/icons-material';
import { useRental } from '../context/RentalContext';
import { getRentalPackages, createRentalPreorder, getCurrentUser, getUserId } from '../api.jsx';
import { useUserInfo } from '../context/UserContext.jsx';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { 
    selectedVehicle, 
    setSelectedVehicle, 
    selectedPackage, 
    setSelectedPackage,
    rentalPackages,
    setRentalPackages,
    setCurrentRental,
    loading,
    setLoading,
    error,
    setError
  } = useRental();

  const [user, setUser] = useState(null);
  const { cccdImageUrl } = useUserInfo();

  // Get vehicle data from location state or context
  const vehicleData = location.state?.vehicle || selectedVehicle;

  // Load rental packages only once
  useEffect(() => {
    const loadRentalPackages = async () => {
      try {
        setLoading(true);
        const packages = await getRentalPackages();
        setRentalPackages(packages);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (rentalPackages.length === 0) {
      loadRentalPackages();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  // Load current user only once
  useEffect(() => {
    const loadCurrentUser = async () => {
      try {
        const userId = getUserId();
        if (!userId) {
          console.error('No user ID found');
          navigate('/');
          return;
        }
        
        const userData = await getCurrentUser(userId);
        setUser(userData);
      } catch (error) {
        console.error('Failed to load user:', error);
        navigate('/');
      }
    };

    if (!user) {
      loadCurrentUser();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  // Handle vehicle data and navigation
  useEffect(() => {
    if (!vehicleData) {
      navigate('/');
      return;
    }

    // Set vehicle in context if not already set
    if (!selectedVehicle) {
      setSelectedVehicle(vehicleData);
    }
  }, [vehicleData, selectedVehicle, setSelectedVehicle, navigate]);

  // Debug selectedPackage changes
  useEffect(() => {
    console.log('Selected package changed:', selectedPackage);
  }, [selectedPackage]);

  const handleConfirmAndPay = async () => {
    if (!selectedPackage || !user) {
      setError('Vui lòng chọn gói thuê và đảm bảo đã đăng nhập');
      return;
    }

    // Validate all required IDs
    if (!user.id && !user.userId) {
      setError('Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.');
      return;
    }

    if (!vehicleData.id) {
      setError('Không tìm thấy thông tin xe. Vui lòng chọn lại xe.');
      return;
    }

    if (!selectedPackage.packageId && !selectedPackage.id) {
      setError('Không tìm thấy thông tin gói thuê. Vui lòng chọn lại gói.');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Guard: require CCCD uploaded
      if (!cccdImageUrl) {
        navigate('/upload-cccd', { state: { from: '/checkout' } });
        return;
      }

      const rentalData = {
        userId: user.id || user.userId,
        vehicleId: vehicleData.id,
        packageId: selectedPackage.packageId || selectedPackage.id
      };


      const rentalResponse = await createRentalPreorder(rentalData);
      setCurrentRental(rentalResponse);
      
      // Navigate to payment page
      const rentalId = rentalResponse.id || rentalResponse.rentalId;
      if (!rentalId) {
        setError('Không nhận được ID đặt xe từ server. Vui lòng thử lại.');
        return;
      }
      
      navigate(`/payment/${rentalId}`);
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

  const formatDuration = (hours) => {
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;
    
    if (days > 0 && remainingHours > 0) {
      return `${days} ngày ${remainingHours} giờ`;
    } else if (days > 0) {
      return `${days} ngày`;
    } else {
      return `${hours} giờ`;
    }
  };

  if (!vehicleData) {
    return null;
  }

  return (
    <Container maxWidth="md" sx={{ py: 4, bgcolor: '#000000', minHeight: '100vh' }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => {
            console.log('Navigating to home page...');
            navigate('/');
          }}
          sx={{ mb: 2, color: '#ff0000' }}
        >
          Quay lại
        </Button>
        <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold' }}>
          Xác nhận đặt xe
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
        {/* Vehicle Info */}
        <Paper sx={{ 
          flex: 1, 
          p: 3, 
          bgcolor: '#111111', 
          border: '1px solid #333',
          borderRadius: 2
        }}>
          <Typography variant="h6" sx={{ color: '#ff0000', mb: 3, fontWeight: 'bold' }}>
            Thông tin xe
          </Typography>
          
          <Card sx={{ bgcolor: '#222', border: '1px solid #444' }}>
            <CardMedia
              component="img"
              height="200"
              image={vehicleData.image || vehicleData.imageUrl}
              alt={vehicleData.name}
              sx={{ objectFit: 'cover' }}
            />
            <CardContent>
              <Typography variant="h6" sx={{ color: 'white', mb: 1, fontWeight: 'bold' }}>
                {vehicleData.name}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <Chip 
                  label={vehicleData.licensePlate || vehicleData.make} 
                  size="small" 
                  sx={{ bgcolor: '#ff0000', color: 'white' }}
                />
                <Chip 
                  label={vehicleData.stationName || 'Station'} 
                  size="small" 
                  sx={{ bgcolor: '#333', color: '#ccc' }}
                />
              </Box>
              <Typography variant="body2" sx={{ color: '#ccc' }}>
                {vehicleData.make} {vehicleData.model} - {vehicleData.year}
              </Typography>
            </CardContent>
          </Card>
        </Paper>

        {/* Package Selection */}
        <Paper sx={{ 
          flex: 1, 
          p: 3, 
          bgcolor: '#111111', 
          border: '1px solid #333',
          borderRadius: 2
        }}>
          <Typography variant="h6" sx={{ color: '#ff0000', mb: 3, fontWeight: 'bold' }}>
            Chọn gói thuê
          </Typography>

          {loading && rentalPackages.length === 0 ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress sx={{ color: '#ff0000' }} />
            </Box>
          ) : (
            <FormControl component="fieldset" fullWidth>
              <RadioGroup
                value={selectedPackage?.packageId || selectedPackage?.id || ''}
                sx={{ gap: 2 }}
              >
                {rentalPackages.map((pkg) => (
                  <Paper
                    key={pkg.packageId || pkg.id}
                    sx={{
                      p: 2,
                      bgcolor: (selectedPackage?.packageId || selectedPackage?.id) === (pkg.packageId || pkg.id) ? '#ff0000' : '#222',
                      border: (selectedPackage?.packageId || selectedPackage?.id) === (pkg.packageId || pkg.id) ? '2px solid #ff0000' : '1px solid #444',
                      borderRadius: 2,
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        borderColor: '#ff0000',
                        bgcolor: (selectedPackage?.packageId || selectedPackage?.id) === (pkg.packageId || pkg.id) ? '#ff0000' : '#333'
                      }
                    }}
                    onClick={() => setSelectedPackage(pkg)}
                  >
                    <FormControlLabel
                      value={pkg.packageId || pkg.id}
                      control={
                        <Radio 
                          sx={{ 
                            color: 'white',
                            '&.Mui-checked': {
                              color: 'white',
                            },
                            '& .MuiSvgIcon-root': {
                              fontSize: 24,
                            }
                          }} 
                        />
                      }
                      label={
                        <Box sx={{ width: '100%' }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                            <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }}>
                              {pkg.name}
                            </Typography>
                            <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }}>
                              {formatPrice(pkg.price)}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <AccessTime sx={{ color: '#ccc', fontSize: 16 }} />
                              <Typography variant="body2" sx={{ color: '#ccc' }}>
                                {formatDuration(pkg.duration)}
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <LocalShipping sx={{ color: '#ccc', fontSize: 16 }} />
                              <Typography variant="body2" sx={{ color: '#ccc' }}>
                                {pkg.description || 'Gói thuê tiêu chuẩn'}
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                      }
                      sx={{ width: '100%', margin: 0 }}
                    />
                  </Paper>
                ))}
              </RadioGroup>
            </FormControl>
          )}

          {selectedPackage && (
            <Box sx={{ mt: 3, p: 2, bgcolor: '#222', borderRadius: 2, border: '1px solid #444' }}>
              <Typography variant="h6" sx={{ color: '#ff0000', mb: 2, fontWeight: 'bold' }}>
                Tổng thanh toán
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body1" sx={{ color: '#ccc' }}>
                  {selectedPackage.name}
                </Typography>
                <Typography variant="body1" sx={{ color: 'white' }}>
                  {formatPrice(selectedPackage.price)}
                </Typography>
              </Box>
              <Divider sx={{ bgcolor: '#444', my: 1 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }}>
                  Tổng cộng
                </Typography>
                <Typography variant="h6" sx={{ color: '#ff0000', fontWeight: 'bold' }}>
                  {formatPrice(selectedPackage.price)}
                </Typography>
              </Box>
            </Box>
          )}

          {error && (
            <Alert severity="error" sx={{ mt: 2, bgcolor: 'rgba(244,67,54,0.1)', color: '#f44336' }}>
              {error}
            </Alert>
          )}

          <Button
            fullWidth
            variant="contained"
            size="large"
            onClick={handleConfirmAndPay}
            disabled={!selectedPackage || loading}
            startIcon={loading ? <CircularProgress size={20} sx={{ color: 'white' }} /> : <CheckCircle />}
            sx={{
              mt: 3,
              py: 2,
              bgcolor: '#ff0000',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '1.1rem',
              '&:hover': { bgcolor: '#cc0000' },
              '&:disabled': { bgcolor: '#666' }
            }}
          >
            {loading ? 'Đang xử lý...' : 'Xác nhận & Thanh toán'}
          </Button>
          
        </Paper>
      </Box>
    </Container>
  );
};

export default CheckoutPage;
