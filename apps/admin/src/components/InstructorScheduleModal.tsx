import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  Select,
  MenuItem,
  Typography,
  IconButton,
  Box,
  Grid,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

interface InstructorScheduleModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (year: number, month: number) => void;
}

const InstructorScheduleModal: React.FC<InstructorScheduleModalProps> = ({
  open,
  onClose,
  onConfirm,
}) => {
  const currentDate = new Date();
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1);

  // 生成年份選項（當前年份前後各3年）
  const generateYearOptions = () => {
    const years = [];
    const currentYear = currentDate.getFullYear();
    for (let i = currentYear - 3; i <= currentYear + 1; i++) {
      years.push(i);
    }
    return years;
  };

  // 月份選項
  const monthOptions = [
    { value: 1, label: '1月' },
    { value: 2, label: '2月' },
    { value: 3, label: '3月' },
    { value: 4, label: '4月' },
    { value: 5, label: '5月' },
    { value: 6, label: '6月' },
    { value: 7, label: '7月' },
    { value: 8, label: '8月' },
    { value: 9, label: '9月' },
    { value: 10, label: '10月' },
    { value: 11, label: '11月' },
    { value: 12, label: '12月' },
  ];

  const handleConfirm = () => {
    onConfirm(selectedYear, selectedMonth);
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
          borderRadius: 4,
          width: '480px',
          maxWidth: '480px',
          boxShadow: '-40px 40px 80px -8px rgba(145, 158, 171, 0.24)',
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
          backgroundColor: 'common.white',
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '18px' }}>
          教練總排堂表
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

      <DialogContent sx={{ p: 3, backgroundColor: '#f9f9f9' }}>
        <Box sx={{ mb: 5 }}>
          <Typography 
            variant="body2" 
            sx={{ 
              color: 'text.secondary',
              fontSize: '14px',
              fontWeight: 400,
              mb: 1,
            }}
          >
            時間
          </Typography>
          
          <Grid container spacing={2.5}>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <Select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(Number(e.target.value))}
                  IconComponent={ArrowDropDownIcon}
                  sx={{
                    backgroundColor: 'common.white',
                    borderRadius: 2,
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(0, 0, 0, 0.23)',
                    },
                    '& .MuiSelect-select': {
                      py: 1,
                      px: 1.75,
                      fontSize: '16px',
                      fontWeight: 400,
                      color: 'text.primary',
                    },
                  }}
                >
                  {generateYearOptions().map((year) => (
                    <MenuItem key={year} value={year}>
                      {year}年
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={6}>
              <FormControl fullWidth>
                <Select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(Number(e.target.value))}
                  IconComponent={ArrowDropDownIcon}
                  sx={{
                    backgroundColor: 'common.white',
                    borderRadius: 2,
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(0, 0, 0, 0.23)',
                    },
                    '& .MuiSelect-select': {
                      py: 1,
                      px: 1.75,
                      fontSize: '16px',
                      fontWeight: 400,
                      color: 'text.primary',
                    },
                  }}
                >
                  {monthOptions.map((month) => (
                    <MenuItem key={month.value} value={month.value}>
                      {month.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>

      <DialogActions
        sx={{
          p: 3,
          borderTop: '1px solid rgba(0, 0, 0, 0.12)',
          backgroundColor: 'common.white',
          justifyContent: 'space-between',
        }}
      >
        {/* 左側留空，對應原始設計中的隱藏刪除按鈕 */}
        <Box sx={{ opacity: 0, visibility: 'hidden' }}>
          <Button size="small" />
        </Box>
        
        {/* 右側按鈕 */}
        <Box sx={{ display: 'flex', gap: 1.5 }}>
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
            匯出
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default InstructorScheduleModal;