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
      const data = await userApi.list();
      setRows(data.map(x => ({ id: x.id, name: x.name, email: x.email, role: x.role })));
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
    { field: 'name', headerName: 'Name', flex: 1 },
    { field: 'email', headerName: 'Email', flex: 1 },
    { field: 'role', headerName: 'Role', width: 150 },
    { field: 'actions', headerName: 'Actions', width: 180, sortable: false, renderCell: (params) => (
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Button size="small" variant="outlined" onClick={() => onEdit(params.row)}>Edit</Button>
        <Button size="small" color="error" variant="outlined" onClick={() => onDelete(params.row)}>Delete</Button>
      </Box>
    ) }
  ];

  return (
    <Box>
      <GenericTable rows={rows} columns={columns} loading={loading} />
      <GenericModal open={open} title="Edit User" onClose={() => setOpen(false)} onSubmit={onSubmit}>
        <Box sx={{ display: 'grid', gap: 2 }}>
          <TextField label="Name" value={form.name} disabled fullWidth />
          <TextField label="Email" value={form.email} disabled fullWidth />
          <TextField label="Role" select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
            <MenuItem value="USER">USER</MenuItem>
            <MenuItem value="ADMIN">ADMIN</MenuItem>
          </TextField>
        </Box>
      </GenericModal>
    </Box>
  );
}


