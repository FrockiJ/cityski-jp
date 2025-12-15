import { Box, Typography, Stack, CircularProgress } from "@mui/material";
import { useMonthlyStats } from "@/hooks/useMonthlyStats";

export default function MonthlyClassesCard() {
  const { data, loading, error } = useMonthlyStats();
  
  console.log('MonthlyClassesCard state:', { data, loading, error });
  
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
        本月開課堂數
      </Typography>

      {/* Number */}
      <Box sx={{ pt: 1, pb: 0.5, minHeight: 60, display: 'flex', alignItems: 'center' }}>
        {loading ? (
          <CircularProgress size={24} />
        ) : error ? (
          <Typography fontSize={14} color="error.main">
            載入失敗
          </Typography>
        ) : (
          <>
            <Typography
              component="span"
              fontSize={30}
              fontWeight={700}
              lineHeight="48px"
              color="text.primary"
            >
              {data?.classesCount || 0}{" "}
            </Typography>
            <Typography
              component="span"
              fontSize={16}
              fontWeight={600}
              lineHeight="24px"
              color="text.primary"
            >
              堂
            </Typography>
          </>
        )}
      </Box>

      {/* Comparison */}
      {!loading && !error && data && (
        <Stack direction="row" spacing={1} alignItems="center">
          {/* Icon */}
          <Box
            sx={{
              p: 0.5,
              bgcolor: data.classesGrowthRate === null 
                ? "rgba(156, 163, 175, 0.16)" 
                : data.classesGrowthRate >= 0 
                  ? "rgba(34,197,94,0.16)" 
                  : "rgba(255,86,48,0.16)",
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
                bgcolor: data.classesGrowthRate === null 
                  ? "grey.400" 
                  : data.classesGrowthRate >= 0 ? "success.main" : "error.main",
              }}
            />
          </Box>

          {/* Text */}
          <Stack direction="row" spacing={0.5} alignItems="center">
            {data.classesGrowthRate === null ? (
              <Typography fontSize={14} fontWeight={600}>
                NA
              </Typography>
            ) : (
              <>
                <Typography fontSize={14} fontWeight={600}>
                  {data.classesGrowthRate >= 0 ? "+" : ""}
                </Typography>
                <Typography fontSize={14} fontWeight={600}>
                  {Math.abs(data.classesGrowthRate)}%
                </Typography>
              </>
            )}
            <Typography
              fontSize={14}
              fontWeight={400}
              color="text.secondary"
            >
              相較於去年同月
            </Typography>
          </Stack>
        </Stack>
      )}
    </Box>
  );
}
