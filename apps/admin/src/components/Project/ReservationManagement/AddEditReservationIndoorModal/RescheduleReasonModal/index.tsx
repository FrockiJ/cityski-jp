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

interface RescheduleReasonModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (reason: string) => void;
}

const RescheduleReasonModal = ({
  open,
  onClose,
  onSubmit,
}: RescheduleReasonModalProps) => {
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
          預約改期
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
          placeholder="輸入改期原因"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          label="改期原因"
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

export default RescheduleReasonModal;
