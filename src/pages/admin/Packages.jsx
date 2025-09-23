import React, { useEffect, useState } from 'react';
import { Box, Button, TextField } from '@mui/material';
import GenericTable from '../../components/admin/GenericTable.jsx';
import GenericModal from '../../components/admin/GenericModal.jsx';
import { packageApi } from '../../services/adminService.js';

export default function Packages() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', price: '', duration: '', description: '' });

  const load = async () => {
    setLoading(true);
    try {
      const data = await packageApi.list();
      setRows(data.map(x => ({ id: x.id || x.packageId, name: x.name, price: x.price, duration: x.duration, description: x.description })));
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const onAdd = () => { setEditing(null); setForm({ name: '', price: '', duration: '', description: '' }); setOpen(true); };
  const onEdit = (row) => { setEditing(row); setForm({ name: row.name, price: row.price, duration: row.duration, description: row.description || '' }); setOpen(true); };
  const onDelete = async (row) => { await packageApi.remove(row.id); await load(); };
  const onSubmit = async () => {
    const payload = { name: form.name, price: Number(form.price), duration: Number(form.duration), description: form.description };
    if (editing) await packageApi.update(editing.id, payload); else await packageApi.create(payload);
    setOpen(false); await load();
  };

  const columns = [
    { field: 'name', headerName: 'Name', flex: 1 },
    { field: 'price', headerName: 'Price', width: 140 },
    { field: 'duration', headerName: 'Duration (h)', width: 140 },
    { field: 'description', headerName: 'Description', flex: 1 },
    { field: 'actions', headerName: 'Actions', width: 180, sortable: false, renderCell: (params) => (
      <Box sx={{ display: 'flex', gap: 1,mt: 1.5 }}>
        <Button size="small" variant="outlined" onClick={() => onEdit(params.row)}>Edit</Button>
        <Button size="small" color="error" variant="outlined" onClick={() => onDelete(params.row)}>Delete</Button>
      </Box>
    ) }
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Button variant="contained" onClick={onAdd}>Add New</Button>
      </Box>
      <GenericTable rows={rows} columns={columns} loading={loading} />
      <GenericModal open={open} title={editing ? 'Edit Package' : 'Add Package'} onClose={() => setOpen(false)} onSubmit={onSubmit}>
        <Box sx={{ display: 'grid', gap: 2 }}>
          <TextField label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <TextField label="Price" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
          <TextField label="Duration (hours)" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} />
          <TextField label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </Box>
      </GenericModal>
    </Box>
  );
}


