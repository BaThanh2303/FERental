import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

export default function GenericModal({ open, title, children, onClose, onSubmit, submitLabel = 'Save', loading = false }) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{title}</DialogTitle>
      <DialogContent dividers>
        {children}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>Cancel</Button>
        <Button variant="contained" onClick={onSubmit} disabled={loading}>
          {submitLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
}


