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
  Done,
  QrCodeScanner
} from '@mui/icons-material';
import { useRental } from '../context/RentalContext';
import { getRentalDetails, pickupVehicle, returnVehicle } from '../api.jsx';
import QRScannerV2 from '../components/QRScannerV2.jsx';
import PickupConfirmation from '../components/PickupConfirmation.jsx';
import ReturnConfirmDialog from '../components/ReturnConfirmDialog.jsx';
import RentalStatusTracker from '../components/RentalStatusTracker.jsx';

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
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [showPickupConfirmation, setShowPickupConfirmation] = useState(false);
  const [showReturnConfirmDialog, setShowReturnConfirmDialog] = useState(false);
  const [scannedData, setScannedData] = useState(null);

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


  // QR Code handlers
  const handleScanQR = () => {
    setShowQRScanner(true);
  };

  const handleQRScan = (data) => {
    setScannedData(data);
    setShowQRScanner(false);
    
    console.log('QR Scan data:', data, 'Rental status:', rentalData.status);
    console.log('Rental data:', rentalData);
    
    // Validate QR code type based on rental status
    if (rentalData.status === 'PAID') {
      // Check if it's a vehicle QR for pickup
      if (data.startsWith('VEHICLE_') || (data.startsWith('{') && data.includes('vehicle_pickup'))) {
        // Validate if the scanned vehicle matches the rented vehicle
        const scannedVehicleId = data.replace('VEHICLE_', '');
        const rentedVehicleId = rentalData.vehicle?.id || rentalData.vehicle?.vehicleId;
        
        console.log('Scanned vehicle ID:', scannedVehicleId);
        console.log('Rented vehicle ID:', rentedVehicleId);
        
        if (scannedVehicleId === String(rentedVehicleId)) {
          setScannedData(data);
          setShowPickupConfirmation(true);
        } else {
          alert(`❌ SAI XE!\n\nBạn đã đặt xe: ${rentalData.vehicle?.name || rentalData.vehicle?.code} (ID: ${rentedVehicleId})\nĐang quét xe: VEHICLE_${scannedVehicleId}\n\nVui lòng quét QR code đúng xe hoặc upload lại ảnh QR.`);
        }
      } else {
        alert('Vui lòng quét QR code trên xe để lấy xe');
      }
    } else if (rentalData.status === 'ACTIVE') {
      // Check if it's a station QR for return
      if (data.startsWith('STATION_') || (data.startsWith('{') && data.includes('vehicle_return'))) {
        // Extract station ID from QR code
        const scannedStationId = data.replace('STATION_', '');
        
        console.log('Scanned station ID for return:', scannedStationId);
        console.log('Vehicle will be returned to station:', scannedStationId);
        
        // Allow return to any station - store the scanned station ID
        setScannedData(data); // Store the full QR data including station ID
        setShowReturnConfirmDialog(true); // Show confirmation dialog first
      } else {
        alert('Vui lòng quét QR code tại trạm để trả xe');
      }
    } else {
      // For other statuses, allow any QR code for demo
      console.log('Allowing QR scan for status:', rentalData.status);
      if (data.startsWith('VEHICLE_') || data.startsWith('STATION_')) {
        if (rentalData.status === 'PAID') {
          // Also validate vehicle for demo mode
          const scannedVehicleId = data.replace('VEHICLE_', '');
          const rentedVehicleId = rentalData.vehicle?.id || rentalData.vehicle?.vehicleId;
          
          if (scannedVehicleId === String(rentedVehicleId)) {
            setScannedData(data);
            setShowPickupConfirmation(true);
          } else {
            alert(`❌ SAI XE!\n\nBạn đã đặt xe: ${rentalData.vehicle?.name || rentalData.vehicle?.code} (ID: ${rentedVehicleId})\nĐang quét xe: VEHICLE_${scannedVehicleId}\n\nVui lòng quét QR code đúng xe hoặc upload lại ảnh QR.`);
          }
        } else {
          setShowReturnConfirmDialog(true);
        }
      }
    }
  };

  const handlePickupConfirm = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get rental ID (could be id or rentalId)
      const rentalId = rentalData.id || rentalData.rentalId || id;
      const vehicleId = rentalData.vehicle?.id || rentalData.vehicle?.vehicleId;
      
      console.log('Pickup data:', { rentalId, vehicleId, rentalData });
      console.log('Current rental status:', rentalData.status);
      console.log('Scanned QR data:', scannedData);
      console.log('Rental ID type:', typeof rentalId);
      console.log('Vehicle ID type:', typeof vehicleId);
      
      if (!rentalId) {
        throw new Error('Không tìm thấy ID thuê xe');
      }
      
      if (!vehicleId) {
        throw new Error('Không tìm thấy ID xe');
      }

      // Validate rental status
      if (rentalData.status !== 'PAID') {
        throw new Error(`Không thể lấy xe. Trạng thái hiện tại: ${rentalData.status}. Cần trạng thái PAID.`);
      }
      
      const pickupData = {
        qrData: scannedData,
        vehicleId: vehicleId, // Add vehicleId to request body
        latitude: 0, // Get from geolocation
        longitude: 0
      };
      
      console.log('Sending pickup data:', pickupData);
      
      const result = await pickupVehicle(rentalId, vehicleId, pickupData);
      console.log('Pickup result:', result);
      
      setRentalData(result.rental);
      setCurrentRental(result.rental);
      setShowPickupConfirmation(false);
      
    } catch (error) {
      console.error('Pickup error details:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle confirmation from dialog - directly execute return
  const handleReturnDialogConfirm = async () => {
    setShowReturnConfirmDialog(false);
    await handleReturnConfirm(); // Directly execute return
  };

  const handleReturnDialogCancel = () => {
    setShowReturnConfirmDialog(false);
    setScannedData(null); // Clear scanned data
  };

  const handleReturnConfirm = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get rental ID (could be id or rentalId)
      const rentalId = rentalData.id || rentalData.rentalId || id;
      
      // Get station ID from scanned QR code instead of rental data
      const scannedStationId = scannedData ? scannedData.replace('STATION_', '') : null;
      
      console.log('Return data:', { 
        rentalId, 
        scannedStationId, 
        scannedData, 
        rentalData 
      });
      
      if (!rentalId) {
        throw new Error('Không tìm thấy ID thuê xe');
      }
      
      if (!scannedStationId) {
        throw new Error('Không tìm thấy ID trạm từ QR code');
      }
      
      const returnData = {
        stationId: parseInt(scannedStationId), // Use station ID from QR code
        qrData: scannedData,
        latitude: 0, // Get from geolocation
        longitude: 0
      };
      
      const result = await returnVehicle(rentalId, returnData);
      setRentalData(result.rental);
      setCurrentRental(result.rental);
      
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

  const formatDateTime = (dateTimeString, status = null) => {
    if (!dateTimeString) {
      // Hiển thị thông báo phù hợp theo status
      if (status === 'PAID') {
        return 'Chưa bắt đầu (chờ quét QR lấy xe)';
      } else if (status === 'ACTIVE') {
        return 'Đang sử dụng';
      } else {
        return 'Chưa xác định';
      }
    }
    return new Date(dateTimeString).toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Tính thời gian kết thúc dựa theo gói thuê
  const calculateEndTime = () => {
    if (!rentalData.startTime || !rentalData.rentalPackage?.duration) {
      return null;
    }
    
    const startTime = new Date(rentalData.startTime);
    const durationHours = rentalData.rentalPackage.duration;
    const endTime = new Date(startTime.getTime() + (durationHours * 60 * 60 * 1000));
    
    return endTime.toLocaleString('vi-VN', {
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
              Mã đặt xe: #{rentalData.rentalId}
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

      {/* Rental Status Tracker */}
      <RentalStatusTracker 
        rental={rentalData}
        onScanQR={handleScanQR}
      />

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
                  secondary={
                    rentalData.status === 'PAID' && !rentalData.startTime 
                      ? 'Chưa bắt đầu (chờ quét QR lấy xe)' 
                      : formatDateTime(rentalData.startTime, rentalData.status)
                  }
                  primaryTypographyProps={{ color: 'white', fontWeight: 'bold' }}
                  secondaryTypographyProps={{ 
                    color: rentalData.status === 'PAID' && !rentalData.startTime ? '#ff9800' : '#ccc' 
                  }}
                />
              </ListItem>
              
              <ListItem>
                <ListItemIcon>
                  <Schedule sx={{ color: '#ff0000' }} />
                </ListItemIcon>
                <ListItemText
                  primary="Thời gian kết thúc"
                  secondary={
                    rentalData.status === 'ACTIVE' && !rentalData.endTime 
                      ? calculateEndTime() || 'Chưa kết thúc (đang sử dụng)'
                      : formatDateTime(rentalData.endTime, rentalData.status)
                  }
                  primaryTypographyProps={{ color: 'white', fontWeight: 'bold' }}
                  secondaryTypographyProps={{ 
                    color: rentalData.status === 'ACTIVE' && !rentalData.endTime ? '#2196f3' : '#ccc' 
                  }}
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

            {/* Thông tin thời gian dự kiến cho status PAID */}
            {rentalData.status === 'PAID' && rentalData.rentalPackage && (
              <Box sx={{ mt: 2, p: 2, bgcolor: '#222', borderRadius: 1, border: '1px solid #444' }}>
                <Typography variant="body2" sx={{ color: '#ff9800', fontWeight: 'bold', mb: 1 }}>
                  ⏰ Thời gian sử dụng dự kiến: {rentalData.rentalPackage.duration} giờ
                </Typography>
                <Typography variant="body2" sx={{ color: '#aaa' }}>
                  Thời gian sẽ bắt đầu tính từ khi bạn quét QR lấy xe tại trạm
                </Typography>
              </Box>
            )}
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

      {/* QR Scanner Modal */}
      {showQRScanner && (
        <QRScannerV2
          onScan={handleQRScan}
          onClose={() => setShowQRScanner(false)}
          title={rentalData.status === 'PAID' ? 'Quét QR để lấy xe' : 'Quét QR để trả xe'}
        />
      )}

      {/* Pickup Confirmation Modal */}
      {showPickupConfirmation && (
        <PickupConfirmation
          rental={rentalData}
          onConfirm={handlePickupConfirm}
          onCancel={() => setShowPickupConfirmation(false)}
          loading={loading}
        />
      )}

      {/* Return Confirmation Dialog */}
      <ReturnConfirmDialog
        open={showReturnConfirmDialog}
        onClose={handleReturnDialogCancel}
        onConfirm={handleReturnDialogConfirm}
        loading={loading}
        rental={rentalData}
      />


    </Container>
  );
};

export default RentalDetailPage;
