import { Box, Typography, Stack } from "@mui/material";

export default function MonthlyQuotaCard() {
  return (
    <Box
      sx={{
        p: 3,
        bgcolor: "#fff",
        borderRadius: 2,
        boxShadow:
          "0px 12px 24px -4px rgba(145,158,171,0.12), 0px 0px 2px 0px rgba(145,158,171,0.20)",
        display: "flex",
        flexDirection: "column",
        gap: 2,
        width: "100%",
        height: "100%",
      }}
    >
      {/* Title */}
      <Typography
        fontSize={14}
        fontWeight={600}
        lineHeight="20px"
        color="text.primary"
      >
        本月使用額度
      </Typography>

      {/* Number */}
      <Box sx={{ pt: 1, pb: 0.5 }}>
        <Typography
          component="span"
          fontSize={30}
          fontWeight={700}
          lineHeight="48px"
          color="text.primary"
        >
          120,480{" "}
        </Typography>
        <Typography
          component="span"
          fontSize={16}
          fontWeight={600}
          lineHeight="24px"
          color="text.primary"
        >
          元
        </Typography>
      </Box>

      {/* Comparison */}
      <Stack direction="row" spacing={1} alignItems="center">
        {/* Icon */}
        <Box
          sx={{
            p: 0.5,
            bgcolor: "rgba(255,86,48,0.16)", // Error 16%
            borderRadius: "50px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box
            sx={{
              width: 12,
              height: 8,
              bgcolor: "error.main",
            }}
          />
        </Box>

        {/* Text */}
        <Stack direction="row" spacing={0.5} alignItems="center">
          <Typography fontSize={14} fontWeight={600}>
            -
          </Typography>
          <Typography fontSize={14} fontWeight={600}>
            20.6%
          </Typography>
          <Typography
            fontSize={14}
            fontWeight={400}
            color="text.secondary"
          >
            相較於去年同月
          </Typography>
        </Stack>
      </Stack>
    </Box>
  );
}