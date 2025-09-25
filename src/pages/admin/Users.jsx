import React, { useEffect, useState } from 'react';
import { Box, Button, TextField, MenuItem } from '@mui/material';
import GenericTable from '../../components/admin/GenericTable.jsx';
import GenericModal from '../../components/admin/GenericModal.jsx';
import { userApi } from '../../services/adminService.js';

export default function Users() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', role: 'USER' });

  const load = async () => {
    setLoading(true);
    try {
      const response = await userApi.list();
      // Handle API response structure: { users: [...], totalUsers: 3, success: true, message: "..." }
      const data = response.users || response;
      setRows(data.map(x => ({ 
        id: x.userId || x.id, 
        name: x.name, 
        email: x.email, 
        cccdImageUrl: x.cccdImageUrl,
        role: x.role || 'USER' 
      })));
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const onEdit = (row) => { setEditing(row); setForm({ name: row.name, email: row.email, role: row.role }); setOpen(true); };
  const onDelete = async (row) => { await userApi.remove(row.id); await load(); };
  const onSubmit = async () => {
    if (editing) await userApi.update(editing.id, { role: form.role });
    setOpen(false); await load();
  };

  const columns = [
    { field: 'name', headerName: 'Tên', flex: 1 },
    { field: 'email', headerName: 'Email', flex: 1 },
    { 
      field: 'cccdImageUrl', 
      headerName: 'CCCD', 
      width: 120, 
      sortable: false,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {params.value ? (
            <img 
              src={params.value.startsWith('http') ? params.value : `http://localhost:8080${params.value}`} 
              alt="CCCD" 
              style={{ 
                width: 60, 
                height: 40, 
                objectFit: 'cover',
                borderRadius: 4,
                border: '1px solid #333'
              }} 
            />
          ) : (
            <Box sx={{ 
              width: 60, 
              height: 40, 
              bgcolor: '#333', 
              borderRadius: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#666',
              fontSize: '12px'
            }}>
              Chưa có
            </Box>
          )}
        </Box>
      )
    },
    { field: 'role', headerName: 'Vai trò', width: 120 },
    { field: 'actions', headerName: 'Thao tác', width: 180, sortable: false, renderCell: (params) => (
      <Box sx={{ display: 'flex', gap: 1,mt: 1.5 }}>
        <Button size="small" variant="outlined" onClick={() => onEdit(params.row)}>Sửa</Button>
        <Button size="small" color="error" variant="outlined" onClick={() => onDelete(params.row)}>Xóa</Button>
      </Box>
    ) }
  ];

  return (
    <Box>
      <GenericTable rows={rows} columns={columns} loading={loading} />
      <GenericModal open={open} title="Chỉnh sửa người dùng" onClose={() => setOpen(false)} onSubmit={onSubmit}>
        <Box sx={{ display: 'grid', gap: 2 }}>
          <TextField label="Tên" value={form.name} disabled fullWidth />
          <TextField label="Email" value={form.email} disabled fullWidth />
          <TextField label="Vai trò" select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
            <MenuItem value="USER">Người dùng</MenuItem>
            <MenuItem value="ADMIN">Quản trị viên</MenuItem>
          </TextField>
        </Box>
      </GenericModal>
    </Box>
  );
}


