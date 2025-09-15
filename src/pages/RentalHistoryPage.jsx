import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Paper, Chip, Button, CircularProgress, Alert, Stack } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { getUserRentals, isAuthenticated, getUserId } from '../api.jsx';

const StatusChip = ({ status }) => {
  const color = status === 'ACTIVE' ? '#4caf50' : status === 'PENDING_PAYMENT' ? '#ff9800' : '#9e9e9e';
  return (
    <Chip label={status} sx={{ bgcolor: color, color: 'white', fontFamily: 'Consolas, monospace' }} />
  );
};

const RentalCard = ({ rental, onDetail }) => {
  const code = rental.vehicle?.code || `${rental.vehicle?.make || 'Bike'} ${rental.vehicle?.model || ''}`.trim();
  const stationName = rental.vehicle?.station?.name || rental.vehicle?.stationName || rental.stationName || 'N/A';
  const packageName = rental.rentalPackage?.name || 'Gói thuê';
  return (
    <Paper sx={{ p: 2, bgcolor: '#111111', border: '1px solid #333', borderRadius: 2 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
        <Box>
          <Typography variant="h6" sx={{ color: 'white', fontFamily: 'Consolas, monospace' }}>
            #{rental.id || rental.rentalId} - {code}
          </Typography>
          <Typography variant="body2" sx={{ color: '#ccc', fontFamily: 'Consolas, monospace' }}>
            Station: {stationName}
          </Typography>
          <Typography variant="body2" sx={{ color: '#ccc', fontFamily: 'Consolas, monospace' }}>
            Package: {packageName}
          </Typography>
          <Typography variant="body2" sx={{ color: '#999', fontFamily: 'Consolas, monospace' }}>
            Start: {rental.startTime || '-'} | End: {rental.endTime || '-'}
          </Typography>
        </Box>
        <Stack direction="row" spacing={2} alignItems="center">
          <StatusChip status={rental.status || 'COMPLETED'} />
          {(rental.status === 'ACTIVE' || rental.status === 'PENDING_PAYMENT') && (
            <Button variant="outlined" onClick={() => onDetail(rental)} sx={{ borderColor: '#ff0000', color: '#ff0000', fontFamily: 'Consolas, monospace', '&:hover': { borderColor: '#cc0000' } }}>
              Detail
            </Button>
          )}
        </Stack>
      </Stack>
    </Paper>
  );
};

const RentalHistoryPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [rentals, setRentals] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        if (!isAuthenticated()) {
          setError('Vui lòng đăng nhập để xem lịch sử thuê.');
          setLoading(false);
          return;
        }
        const userId = getUserId();
        const data = await getUserRentals(userId);
        setRentals(Array.isArray(data) ? data : []);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const active = rentals.filter(r => r.status === 'ACTIVE' || r.status === 'PENDING_PAYMENT');
  const history = rentals.filter(r => r.status === 'COMPLETED' || r.status === 'CANCELLED');

  const goDetail = (r) => {
    const id = r.id || r.rentalId;
    if (id) navigate(`/rental/${id}`);
  };

  return (
    <Box sx={{ p: 3, bgcolor: '#000000', minHeight: '100vh' }}>
      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate('/')}
            sx={{ color: '#ff0000' }}
          >
            Quay lại
          </Button>
        </Box>
        <Typography variant="h5" sx={{ color: '#ff0000', fontFamily: 'Consolas, monospace', mt: 1 }}>
          Rental History
        </Typography>
      </Box>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress sx={{ color: '#ff0000' }} />
        </Box>
      )}

      {!loading && error && (
        <Alert severity="warning" sx={{ mb: 3, bgcolor: 'rgba(255,152,0,0.1)', color: '#ff9800' }}>{error}</Alert>
      )}

      {!loading && !error && (
        <Box sx={{ display: 'grid', gap: 2 }}>
          <Typography variant="subtitle1" sx={{ color: 'white', fontFamily: 'Consolas, monospace', mb: 1 }}>
            Đang thuê
          </Typography>
          {active.length === 0 ? (
            <Typography variant="body2" sx={{ color: '#999', fontFamily: 'Consolas, monospace' }}>Không có thuê xe đang hoạt động</Typography>
          ) : (
            active.map(r => <RentalCard key={r.id || r.rentalId} rental={r} onDetail={goDetail} />)
          )}

          <Typography variant="subtitle1" sx={{ color: 'white', fontFamily: 'Consolas, monospace', mt: 3, mb: 1 }}>
            Lịch sử
          </Typography>
          {history.length === 0 ? (
            <Typography variant="body2" sx={{ color: '#999', fontFamily: 'Consolas, monospace' }}>Chưa có lịch sử thuê</Typography>
          ) : (
            history.map(r => <RentalCard key={(r.id || r.rentalId) + '-h'} rental={r} onDetail={goDetail} />)
          )}
        </Box>
      )}
    </Box>
  );
};

export default RentalHistoryPage;


