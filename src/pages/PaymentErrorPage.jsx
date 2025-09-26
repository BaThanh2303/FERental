import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Alert,
  Card,
  CardContent,
  Chip
} from '@mui/material';
import {
  Error,
  Refresh,
  Home,
  Payment,
  ArrowBack
} from '@mui/icons-material';
import { getRentalDetails } from '../api.jsx';

const PaymentErrorPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [rentalData, setRentalData] = useState(null);
  const [loading, setLoading] = useState(true);

  const rentalId = searchParams.get('rentalId');
  const vnpResponseCode = searchParams.get('vnp_ResponseCode');
  const vnpTxnRef = searchParams.get('vnp_TxnRef');
  const errorMessage = searchParams.get('message') || 'Giao dịch không thể hoàn tất';

  useEffect(() => {
    const loadRentalData = async () => {
      try {
        if (rentalId) {
          const rental = await getRentalDetails(rentalId);
          setRentalData(rental);
        }
      } catch (error) {
        console.error('Error loading rental data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadRentalData();
  }, [rentalId]);

  const handleRetryPayment = () => {
    if (rentalId) {
      navigate(`/payment/${rentalId}`);
    } else {
      navigate('/');
    }
  };

  const handleGoHome = () => {
    navigate('/');
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const getErrorDetails = () => {
    switch (vnpResponseCode) {
      case '07':
        return {
          title: 'Giao dịch bị nghi ngờ gian lận',
          description: 'Giao dịch của bạn đã bị từ chối do nghi ngờ gian lận. Vui lòng liên hệ ngân hàng.'
        };
      case '09':
        return {
          title: 'Giao dịch bị từ chối',
          description: 'Giao dịch của bạn đã bị từ chối. Vui lòng kiểm tra lại thông tin thẻ.'
        };
      case '10':
        return {
          title: 'Xác thực thông tin thất bại',
          description: 'Không thể xác thực thông tin thẻ. Vui lòng kiểm tra lại thông tin.'
        };
      case '11':
        return {
          title: 'Giao dịch đã được xử lý',
          description: 'Giao dịch này đã được xử lý trước đó. Vui lòng kiểm tra lại.'
        };
      case '12':
        return {
          title: 'Giao dịch không hợp lệ',
          description: 'Thông tin giao dịch không hợp lệ. Vui lòng thử lại.'
        };
      case '24':
        return {
          title: 'Giao dịch bị hủy',
          description: 'Giao dịch đã bị hủy. Vui lòng thử lại nếu cần.'
        };
      case '51':
        return {
          title: 'Số dư không đủ',
          description: 'Số dư tài khoản không đủ để thực hiện giao dịch.'
        };
      case '65':
        return {
          title: 'Tài khoản vượt quá hạn mức',
          description: 'Tài khoản đã vượt quá hạn mức giao dịch trong ngày.'
        };
      case '75':
        return {
          title: 'Ngân hàng đang bảo trì',
          description: 'Ngân hàng đang trong thời gian bảo trì. Vui lòng thử lại sau.'
        };
      default:
        return {
          title: 'Thanh toán thất bại',
          description: errorMessage
        };
    }
  };

  const errorDetails = getErrorDetails();

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
          <Typography variant="h6" sx={{ color: '#666' }}>
            Đang tải thông tin...
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        {/* Error Icon */}
        <Box sx={{ mb: 3 }}>
          <Error sx={{ fontSize: 80, color: '#f44336' }} />
        </Box>
        
        {/* Error Title */}
        <Typography variant="h4" sx={{ 
          fontWeight: 'bold', 
          color: '#f44336',
          mb: 2 
        }}>
          {errorDetails.title}
        </Typography>
        
        {/* Error Description */}
        <Typography variant="body1" sx={{ 
          color: '#666', 
          mb: 4,
          maxWidth: '500px',
          mx: 'auto'
        }}>
          {errorDetails.description}
        </Typography>

        {/* VNPay Error Details */}
        {(vnpTxnRef || vnpResponseCode) && (
          <Card sx={{ 
            mb: 4, 
            bgcolor: 'rgba(244, 67, 54, 0.1)',
            border: '1px solid #f4433620'
          }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, color: '#f44336' }}>
                Chi tiết lỗi VNPay
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
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" sx={{ color: '#666' }}>
                    Mã lỗi:
                  </Typography>
                  <Chip 
                    label={vnpResponseCode || 'Không xác định'}
                    color="error"
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
                    label="Chờ thanh toán"
                    color="warning"
                    size="small"
                  />
                </Box>
              </Box>
            </CardContent>
          </Card>
        )}

        {/* Help Information */}
        <Alert severity="info" sx={{ mb: 4, textAlign: 'left' }}>
          <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>
            Cần hỗ trợ?
          </Typography>
          <Typography variant="body2">
            • Kiểm tra lại thông tin thẻ và số dư tài khoản<br/>
            • Thử lại với phương thức thanh toán khác<br/>
            • Liên hệ hotline: 1900 636 047 để được hỗ trợ
          </Typography>
        </Alert>

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
          {rentalId && (
            <Button
              variant="contained"
              size="large"
              onClick={handleRetryPayment}
              startIcon={<Refresh />}
              sx={{
                bgcolor: '#0070ba',
                '&:hover': { bgcolor: '#005ea6' }
              }}
            >
              Thử lại thanh toán
            </Button>
          )}
          
          <Button
            variant="outlined"
            size="large"
            onClick={handleGoBack}
            startIcon={<ArrowBack />}
            sx={{
              borderColor: '#666',
              color: '#666',
              '&:hover': { 
                borderColor: '#333',
                bgcolor: 'rgba(0, 0, 0, 0.04)'
              }
            }}
          >
            Quay lại
          </Button>
          
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
      </Paper>
    </Container>
  );
};

export default PaymentErrorPage;
