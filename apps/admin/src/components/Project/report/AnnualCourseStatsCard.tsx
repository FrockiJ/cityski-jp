import { useState } from "react";
import CustomPieChart from "@/components/Charts/PieChart";
import { useAnnualCourseStats } from "@/hooks/useAnnualCourseStats";

export default function AnnualCourseStatsCard() {
  const [year, setYear] = useState(new Date().getFullYear());
  const { data, loading, error } = useAnnualCourseStats(year);

  // Transform backend data to chart format
  const chartData = data?.stats.map(stat => ({
    name: stat.name,
    value: stat.value,
    color: stat.color
  })) || [];

  const handleYearChange = (newYear: number) => {
    setYear(newYear);
  };

  return (
    <CustomPieChart
      data={chartData}
      total={data?.total}
      year={year}
      loading={loading}
      error={!!error}
      onYearChange={handleYearChange}
    />
  );
}