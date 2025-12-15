import { Box, Typography, Stack, Chip } from "@mui/material";
import { KeyboardArrowDown } from "@mui/icons-material";

export default function DepartmentPerformanceCard() {
  const months = [
    "一月", "二月", "三月", "四月", "五月", "六月",
    "七月", "八月", "九月", "十月", "十一月", "十二月"
  ];

  const yAxisLabels = ["100", "80", "40", "20", "0"];

  return (
    <Box
      sx={{
        width: 708,
        height: 384,
        bgcolor: "#fff",
        borderRadius: 2,
        boxShadow:
          "0px 12px 24px -4px rgba(145,158,171,0.12), 0px 0px 2px 0px rgba(145,158,171,0.20)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <Box sx={{ px: 3, py: 3, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography fontSize={18} fontWeight={700} lineHeight="28px" color="text.primary">
          各部門業績
        </Typography>
        <Chip
          label="2024"
          icon={<KeyboardArrowDown sx={{ fontSize: 16 }} />}
          sx={{
            bgcolor: "rgba(156, 163, 175, 0.1)",
            color: "grey.800",
            fontSize: 14,
            fontWeight: 600,
            "& .MuiChip-icon": {
              color: "grey.800",
            },
          }}
        />
      </Box>

      {/* Legend */}
      <Box sx={{ px: 3, display: "flex", justifyContent: "flex-end", gap: 3 }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <Box sx={{ width: 12, height: 12, bgcolor: "success.main", borderRadius: 0.5 }} />
          <Typography fontSize={12} fontWeight={500} color="text.primary">
            台中店
          </Typography>
        </Stack>
        <Stack direction="row" spacing={1} alignItems="center">
          <Box sx={{ width: 12, height: 12, bgcolor: "info.main", borderRadius: 0.5 }} />
          <Typography fontSize={12} fontWeight={500} color="text.primary">
            新竹店
          </Typography>
        </Stack>
        <Stack direction="row" spacing={1} alignItems="center">
          <Box sx={{ width: 12, height: 12, bgcolor: "warning.main", borderRadius: 0.5 }} />
          <Typography fontSize={12} fontWeight={500} color="text.primary">
            高雄店
          </Typography>
        </Stack>
      </Box>

      {/* Chart Area */}
      <Box sx={{ p: 3, position: "relative", display: "flex", flexDirection: "column", flex: 1 }}>
        {/* Mock Chart Bars - Replace with actual chart component */}
        <Box sx={{ position: "relative", height: 192, mb: 3 }}>
          {/* High雄店 Bar */}
          <Box
            sx={{
              position: "absolute",
              width: 600,
              height: 144,
              left: 74,
              top: 110,
              background: "linear-gradient(to bottom, rgba(251, 191, 36, 0.2), rgba(251, 191, 36, 0.2))",
            }}
          />
          <Box
            sx={{
              position: "absolute",
              width: 599.41,
              height: 112,
              left: 74,
              top: 110.75,
              bgcolor: "warning.main",
              border: "2px solid",
              borderColor: "warning.main",
            }}
          />
          
          {/* 台中店 Bar */}
          <Box
            sx={{
              position: "absolute",
              width: 599,
              height: 128,
              right: 0,
              bottom: 0,
              background: "linear-gradient(to bottom, rgba(34, 197, 94, 0.2), rgba(34, 197, 94, 0.2))",
            }}
          />
          <Box
            sx={{
              position: "absolute",
              width: 598,
              height: 96,
              right: 0,
              bottom: 0,
              bgcolor: "success.main",
              border: "2px solid",
              borderColor: "success.main",
            }}
          />
          
          {/* 新竹店 Bar */}
          <Box
            sx={{
              position: "absolute",
              width: 600,
              height: 192,
              left: 74,
              top: 48,
              background: "linear-gradient(to bottom, rgba(6, 182, 212, 0.2), rgba(6, 182, 212, 0.2))",
            }}
          />
          <Box
            sx={{
              position: "absolute",
              width: 599.41,
              height: 144,
              left: 74,
              top: 49,
              bgcolor: "info.main",
              border: "2px solid",
              borderColor: "info.main",
            }}
          />
        </Box>

        {/* Chart Grid and Labels */}
        <Stack direction="row" spacing={2.5}>
          {/* Y-axis */}
          <Stack spacing={5} sx={{ width: 24, pt: 2 }}>
            {yAxisLabels.map((label, index) => (
              <Typography
                key={index}
                fontSize={12}
                color="text.disabled"
                textAlign="right"
              >
                {label}
              </Typography>
            ))}
          </Stack>

          {/* Chart Area */}
          <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 1.5 }}>
            {/* Grid Lines */}
            <Stack spacing={5} sx={{ flex: 1 }}>
              {Array(5).fill(0).map((_, index) => (
                <Box
                  key={index}
                  sx={{
                    height: 16,
                    position: "relative",
                  }}
                >
                  <Box
                    sx={{
                      width: "100%",
                      height: "1px",
                      position: "absolute",
                      top: "8px",
                      borderTop: "1px dashed rgba(145,158,171,0.25)",
                    }}
                  />
                </Box>
              ))}
            </Stack>

            {/* X-axis Labels */}
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              {months.map((month, index) => (
                <Typography
                  key={index}
                  fontSize={12}
                  color="text.disabled"
                  textAlign="center"
                >
                  {month}
                </Typography>
              ))}
            </Stack>
          </Box>
        </Stack>
      </Box>
    </Box>
  );
}