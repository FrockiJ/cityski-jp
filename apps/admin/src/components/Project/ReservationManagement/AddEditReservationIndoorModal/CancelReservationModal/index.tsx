import React, { useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  IconButton,
  TextField,
  Button,
} from '@mui/material';

interface CancelReservationModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (reason: string) => void;
}

const CancelReservationModal = ({
  open,
  onClose,
  onSubmit,
}: CancelReservationModalProps) => {
  const [reason, setReason] = useState('');

  const handleCancel = () => {
    setReason('');
    onClose();
  };

  const handleSubmit = () => {
    onSubmit(reason);
    setReason('');
  };

  return (
    <Dialog
      open={open}
      onClose={handleCancel}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          width: 480,
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          px: 3,
          py: 2,
          borderBottom: '1px solid rgba(145, 158, 171, 0.25)',
        }}
      >
        <Typography variant="h6" fontWeight="bold">
          取消預約
        </Typography>
        <IconButton
          onClick={handleCancel}
          size="small"
          sx={{
            padding: 1,
            '&:hover': {
              backgroundColor: 'rgba(145, 158, 171, 0.08)',
            },
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent
        sx={{
          px: 3,
          py: 3,
        }}
      >
        <TextField
          fullWidth
          multiline
          rows={4}
          placeholder="輸入取消原因"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          label="取消原因"
          variant="outlined"
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
            },
          }}
        />
      </DialogContent>

      <DialogActions
        sx={{
          px: 3,
          py: 2,
          borderTop: '1px solid rgba(145, 158, 171, 0.25)',
          gap: 1.5,
        }}
      >
        <Button
          variant="outlined"
          onClick={handleCancel}
          sx={{
            borderRadius: 2,
            px: 2,
            py: 0.75,
            textTransform: 'none',
            fontWeight: 'bold',
            fontSize: '0.875rem',
          }}
        >
          取消
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          sx={{
            borderRadius: 2,
            px: 2,
            py: 0.75,
            textTransform: 'none',
            fontWeight: 'bold',
            fontSize: '0.875rem',
          }}
        >
          送出
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CancelReservationModal;
