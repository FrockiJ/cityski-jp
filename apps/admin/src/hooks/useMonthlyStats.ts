import { useRequest } from '@/utils/http/hooks/useRequest';
import { getMonthlyStats } from '@/utils/http/api/reports';

export interface MonthlyStatsData {
  classesCount: number;
  quotaAmount: number;
  classesGrowthRate: number | null;
  quotaGrowthRate: number | null;
}

interface UseMonthlyStatsReturn {
  data: MonthlyStatsData | null;
  loading: boolean;
  error: Error | null;
}

export const useMonthlyStats = (year?: number, month?: number): UseMonthlyStatsReturn => {
  const { data, loading, error } = useRequest(() => getMonthlyStats(year, month), {
    onError: (error) => {
      console.error('Error fetching monthly stats:', error);
    },
    onSuccess: (data) => {
      console.log('Successfully fetched monthly stats:', data);
    }
  });

  return { 
    data: data || null, 
    loading, 
    error: error || null 
  };
};