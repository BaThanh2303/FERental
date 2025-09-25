import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Alert,
  Divider
} from '@mui/material';
import {
  Warning,
  CheckCircle,
  Cancel
} from '@mui/icons-material';

export default function ReturnConfirmDialog({ 
  open, 
  onClose, 
  onConfirm, 
  loading = false,
  rental = null 
}) {
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
    if (!rental?.startTime) return 'N/A';
    
    const start = new Date(rental.startTime);
    const now = new Date();
    const diffMs = now - start;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${diffHours}h ${diffMinutes}m`;
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: '#111',
          border: '1px solid #333',
          borderRadius: 2
        }
      }}
    >
      <DialogTitle sx={{ 
        bgcolor: '#222', 
        borderBottom: '1px solid #333',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        gap: 1
      }}>
        <Warning sx={{ color: '#ff9800', fontSize: 28 }} />
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          Xác nhận trả xe
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ p: 3, bgcolor: '#111' }}>
        {/* Warning Alert */}
        <Alert 
          severity="warning" 
          sx={{ 
            mb: 3, 
            bgcolor: 'rgba(255,152,0,0.1)', 
            color: '#ff9800',
            border: '1px solid rgba(255,152,0,0.3)',
            '& .MuiAlert-icon': {
              color: '#ff9800'
            }
          }}
        >
          <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
            Bạn có chắc chắn muốn trả xe này không?
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            Thời gian thuê sẽ kết thúc và tính phí. Hành động này không thể hoàn tác.
          </Typography>
        </Alert>

        {/* Rental Info */}
        {rental && (
          <Box sx={{ 
            p: 2, 
            bgcolor: '#222', 
            borderRadius: 1, 
            border: '1px solid #444',
            mb: 2
          }}>
            <Typography variant="h6" sx={{ color: '#ff0000', mb: 2, fontWeight: 'bold' }}>
              Thông tin thuê xe
            </Typography>
            
            <Box sx={{ display: 'grid', gap: 1.5 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" sx={{ color: '#aaa' }}>
                  Xe:
                </Typography>
                <Typography variant="body1" sx={{ color: 'white', fontWeight: 'bold' }}>
                  {rental.vehicle?.name || rental.vehicle?.code || 'N/A'}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" sx={{ color: '#aaa' }}>
                  Biển số:
                </Typography>
                <Typography variant="body1" sx={{ color: 'white' }}>
                  {rental.vehicle?.licensePlate || 'N/A'}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" sx={{ color: '#aaa' }}>
                  Thời gian bắt đầu:
                </Typography>
                <Typography variant="body1" sx={{ color: 'white' }}>
                  {rental.startTime ? formatTime(rental.startTime) : 'N/A'}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" sx={{ color: '#aaa' }}>
                  Thời gian sử dụng:
                </Typography>
                <Typography variant="body1" sx={{ color: '#4caf50', fontWeight: 'bold' }}>
                  {calculateUsageTime()}
                </Typography>
              </Box>
              
              <Divider sx={{ bgcolor: '#333', my: 1 }} />
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" sx={{ color: '#aaa' }}>
                  Gói thuê:
                </Typography>
                <Typography variant="body1" sx={{ color: 'white' }}>
                  {rental.rentalPackage?.name || 'N/A'}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" sx={{ color: '#aaa' }}>
                  Tổng phí:
                </Typography>
                <Typography variant="body1" sx={{ color: '#ff0000', fontWeight: 'bold' }}>
                  {formatPrice(rental.totalCost || 0)}
                </Typography>
              </Box>
            </Box>
          </Box>
        )}

        {/* Additional Info */}
        <Box sx={{ 
          p: 2, 
          bgcolor: 'rgba(33,150,243,0.1)', 
          borderRadius: 1, 
          border: '1px solid rgba(33,150,243,0.3)'
        }}>
          <Typography variant="body2" sx={{ color: '#2196f3', textAlign: 'center' }}>
            <strong>Lưu ý:</strong> Sau khi xác nhận, xe sẽ được trả về trạm và thời gian thuê sẽ kết thúc.
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions sx={{ 
        p: 3, 
        bgcolor: '#222', 
        borderTop: '1px solid #333',
        gap: 2
      }}>
        <Button
          variant="outlined"
          onClick={onClose}
          disabled={loading}
          startIcon={<Cancel />}
          sx={{
            borderColor: '#666',
            color: '#666',
            px: 3,
            py: 1,
            '&:hover': { 
              borderColor: '#ff0000', 
              color: '#ff0000',
              bgcolor: 'rgba(255,0,0,0.1)'
            },
            '&:disabled': {
              borderColor: '#444',
              color: '#444'
            }
          }}
        >
          Hủy
        </Button>
        
        <Button
          variant="contained"
          onClick={onConfirm}
          disabled={loading}
          startIcon={loading ? null : <CheckCircle />}
          sx={{
            bgcolor: '#ff0000',
            color: 'white',
            fontWeight: 'bold',
            px: 3,
            py: 1,
            '&:hover': { bgcolor: '#cc0000' },
            '&:disabled': { bgcolor: '#666' }
          }}
        >
          {loading ? 'Đang xử lý...' : 'Xác nhận trả xe'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
