import React, { useEffect } from 'react';
import { Container, Paper, Box, Typography, Button } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import CCCDUpload from '../components/CCCDUpload.jsx';
import { useUserInfo } from '../context/UserContext.jsx';
import { getUserId } from '../api.jsx';

export default function UploadCCCDPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, refreshUser } = useUserInfo();
  const userId = user?.id ?? getUserId();

  useEffect(() => {
    if (!user) {
      refreshUser().catch(() => {});
    }
  }, [user, refreshUser]);

  const onSuccess = async () => {
    await refreshUser();
    const redirectTo = location.state?.from || '/checkout';
    navigate(redirectTo, { replace: true });
  };

  return (
    <Container maxWidth="sm" sx={{ py: 4, bgcolor: '#000', minHeight: '100vh' }}>
      <Button onClick={() => navigate(-1)} sx={{ mb: 2, color: '#ff0000' }}>Quay lại</Button>
      <Paper sx={{ p: 3, bgcolor: '#111', border: '1px solid #333', borderRadius: 2 }}>
        <Typography variant="h5" sx={{ color: 'white', fontWeight: 'bold', mb: 2 }}>
          Xác thực CCCD để tiếp tục thuê xe
        </Typography>
        <Typography variant="body2" sx={{ color: '#ccc', mb: 3 }}>
          Để đảm bảo an toàn và tuân thủ quy định, bạn cần tải lên ảnh CCCD trước khi thuê xe. 
          Thông tin sẽ được bảo mật và chỉ dùng để xác thực danh tính.
        </Typography>
        <CCCDUpload userId={userId} onSuccess={onSuccess} />
        <Box sx={{ mt: 3 }}>
          <Typography variant="caption" sx={{ color: '#888' }}>
            Bằng việc tải lên, bạn đồng ý cho chúng tôi xử lý dữ liệu theo chính sách bảo mật.
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}


