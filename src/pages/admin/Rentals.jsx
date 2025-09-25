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
      setRows(data.map(x => ({ 
        id: x.id || x.rentalId, 
        userName: x.user?.name || 'N/A', 
        vehicleCode: x.vehicle?.code || 'N/A', 
        packageName: x.rentalPackage?.name || 'N/A', 
        startTime: x.startTime ? new Date(x.startTime).toLocaleString('vi-VN') : 'N/A',
        endTime: x.endTime ? new Date(x.endTime).toLocaleString('vi-VN') : 'N/A',
        status: x.status, 
        totalCost: x.totalCost 
      })));
      setTotal(data.reduce((s, x) => s + (Number(x.totalCost) || 0), 0));
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [status]);

  const columns = [
    { field: 'id', headerName: 'ID', width: 80 },
    { field: 'userName', headerName: 'Tên người dùng', width: 150 },
    { field: 'vehicleCode', headerName: 'Mã xe', width: 120 },
    { field: 'packageName', headerName: 'Gói thuê', width: 120 },
    { field: 'startTime', headerName: 'Thời gian bắt đầu', width: 180 },
    { field: 'endTime', headerName: 'Thời gian kết thúc', width: 180 },
    { field: 'status', headerName: 'Trạng thái', width: 120 },
    { field: 'totalCost', headerName: 'Tổng tiền', width: 120 },
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, alignItems: 'center' }}>
        <TextField label="Trạng thái" select size="small" value={status} onChange={(e) => setStatus(e.target.value)} sx={{ width: 220 }}>
          <MenuItem value="">Tất cả</MenuItem>
          <MenuItem value="PENDING">Đang chờ</MenuItem>
          <MenuItem value="ACTIVE">Đang hoạt động</MenuItem>
          <MenuItem value="COMPLETED">Hoàn thành</MenuItem>
        </TextField>
        <Box sx={{ color: 'white' }}>Tổng doanh thu: {total.toLocaleString('vi-VN')} VND</Box>
      </Box>
      <GenericTable rows={rows} columns={columns} loading={loading} />
    </Box>
  );
}


