import React from 'react';
import CloseIcon from '@mui/icons-material/Close';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  IconButton,
  Button,
} from '@mui/material';

interface SubmitAttendanceConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const SubmitAttendanceConfirmModal = ({
  open,
  onClose,
  onConfirm,
}: SubmitAttendanceConfirmModalProps) => {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          width: '480px',
          boxShadow: '-40px 40px 80px -8px rgba(145,158,171,0.24)',
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
          backgroundColor: '#FFFFFF',
        }}
      >
        <Typography variant="h6" fontWeight="bold" color="text.primary">
          送出上課紀錄
        </Typography>
        <IconButton
          onClick={onClose}
          size="small"
          sx={{
            padding: 1,
            borderRadius: '50px',
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
        <Typography variant="body1" color="text.secondary">
          一旦送出,將無法更改全體學員的出缺席。
        </Typography>
      </DialogContent>

      <DialogActions
        sx={{
          px: 3,
          py: 2,
          backgroundColor: '#FFFFFF',
          gap: 1.5,
          justifyContent: 'flex-end',
        }}
      >
        <Button
          variant="outlined"
          onClick={onClose}
          sx={{
            borderRadius: 2,
            px: 2,
            py: 0.75,
            textTransform: 'none',
            fontWeight: 'bold',
            fontSize: '0.875rem',
            color: 'text.primary',
            borderColor: 'rgba(145, 158, 171, 0.32)',
          }}
        >
          取消
        </Button>
        <Button
          variant="contained"
          onClick={handleConfirm}
          sx={{
            borderRadius: 2,
            px: 2,
            py: 0.75,
            textTransform: 'none',
            fontWeight: 'bold',
            fontSize: '0.875rem',
            backgroundColor: 'primary.main',
            color: '#FFFFFF',
            '&:hover': {
              backgroundColor: 'primary.dark',
            },
          }}
        >
          送出
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SubmitAttendanceConfirmModal;
