import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Button, 
  Alert, 
  CircularProgress,
  Card,
  CardContent,
  Divider
} from '@mui/material';
import { CheckCircle, DirectionsCar, AccessTime, LocationOn } from '@mui/icons-material';
import { getAllStations } from '../api.jsx';

export default function ReturnConfirmation({ 
  rental, 
  onConfirm, 
  onCancel, 
  loading = false,
  scannedData = null
}) {
  const [confirmed, setConfirmed] = useState(false);
  const [stations, setStations] = useState([]);
  const [loadingStations, setLoadingStations] = useState(false);

  const handleConfirm = () => {
    setConfirmed(true);
    onConfirm();
  };

  const formatTime = (time) => {
    return new Date(time).toLocaleString('vi-VN');
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const calculateUsageTime = () => {
    if (!rental.startTime) return 'N/A';
    
    const start = new Date(rental.startTime);
    const now = new Date();
    const diffMs = now - start;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${diffHours}h ${diffMinutes}m`;
  };

  // Load stations from API
  useEffect(() => {
    const loadStations = async () => {
      try {
        setLoadingStations(true);
        const stationsData = await getAllStations();
        setStations(Array.isArray(stationsData) ? stationsData : []);
      } catch (error) {
        console.error('Failed to load stations:', error);
        setStations([]);
      } finally {
        setLoadingStations(false);
      }
    };

    loadStations();
  }, []);

  const getStationName = (scannedData) => {
    if (!scannedData) return 'N/A';
    
    const stationId = scannedData.replace('STATION_', '');
    
    // Find station from API data
    const station = stations.find(s => 
      String(s.id) === String(stationId)
    );
    
    if (station) {
      return station.name || `Trạm ${stationId}`;
    }
    
    // Fallback if station not found
    return `Trạm ${stationId}`;
  };

  return (
    <Box sx={{ p: 2 }}>
      <Paper sx={{ 
        p: 3, 
        bgcolor: '#111', 
        border: '1px solid #333', 
        borderRadius: 2 
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <CheckCircle sx={{ color: '#4caf50', mr: 1, fontSize: 28 }} />
          <Typography variant="h5" sx={{ color: 'white', fontWeight: 'bold' }}>
            Xác nhận trả xe
          </Typography>
        </Box>

        {/* Vehicle Info */}
        <Card sx={{ bgcolor: '#222', border: '1px solid #444', mb: 3 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <DirectionsCar sx={{ color: '#ff0000', mr: 1 }} />
              <Typography variant="h6" sx={{ color: 'white' }}>
                {rental.vehicle?.name || rental.vehicle?.code}
              </Typography>
            </Box>
            
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              <Box>
                <Typography variant="body2" sx={{ color: '#aaa' }}>
                  Biển số
                </Typography>
                <Typography variant="body1" sx={{ color: 'white' }}>
                  {rental.vehicle?.licensePlate || 'N/A'}
                </Typography>
              </Box>
              
              <Box>
                <Typography variant="body2" sx={{ color: '#aaa' }}>
                  Trạm trả
                </Typography>
                <Typography variant="body1" sx={{ color: 'white' }}>
                  {loadingStations ? 'Đang tải...' : (scannedData ? getStationName(scannedData) : 'N/A')}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Usage Summary */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ color: '#ff0000', mb: 2 }}>
            Tóm tắt sử dụng
          </Typography>
          
          <Box sx={{ display: 'grid', gap: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" sx={{ color: '#aaa' }}>
                Thời gian bắt đầu
              </Typography>
              <Typography variant="body1" sx={{ color: 'white' }}>
                {rental.startTime ? formatTime(rental.startTime) : 'N/A'}
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" sx={{ color: '#aaa' }}>
                Thời gian sử dụng
              </Typography>
              <Typography variant="body1" sx={{ color: 'white' }}>
                {calculateUsageTime()}
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" sx={{ color: '#aaa' }}>
                Gói thuê
              </Typography>
              <Typography variant="body1" sx={{ color: 'white' }}>
                {rental.rentalPackage?.name || 'N/A'}
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" sx={{ color: '#aaa' }}>
                Tổng phí
              </Typography>
              <Typography variant="body1" sx={{ color: '#ff0000', fontWeight: 'bold' }}>
                {formatPrice(rental.totalCost || 0)}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Divider sx={{ bgcolor: '#333', my: 2 }} />

        {/* Confirmation Message */}
        <Alert 
          severity="info" 
          sx={{ 
            mb: 3, 
            bgcolor: 'rgba(33,150,243,0.1)', 
            color: '#2196f3' 
          }}
        >
          Bạn có chắc chắn muốn trả xe này không? 
          Thời gian thuê sẽ kết thúc và tính phí.
        </Alert>

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            fullWidth
            variant="contained"
            onClick={handleConfirm}
            disabled={loading || confirmed}
            startIcon={loading ? <CircularProgress size={20} sx={{ color: 'white' }} /> : <CheckCircle />}
            sx={{
              bgcolor: '#ff0000',
              color: 'white',
              fontWeight: 'bold',
              py: 1.5,
              '&:hover': { bgcolor: '#cc0000' },
              '&:disabled': { bgcolor: '#666' }
            }}
          >
            {loading ? 'Đang xử lý...' : confirmed ? 'Đã xác nhận' : 'Xác nhận trả xe'}
          </Button>
          
          <Button
            fullWidth
            variant="outlined"
            onClick={onCancel}
            disabled={loading}
            sx={{
              borderColor: '#666',
              color: '#666',
              py: 1.5,
              '&:hover': { 
                borderColor: '#ff0000', 
                color: '#ff0000' 
              }
            }}
          >
            Hủy
          </Button>
        </Box>

        {/* Success Message */}
        {confirmed && !loading && (
          <Alert 
            severity="success" 
            sx={{ 
              mt: 2, 
              bgcolor: 'rgba(76,175,80,0.1)', 
              color: '#4caf50' 
            }}
          >
            Trả xe thành công! Cảm ơn bạn đã sử dụng dịch vụ.
          </Alert>
        )}
      </Paper>
    </Box>
  );
}
