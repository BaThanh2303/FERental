import React, { useEffect, useState } from 'react';
import { Box, Button, TextField, MenuItem } from '@mui/material';
import GenericTable from '../../components/admin/GenericTable.jsx';
import GenericModal from '../../components/admin/GenericModal.jsx';
import { vehicleApi } from '../../services/adminService.js';

export default function Vehicles() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ code: '', type: '', batteryLevel: 0, status: 'AVAILABLE', licensePlate: '', ownerName: '', imageUrl: '', stationId: '' });

  const load = async () => {
    setLoading(true);
    try {
      const data = await vehicleApi.list();
      setRows(data.map(x => ({ id: x.id || x.vehicleId, code: x.code, type: x.type, batteryLevel: x.batteryLevel, status: x.status, licensePlate: x.licensePlate, ownerName: x.ownerName, imageUrl: x.imageUrl, stationId: x.stationId })));
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const onAdd = () => { setEditing(null); setForm({ code: '', type: '', batteryLevel: 0, status: 'AVAILABLE', licensePlate: '', ownerName: '', imageUrl: '', stationId: '' }); setOpen(true); };
  const onEdit = (row) => { setEditing(row); setForm({ code: row.code, type: row.type, batteryLevel: row.batteryLevel ?? 0, status: row.status || 'AVAILABLE', licensePlate: row.licensePlate, ownerName: row.ownerName || '', imageUrl: row.imageUrl || '', stationId: row.stationId || '' }); setOpen(true); };
  const onDelete = async (row) => { await vehicleApi.remove(row.id); await load(); };
  const onSubmit = async () => {
    const payload = { code: form.code, type: form.type, batteryLevel: Number(form.batteryLevel) || 0, status: form.status, licensePlate: form.licensePlate, ownerName: form.ownerName, imageUrl: form.imageUrl };
    const stationId = Number(form.stationId);
    if (!stationId || Number.isNaN(stationId)) {
      alert('Station ID is required');
      return;
    }
    if (editing) await vehicleApi.updateWithStation(editing.id, stationId, payload); else await vehicleApi.createAtStation(stationId, payload);
    setOpen(false); await load();
  };

  const columns = [
    { field: 'code', headerName: 'Code', width: 220 },
    { field: 'type', headerName: 'Type', width: 140 },
    { field: 'batteryLevel', headerName: 'Battery', width: 120 },
    { field: 'status', headerName: 'Status', width: 140 },
    { field: 'licensePlate', headerName: 'License', width: 160 },
    { field: 'ownerName', headerName: 'Owner', width: 160 },
    { field: 'imageUrl', headerName: 'Image', flex: 1 },
    { field: 'actions', headerName: 'Actions', width: 180, sortable: false, renderCell: (params) => (
      <Box sx={{ display: 'flex', gap: 1, mt: 1.5 }}>
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
      <GenericModal open={open} title={editing ? 'Edit Vehicle' : 'Add Vehicle'} onClose={() => setOpen(false)} onSubmit={onSubmit}>
        <Box sx={{ display: 'grid', gap: 2 }}>
          <TextField label="Name" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} />
          <TextField label="Type" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} />
          <TextField label="Battery Level" value={form.batteryLevel} onChange={(e) => setForm({ ...form, batteryLevel: e.target.value })} />
          <TextField label="Status" select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
            <MenuItem value="AVAILABLE">AVAILABLE</MenuItem>
            <MenuItem value="RENTED">RENTED</MenuItem>
            <MenuItem value="MAINTENANCE">MAINTENANCE</MenuItem>
          </TextField>
          <TextField label="License Plate" value={form.licensePlate} onChange={(e) => setForm({ ...form, licensePlate: e.target.value })} />
          <TextField label="Owner Name" value={form.ownerName} onChange={(e) => setForm({ ...form, ownerName: e.target.value })} />
          <TextField label="Image URL" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} />
          <TextField label="Station ID" value={form.stationId} onChange={(e) => setForm({ ...form, stationId: e.target.value })} />
        </Box>
      </GenericModal>
    </Box>
  );
}


