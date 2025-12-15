import { useState } from "react";
import CustomLineChart from "@/components/Charts/LineChart";
import { useDepartmentPerformance } from "@/hooks/useDepartmentPerformance";

export default function DepartmentPerformanceCard() {
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const { data, loading, error } = useDepartmentPerformance(year);

  // Default colors for departments
  const departmentColors: { [key: string]: string } = {
    '台中店': '#34C38F',
    '新竹店': '#50C3E6', 
    '高雄店': '#F7B84B',
  };

  // Transform backend data to chart format
  const chartData = data?.monthlyData ? data.months.map((month, index) => ({
    month,
    ...data.departments.reduce((acc, deptName) => ({
      ...acc,
      [deptName]: data.monthlyData[deptName]?.[index] || 0
    }), {})
  })) : [];

  // Transform departments to store configuration
  const storeConfigs = data?.departments.map(deptName => ({
    key: deptName,
    color: departmentColors[deptName] || '#999999'
  })) || [];

  const handleYearChange = (newYear: string) => {
    setYear(newYear);
  };

  return (
    <CustomLineChart
      data={chartData}
      stores={storeConfigs}
      year={year}
      loading={loading}
      error={!!error}
      onYearChange={handleYearChange}
    />
  );
}