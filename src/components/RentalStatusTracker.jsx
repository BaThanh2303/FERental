import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  LinearProgress, 
  Chip,
  Alert,
  Button
} from '@mui/material';
import { 
  CheckCircle, 
  AccessTime, 
  DirectionsCar, 
  Warning,
  QrCodeScanner
} from '@mui/icons-material';

export default function RentalStatusTracker({ 
  rental, 
  onScanQR 
}) {
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // CHỈ tính thời gian khi status là ACTIVE và có startTime
    // Override: Không tính thời gian nếu status là PAID (dù backend có set startTime)
    if (!rental || rental.status !== 'ACTIVE' || !rental.startTime || !rental.rentalPackage) {
      setTimeRemaining(null);
      setProgress(0);
      return;
    }

    // Kiểm tra thêm: Nếu status là PAID thì không tính thời gian (dù có startTime)
    if (rental.status === 'PAID') {
      setTimeRemaining(null);
      setProgress(0);
      return;
    }

    const updateTimer = () => {
      const startTime = new Date(rental.startTime);
      const now = new Date();
      const duration = rental.rentalPackage.duration * 60 * 60 * 1000; // Convert hours to ms
      const elapsed = now - startTime;
      const remaining = duration - elapsed;

      if (remaining > 0) {
        setTimeRemaining(remaining);
        setProgress((elapsed / duration) * 100);
      } else {
        setTimeRemaining(0);
        setProgress(100);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [rental]);

  const formatTime = (ms) => {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((ms % (1000 * 60)) / 1000);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${seconds}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    } else {
      return `${seconds}s`;
    }
  };

  const getStatusInfo = () => {
    switch (rental.status) {
      case 'PENDING':
        return {
          color: '#ff9800',
          icon: <AccessTime />,
          text: 'Chờ thanh toán',
          description: 'Vui lòng thanh toán để tiếp tục'
        };
      case 'PAID':
        return {
          color: '#ff9800',
          icon: <QrCodeScanner />,
          text: 'CHỜ SỬ DỤNG',
          description: 'Thanh toán thành công! Đến trạm và quét QR trên xe để bắt đầu sử dụng'
        };
      case 'ACTIVE':
        return {
          color: '#2196f3',
          icon: <DirectionsCar />,
          text: 'ĐANG SỬ DỤNG',
          description: 'Bạn đang sử dụng xe. Thời gian đã bắt đầu tính từ khi quét QR lấy xe.'
        };
      case 'COMPLETED':
        return {
          color: '#9e9e9e',
          icon: <CheckCircle />,
          text: 'Hoàn thành',
          description: 'Đã trả xe thành công'
        };
      default:
        return {
          color: '#666',
          icon: <AccessTime />,
          text: rental.status,
          description: 'Trạng thái không xác định'
        };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <Paper sx={{ 
      p: 3, 
      bgcolor: '#111', 
      border: '1px solid #333', 
      borderRadius: 2,
      mb: 2
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Box sx={{ color: statusInfo.color, mr: 1 }}>
          {statusInfo.icon}
        </Box>
        <Typography variant="h6" sx={{ color: 'white', flex: 1 }}>
          Trạng thái thuê xe
        </Typography>
        <Chip 
          label={statusInfo.text}
          sx={{ 
            bgcolor: statusInfo.color, 
            color: 'white',
            fontWeight: 'bold'
          }}
        />
      </Box>

      <Typography variant="body2" sx={{ color: '#aaa', mb: 3 }}>
        {statusInfo.description}
      </Typography>

      {/* Thông tin thời gian cho status PAID */}
      {rental.status === 'PAID' && rental.rentalPackage && (
        <Box sx={{ mb: 3, p: 2, bgcolor: '#222', borderRadius: 1, border: '1px solid #444' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <QrCodeScanner sx={{ color: '#ff9800' }} />
            <Typography variant="body2" sx={{ color: '#ff9800', fontWeight: 'bold' }}>
              Quét QR trên xe để bắt đầu
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ color: '#4caf50', fontWeight: 'bold', mb: 1 }}>
            ⏰ Thời gian sử dụng: {rental.rentalPackage.duration} giờ
          </Typography>
          <Typography variant="body2" sx={{ color: '#aaa', mb: 1 }}>
            Thời gian sẽ bắt đầu tính từ khi bạn quét QR lấy xe
          </Typography>
          <Typography variant="body2" sx={{ color: '#ff0000', fontWeight: 'bold', mb: 1 }}>
            🚗 Xe đã đặt: {rental.vehicle?.name || rental.vehicle?.code} 
          </Typography>
          <Typography variant="body2" sx={{ color: '#ff9800', fontWeight: 'bold' }}>
            ⚠️ Vui lòng quét QR code trên xe đúng để tránh nhầm lẫn!
          </Typography>
          {rental.startTime && (
            <Alert severity="info" sx={{ bgcolor: 'rgba(33,150,243,0.1)', color: '#2196f3' }}>
              <Typography variant="body2">
                <strong>Lưu ý:</strong> Thời gian chưa bắt đầu tính. Chỉ khi quét QR lấy xe mới bắt đầu tính thời gian sử dụng.
              </Typography>
            </Alert>
          )}
        </Box>
      )}

      {/* Thông tin cho status ACTIVE */}
      {rental.status === 'ACTIVE' && rental.rentalPackage && (
        <Box sx={{ mb: 3, p: 2, bgcolor: '#222', borderRadius: 1, border: '1px solid #444' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <DirectionsCar sx={{ color: '#2196f3' }} />
            <Typography variant="body2" sx={{ color: '#2196f3', fontWeight: 'bold' }}>
              Đang sử dụng xe
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ color: '#aaa', mb: 1 }}>
            Thời gian đã bắt đầu tính từ khi quét QR lấy xe
          </Typography>
          {rental.startTime && (
            <Typography variant="body2" sx={{ color: '#ff9800', fontWeight: 'bold' }}>
              ⏰ Kết thúc dự kiến: {(() => {
                const startTime = new Date(rental.startTime);
                const durationHours = rental.rentalPackage.duration;
                const endTime = new Date(startTime.getTime() + (durationHours * 60 * 60 * 1000));
                return endTime.toLocaleString('vi-VN', {
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit'
                });
              })()}
            </Typography>
          )}
        </Box>
      )}

      {/* Progress Bar for Active Rental */}
      {rental.status === 'ACTIVE' && timeRemaining !== null && (
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" sx={{ color: '#aaa' }}>
              Thời gian còn lại
            </Typography>
            <Typography variant="body2" sx={{ color: timeRemaining < 30 * 60 * 1000 ? '#ff0000' : 'white' }}>
              {formatTime(timeRemaining)}
            </Typography>
          </Box>
          
          <LinearProgress 
            variant="determinate" 
            value={progress} 
            sx={{
              height: 8,
              borderRadius: 4,
              bgcolor: '#333',
              '& .MuiLinearProgress-bar': {
                bgcolor: progress > 90 ? '#ff0000' : progress > 70 ? '#ff9800' : '#4caf50'
              }
            }}
          />
          
          {timeRemaining < 30 * 60 * 1000 && timeRemaining > 0 && (
            <Alert 
              severity="warning" 
              sx={{ 
                mt: 2, 
                bgcolor: 'rgba(255,152,0,0.1)', 
                color: '#ff9800' 
              }}
            >
              Sắp hết thời gian! Vui lòng chuẩn bị trả xe.
            </Alert>
          )}
          
          {timeRemaining <= 0 && (
            <Alert 
              severity="error" 
              sx={{ 
                mt: 2, 
                bgcolor: 'rgba(244,67,54,0.1)', 
                color: '#f44336' 
              }}
            >
              Đã hết thời gian thuê! Vui lòng trả xe ngay.
            </Alert>
          )}
        </Box>
      )}

      {/* Action Buttons */}
      {rental.status === 'PAID' && (
        <Button
          fullWidth
          variant="contained"
          onClick={onScanQR}
          startIcon={<QrCodeScanner />}
          sx={{
            bgcolor: '#ff9800',
            color: 'white',
            fontWeight: 'bold',
            py: 1.5,
            '&:hover': { bgcolor: '#f57c00' }
          }}
        >
          Quét QR trên xe để bắt đầu sử dụng
        </Button>
      )}

      {rental.status === 'ACTIVE' && (
        <Box>
          {/* Return Info */}
          <Box sx={{ mb: 2, p: 2, bgcolor: '#222', borderRadius: 1, border: '1px solid #444' }}>
            <Typography variant="body2" sx={{ color: '#2196f3', fontWeight: 'bold', mb: 1 }}>
              📍 Trả xe
            </Typography>
            <Typography variant="body2" sx={{ color: '#4caf50', fontWeight: 'bold' }}>
              ✅ Quét QR code tại trạm để trả xe
            </Typography>
            <Typography variant="body2" sx={{ color: '#aaa', fontSize: '0.8rem', mt: 1 }}>
              Xe sẽ được lưu vào trạm tương ứng với QR code bạn quét
            </Typography>
          </Box>
          
          <Button
            fullWidth
            variant="contained"
            onClick={onScanQR}
            startIcon={<QrCodeScanner />}
            sx={{
              bgcolor: '#2196f3',
              color: 'white',
              fontWeight: 'bold',
              py: 1.5,
              '&:hover': { bgcolor: '#1976d2' }
            }}
          >
            Quét QR tại trạm để trả xe
          </Button>
        </Box>
      )}
    </Paper>
  );
}
