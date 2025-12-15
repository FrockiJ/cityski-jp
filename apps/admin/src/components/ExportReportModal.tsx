import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
  IconButton,
  Box,
  Paper,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface ExportReportModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (reportType: string) => void;
}

const ExportReportModal: React.FC<ExportReportModalProps> = ({
  open,
  onClose,
  onConfirm,
}) => {
  const [selectedReport, setSelectedReport] = useState('group-list');

  const handleConfirm = () => {
    onConfirm(selectedReport);
    onClose();
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedReport(event.target.value);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          width: '480px',
          maxWidth: '480px',
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
          borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '18px' }}>
          匯出報表
        </Typography>
        <IconButton
          onClick={onClose}
          size="small"
          sx={{
            p: 1,
            borderRadius: '50px',
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        <FormControl component="fieldset" sx={{ width: '100%' }}>
          <RadioGroup
            value={selectedReport}
            onChange={handleChange}
            sx={{ gap: 1 }}
          >
            <Paper
              elevation={0}
              sx={{
                p: 2,
                border: '1px solid rgba(0, 0, 0, 0.12)',
                borderRadius: 3,
                backgroundColor: selectedReport === 'group-list' 
                  ? 'rgba(25, 118, 210, 0.08)' 
                  : 'transparent',
                borderColor: selectedReport === 'group-list' 
                  ? 'primary.main' 
                  : 'rgba(0, 0, 0, 0.12)',
              }}
            >
              <FormControlLabel
                value="group-list"
                control={
                  <Radio
                    sx={{
                      color: 'rgba(0, 0, 0, 0.6)',
                      '&.Mui-checked': {
                        color: 'primary.main',
                      },
                    }}
                  />
                }
                label={
                  <Box>
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        fontWeight: 400,
                        fontSize: '16px',
                        lineHeight: '24px',
                        color: 'text.primary',
                      }}
                    >
                      湊班名單
                    </Typography>
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        fontSize: '12px',
                        lineHeight: '16px',
                        color: 'text.disabled',
                        display: 'block',
                      }}
                    >
                      團體預約式課程剩餘學員名單
                    </Typography>
                  </Box>
                }
                sx={{ 
                  m: 0, 
                  width: '100%',
                  alignItems: 'flex-start',
                  '& .MuiFormControlLabel-label': {
                    flex: 1,
                    ml: 1,
                  }
                }}
              />
            </Paper>

            <Paper
              elevation={0}
              sx={{
                p: 2,
                border: '1px solid rgba(0, 0, 0, 0.12)',
                borderRadius: 3,
                backgroundColor: selectedReport === 'instructor-schedule' 
                  ? 'rgba(25, 118, 210, 0.08)' 
                  : 'transparent',
                borderColor: selectedReport === 'instructor-schedule' 
                  ? 'primary.main' 
                  : 'rgba(0, 0, 0, 0.12)',
              }}
            >
              <FormControlLabel
                value="instructor-schedule"
                control={
                  <Radio
                    sx={{
                      color: 'rgba(0, 0, 0, 0.6)',
                      '&.Mui-checked': {
                        color: 'primary.main',
                      },
                    }}
                  />
                }
                label={
                  <Box>
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        fontWeight: 400,
                        fontSize: '16px',
                        lineHeight: '24px',
                        color: 'text.primary',
                      }}
                    >
                      教練總排堂表
                    </Typography>
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        fontSize: '12px',
                        lineHeight: '16px',
                        color: 'text.disabled',
                        display: 'block',
                      }}
                    >
                      教練總排課統計表
                    </Typography>
                  </Box>
                }
                sx={{ 
                  m: 0, 
                  width: '100%',
                  alignItems: 'flex-start',
                  '& .MuiFormControlLabel-label': {
                    flex: 1,
                    ml: 1,
                  }
                }}
              />
            </Paper>
          </RadioGroup>
        </FormControl>
      </DialogContent>

      <DialogActions
        sx={{
          p: 3,
          borderTop: '1px solid rgba(0, 0, 0, 0.12)',
          gap: 1.5,
        }}
      >
        <Button
          variant="outlined"
          onClick={onClose}
          sx={{
            px: 2,
            py: 0.75,
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 700,
            fontSize: '14px',
            lineHeight: '24px',
            color: 'text.primary',
            borderColor: 'rgba(0, 0, 0, 0.23)',
            '&:hover': {
              borderColor: 'rgba(0, 0, 0, 0.4)',
            },
          }}
        >
          取消
        </Button>
        <Button
          variant="contained"
          onClick={handleConfirm}
          sx={{
            px: 2,
            py: 0.75,
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 700,
            fontSize: '14px',
            lineHeight: '24px',
            backgroundColor: 'primary.main',
            '&:hover': {
              backgroundColor: 'primary.dark',
            },
          }}
        >
          確認
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ExportReportModal;