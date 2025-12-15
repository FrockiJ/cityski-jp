import { Box, Typography, Stack, Chip } from "@mui/material";
import { KeyboardArrowDown } from "@mui/icons-material";
import CustomPieChart from "@/components/Charts/PieChart";

export default function AnnualCourseStatsCard() {
  return (
    <Box
      sx={{
        width: 320,
        height: 384,
        bgcolor: "#fff",
        borderRadius: 2,
        boxShadow:
          "0px 12px 24px -4px rgba(145,158,171,0.12), 0px 0px 2px 0px rgba(145,158,171,0.20)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <Box sx={{ px: 3, py: 3, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography fontSize={18} fontWeight={700} lineHeight="28px" color="text.primary">
          年度課程統計
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

      {/* Chart Area */}
			
    </Box>
  );
}