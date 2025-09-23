import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box } from '@mui/material';

export default function GenericTable({ rows, columns, loading, pageSize = 10, onPageChange }) {
  return (
    <Box sx={{ height: 520, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        loading={loading}
        pagination
        pageSizeOptions={[5, 10, 20, 50]}
        initialState={{ pagination: { paginationModel: { pageSize } } }}
        onPaginationModelChange={(m) => onPageChange && onPageChange(m)}
        disableRowSelectionOnClick
        sx={{ bgcolor: '#111', borderColor: '#222', color: 'white' }}
      />
    </Box>
  );
}


