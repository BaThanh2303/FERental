import React, { useRef, useState } from 'react';
import api from '../utils/axios.js';
import { Box, Button, Typography, CircularProgress, Alert } from '@mui/material';

const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
const ACCEPTED_TYPES = ['image/jpeg', 'image/png'];

export default function CCCDUpload({ userId, onSuccess }) {
  const inputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const onPickFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;

    if (!ACCEPTED_TYPES.includes(f.type)) {
      setError('Chỉ chấp nhận JPG/PNG');
      setFile(null);
      setPreviewUrl('');
      return;
    }

    if (f.size > MAX_SIZE_BYTES) {
      setError('Kích thước tối đa 5MB');
      setFile(null);
      setPreviewUrl('');
      return;
    }

    setError('');
    setSuccess('');
    setFile(f);
    setPreviewUrl(URL.createObjectURL(f));
  };

  const onUpload = async () => {
    if (!file || !userId) return;
    try {
      setLoading(true);
      setError('');
      setSuccess('');

      const form = new FormData();
      form.append('file', file);

      const res = await api.post(`/users/${userId}/cccd`, form, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setSuccess('Tải lên CCCD thành công');
      setFile(null);
      if (onSuccess) onSuccess(res.data);
    } catch (err) {
      setError(err.message || 'Tải lên thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }}>
        Tải lên CCCD
      </Typography>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png"
        style={{ display: 'none' }}
        onChange={onPickFile}
      />
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
        <Button
          variant="outlined"
          onClick={() => inputRef.current?.click()}
          sx={{ color: 'white', borderColor: '#444' }}
        >
          Chọn ảnh CCCD (JPG/PNG, ≤ 5MB)
        </Button>
        <Button
          variant="contained"
          onClick={onUpload}
          disabled={!file || loading}
          startIcon={loading ? <CircularProgress size={16} sx={{ color: 'white' }} /> : null}
          sx={{ bgcolor: '#ff0000', '&:hover': { bgcolor: '#cc0000' } }}
        >
          {loading ? 'Đang tải...' : 'Tải lên'}
        </Button>
      </Box>

      {previewUrl && (
        <Box sx={{ mt: 1 }}>
          <img src={previewUrl} alt="CCCD Preview" style={{ maxWidth: '320px', borderRadius: 8, border: '1px solid #333' }} />
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ bgcolor: 'rgba(244,67,54,0.1)', color: '#f44336' }}>{error}</Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ bgcolor: 'rgba(76,175,80,0.1)', color: '#4caf50' }}>{success}</Alert>
      )}
    </Box>
  );
}


