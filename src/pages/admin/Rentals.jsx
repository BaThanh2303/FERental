import React, { useEffect, useState } from 'react';
import { Box, TextField, MenuItem } from '@mui/material';
import GenericTable from '../../components/admin/GenericTable.jsx';
import { rentalApi } from '../../services/adminService.js';

export default function Rentals() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [total, setTotal] = useState(0);

  const load = async () => {
    setLoading(true);
    try {
      const data = await rentalApi.list(status ? { status } : undefined);
      setRows(data.map(x => ({ id: x.id || x.rentalId, userId: x.userId, vehicleId: x.vehicleId, status: x.status, totalCost: x.totalCost })));
      setTotal(data.reduce((s, x) => s + (Number(x.totalCost) || 0), 0));
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [status]);

  const columns = [
    { field: 'id', headerName: 'ID', width: 120 },
    { field: 'userId', headerName: 'User', width: 120 },
    { field: 'vehicleId', headerName: 'Vehicle', width: 120 },
    { field: 'status', headerName: 'Status', width: 140 },
    { field: 'totalCost', headerName: 'Total', width: 140 },
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, alignItems: 'center' }}>
        <TextField label="Status" select size="small" value={status} onChange={(e) => setStatus(e.target.value)} sx={{ width: 220 }}>
          <MenuItem value="">All</MenuItem>
          <MenuItem value="PENDING">PENDING</MenuItem>
          <MenuItem value="ACTIVE">ACTIVE</MenuItem>
          <MenuItem value="COMPLETED">COMPLETED</MenuItem>
        </TextField>
        <Box sx={{ color: 'white' }}>Total revenue: {total.toLocaleString('vi-VN')} VND</Box>
      </Box>
      <GenericTable rows={rows} columns={columns} loading={loading} />
    </Box>
  );
}


