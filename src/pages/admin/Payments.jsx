import React, { useEffect, useState } from 'react';
import { Box, TextField } from '@mui/material';
import GenericTable from '../../components/admin/GenericTable.jsx';
import { paymentApi } from '../../services/adminService.js';

export default function Payments() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [total, setTotal] = useState(0);

  const load = async () => {
    setLoading(true);
    try {
      const params = {};
      if (from) params.from = from;
      if (to) params.to = to;
      const data = await paymentApi.list(params);
      setRows(data.map(x => ({ id: x.id || x.paymentId, rentalId: x.rentalId, amount: x.amount, createdAt: x.createdAt || x.paidAt })));
      setTotal(data.reduce((s, x) => s + (Number(x.amount) || 0), 0));
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [from, to]);

  const columns = [
    { field: 'id', headerName: 'ID', width: 120 },
    { field: 'rentalId', headerName: 'Rental', width: 120 },
    { field: 'amount', headerName: 'Amount', width: 160 },
    { field: 'createdAt', headerName: 'Created', width: 200 },
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center' }}>
        <TextField label="From" type="date" size="small" InputLabelProps={{ shrink: true }} value={from} onChange={(e) => setFrom(e.target.value)} />
        <TextField label="To" type="date" size="small" InputLabelProps={{ shrink: true }} value={to} onChange={(e) => setTo(e.target.value)} />
        <Box sx={{ color: 'white', ml: 'auto' }}>Total payments: {total.toLocaleString('vi-VN')} VND</Box>
      </Box>
      <GenericTable rows={rows} columns={columns} loading={loading} />
    </Box>
  );
}


