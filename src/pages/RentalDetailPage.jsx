import React, { useState, useEffect } from 'react';
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
  Grid
} from '@mui/material';
import {
  ArrowBack,
  CheckCircle,
  AccessTime,
  LocalShipping,
  DirectionsCar,
  Schedule,
  AttachMoney,
  Warning,
  Done
} from '@mui/icons-material';
import { useRental } from '../context/RentalContext';
import { getRentalDetails, returnRentalVehicle } from '../api.jsx';

const RentalDetailPage = () => {
  const { id } = useParams();
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

  useEffect(() => {
    if (!id) {
      navigate('/');
      return;
    }

    // If we don't have rental data in context, fetch it
    if (!currentRental || (currentRental.id !== parseInt(id) && currentRental.rentalId !== parseInt(id))) {
      loadRentalDetails();
    } else {
      setRentalData(currentRental);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]); // Only depend on id, not currentRental

  const loadRentalDetails = async () => {
    try {
      setLoading(true);
      const rental = await getRentalDetails(id);
      setRentalData(rental);
      setCurrentRental(rental);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReturnVehicle = async () => {
    try {
      setLoading(true);
      setError(null);

      const returnResponse = await returnRentalVehicle(id);
      setCurrentRental(returnResponse);
      setRentalData(returnResponse);
      
      // Show success message
      alert('Trả xe thành công! Cảm ơn bạn đã sử dụng dịch vụ.');
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

  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return 'Chưa xác định';
    return new Date(dateTimeString).toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING_PAYMENT':
        return '#ff9800';
      case 'ACTIVE':
        return '#4caf50';
      case 'COMPLETED':
        return '#2196f3';
      case 'CANCELLED':
        return '#f44336';
      default:
        return '#666';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'PENDING_PAYMENT':
        return 'Chờ thanh toán';
      case 'ACTIVE':
        return 'Đang thuê';
      case 'COMPLETED':
        return 'Hoàn thành';
      case 'CANCELLED':
        return 'Đã hủy';
      default:
        return status;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'PENDING_PAYMENT':
        return <Schedule sx={{ color: getStatusColor(status) }} />;
      case 'ACTIVE':
        return <CheckCircle sx={{ color: getStatusColor(status) }} />;
      case 'COMPLETED':
        return <Done sx={{ color: getStatusColor(status) }} />;
      case 'CANCELLED':
        return <Warning sx={{ color: getStatusColor(status) }} />;
      default:
        return <Schedule sx={{ color: getStatusColor(status) }} />;
    }
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
          Không tìm thấy thông tin thuê xe
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4, bgcolor: '#000000', minHeight: '100vh' }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/rental-history')}
          sx={{ mb: 2, color: '#ff0000' }}
        >
          Quay lại
        </Button>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold' }}>
              Chi tiết thuê xe
            </Typography>
            <Typography variant="body1" sx={{ color: '#ccc', mt: 1 }}>
              Mã đặt xe: #{rentalData.id}
            </Typography>
          </Box>
          <Chip
            icon={getStatusIcon(rentalData.status)}
            label={getStatusText(rentalData.status)}
            sx={{
              bgcolor: getStatusColor(rentalData.status),
              color: 'white',
              fontWeight: 'bold',
              fontSize: '0.9rem'
            }}
          />
        </Box>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
        {/* Vehicle Information */}
        <Box sx={{ flex: 1 }}>
          <Paper sx={{ 
            p: 3, 
            bgcolor: '#111111', 
            border: '1px solid #333',
            borderRadius: 2,
            height: '100%'
          }}>
            <Typography variant="h6" sx={{ color: '#ff0000', mb: 3, fontWeight: 'bold' }}>
              Thông tin xe
            </Typography>
            
            <Card sx={{ bgcolor: '#222', border: '1px solid #444', mb: 4 }}>
              <CardMedia
                component="img"
                height="200"
                image={rentalData.vehicle?.imageUrl || '/src/assets/images/vinfast.jpg'}
                alt={rentalData.vehicle?.licensePlate}
                sx={{ objectFit: 'cover' }}
              />
              <CardContent>
                <Typography variant="h6" sx={{ color: 'white', mb: 1, fontWeight: 'bold' }}>
                  {rentalData.vehicle?.code || `${rentalData.vehicle?.make || ''} ${rentalData.vehicle?.model || ''}`.trim()}
                </Typography>
                <Typography variant="body2" sx={{ color: '#ccc', mb: 1 }}>
                  Biển số: <span style={{ color: 'white' }}>{rentalData.vehicle?.licensePlate || 'N/A'}</span>
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                  <Chip 
                    label={rentalData.vehicle?.make || 'Electric Bike'} 
                    size="small" 
                    sx={{ bgcolor: '#ff0000', color: 'white' }}
                  />
                  <Chip 
                    label={rentalData.vehicle?.station?.name || rentalData.vehicle?.stationName || 'Station'} 
                    size="small" 
                    sx={{ bgcolor: '#333', color: '#ccc' }}
                  />
                </Box>
                <Typography variant="body2" sx={{ color: '#ccc' }}>
                  {rentalData.vehicle?.make} {rentalData.vehicle?.model} - {rentalData.vehicle?.year}
                </Typography>
              </CardContent>
            </Card>
          </Paper>
        </Box>

        {/* Rental Information */}
        <Box sx={{ flex: 1 }}>
          <Paper sx={{ 
            p: 3, 
            bgcolor: '#111111', 
            border: '1px solid #333',
            borderRadius: 2,
            height: '100%'
          }}>
            <Typography variant="h6" sx={{ color: '#ff0000', mb: 3, fontWeight: 'bold' }}>
              Thông tin thuê xe
            </Typography>

            <List sx={{ bgcolor: '#222', borderRadius: 2, border: '1px solid #444' }}>
              <ListItem>
                <ListItemIcon>
                  <AccessTime sx={{ color: '#ff0000' }} />
                </ListItemIcon>
                <ListItemText
                  primary="Gói thuê"
                  secondary={rentalData.rentalPackage?.name || 'Gói thuê'}
                  primaryTypographyProps={{ color: 'white', fontWeight: 'bold' }}
                  secondaryTypographyProps={{ color: '#ccc' }}
                />
              </ListItem>
              
              <ListItem>
                <ListItemIcon>
                  <Schedule sx={{ color: '#ff0000' }} />
                </ListItemIcon>
                <ListItemText
                  primary="Thời gian bắt đầu"
                  secondary={formatDateTime(rentalData.startTime)}
                  primaryTypographyProps={{ color: 'white', fontWeight: 'bold' }}
                  secondaryTypographyProps={{ color: '#ccc' }}
                />
              </ListItem>
              
              <ListItem>
                <ListItemIcon>
                  <Schedule sx={{ color: '#ff0000' }} />
                </ListItemIcon>
                <ListItemText
                  primary="Thời gian kết thúc"
                  secondary={formatDateTime(rentalData.endTime)}
                  primaryTypographyProps={{ color: 'white', fontWeight: 'bold' }}
                  secondaryTypographyProps={{ color: '#ccc' }}
                />
              </ListItem>
              
              <ListItem>
                <ListItemIcon>
                  <AttachMoney sx={{ color: '#ff0000' }} />
                </ListItemIcon>
                <ListItemText
                  primary="Tổng chi phí"
                  secondary={formatPrice(rentalData.totalCost)}
                  primaryTypographyProps={{ color: 'white', fontWeight: 'bold' }}
                  secondaryTypographyProps={{ color: '#ccc' }}
                />
              </ListItem>
            </List>
          </Paper>
        </Box>
      </Box>

      {/* Actions */}
      <Box sx={{ mt: 8 }}>
          <Paper sx={{ 
            p: 3, 
            bgcolor: '#111111', 
            border: '1px solid #333',
            borderRadius: 2
          }}>
            <Typography variant="h6" sx={{ color: '#ff0000', mb: 3, fontWeight: 'bold' }}>
              Thao tác
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 3, bgcolor: 'rgba(244,67,54,0.1)', color: '#f44336' }}>
                {error}
              </Alert>
            )}

            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              {rentalData.status === 'ACTIVE' && (
                <Button
                  variant="contained"
                  size="large"
                  onClick={handleReturnVehicle}
                  startIcon={<DirectionsCar />}
                  sx={{
                    bgcolor: '#ff0000',
                    color: 'white',
                    fontWeight: 'bold',
                    '&:hover': { bgcolor: '#cc0000' }
                  }}
                >
                  Trả xe
                </Button>
              )}

              {rentalData.status === 'PENDING_PAYMENT' && (
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate(`/payment/${rentalData.id}`)}
                  startIcon={<AttachMoney />}
                  sx={{
                    bgcolor: '#ff0000',
                    color: 'white',
                    fontWeight: 'bold',
                    '&:hover': { bgcolor: '#cc0000' }
                  }}
                >
                  Thanh toán
                </Button>
              )}

              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate('/')}
                startIcon={<ArrowBack />}
                sx={{
                  borderColor: '#ff0000',
                  color: '#ff0000',
                  fontWeight: 'bold',
                  '&:hover': { 
                    borderColor: '#cc0000', 
                    color: '#cc0000',
                    bgcolor: 'rgba(255,0,0,0.1)'
                  }
                }}
              >
                Về trang chủ
              </Button>
            </Box>

            {rentalData.status === 'ACTIVE' && (
              <Alert severity="info" sx={{ mt: 3, bgcolor: 'rgba(33,150,243,0.1)', color: '#2196f3' }}>
                <Typography variant="body2">
                  <strong>Lưu ý:</strong> Bạn đang trong thời gian thuê xe. 
                  Vui lòng trả xe đúng thời gian để tránh phí phạt.
                </Typography>
              </Alert>
            )}

            {rentalData.status === 'COMPLETED' && (
              <Alert severity="success" sx={{ mt: 3, bgcolor: 'rgba(76,175,80,0.1)', color: '#4caf50' }}>
                <Typography variant="body2">
                  <strong>Hoàn thành:</strong> Bạn đã hoàn thành việc thuê xe. 
                  Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!
                </Typography>
              </Alert>
            )}
          </Paper>
      </Box>
    </Container>
  );
};

export default RentalDetailPage;
