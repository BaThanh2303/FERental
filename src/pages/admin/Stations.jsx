import React, { useEffect, useState } from 'react';
import { Box, Button, TextField } from '@mui/material';
import GenericTable from '../../components/admin/GenericTable.jsx';
import GenericModal from '../../components/admin/GenericModal.jsx';
import { stationApi } from '../../services/adminService.js';

export default function Stations() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', location: '', latitude: '', longitude: '' });

  const load = async () => {
    setLoading(true);
    try {
      const data = await stationApi.list();
      setRows(data.map(x => ({ id: x.id || x.stationId, name: x.name, location: x.location || x.address, latitude: x.latitude || x.lat, longitude: x.longitude || x.lng })));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const onAdd = () => { setEditing(null); setForm({ name: '', location: '', latitude: '', longitude: '' }); setOpen(true); };
  const onEdit = (row) => { setEditing(row); setForm({ name: row.name, location: row.location, latitude: row.latitude, longitude: row.longitude }); setOpen(true); };
  const onDelete = async (row) => { await stationApi.remove(row.id); await load(); };
  const onSubmit = async () => {
    const payload = { name: form.name, location: form.location, latitude: Number(form.latitude), longitude: Number(form.longitude) };
    if (editing) await stationApi.update(editing.id, payload); else await stationApi.create(payload);
    setOpen(false); await load();
  };

  const columns = [
    { field: 'name', headerName: 'Name', flex: 1 },
    { field: 'location', headerName: 'Location', flex: 1 },
    { field: 'latitude', headerName: 'Lat', width: 120 },
    { field: 'longitude', headerName: 'Lng', width: 120 },
    {
      field: 'actions', headerName: 'Actions', width: 180, sortable: false, renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 1,mt: 1.5 }}>
          <Button size="small" variant="outlined" onClick={() => onEdit(params.row)}>Edit</Button>
          <Button size="small" color="error" variant="outlined" onClick={() => onDelete(params.row)}>Delete</Button>
        </Box>
      )
    }
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Button variant="contained" onClick={onAdd}>Add New</Button>
      </Box>
      <GenericTable rows={rows} columns={columns} loading={loading} />

      <GenericModal open={open} title={editing ? 'Edit Station' : 'Add Station'} onClose={() => setOpen(false)} onSubmit={onSubmit}>
        <Box sx={{ display: 'grid', gap: 2 }}>
          <TextField label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} fullWidth />
          <TextField label="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} fullWidth />
          <TextField label="Latitude" value={form.latitude} onChange={(e) => setForm({ ...form, latitude: e.target.value })} />
          <TextField label="Longitude" value={form.longitude} onChange={(e) => setForm({ ...form, longitude: e.target.value })} />
        </Box>
      </GenericModal>
    </Box>
  );
}


