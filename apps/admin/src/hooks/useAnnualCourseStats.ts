import { useRequest } from '@/utils/http/hooks/useRequest';
import { getAnnualCourseStats, AnnualCourseStatsResponse } from '@/utils/http/api/reports';

interface UseAnnualCourseStatsReturn {
  data: AnnualCourseStatsResponse | null;
  loading: boolean;
  error: Error | null;
}

export const useAnnualCourseStats = (year?: number): UseAnnualCourseStatsReturn => {
  const { data, loading, error } = useRequest(() => getAnnualCourseStats(year), {
    onError: (error) => {
      console.error('Error fetching annual course stats:', error);
    },
    onSuccess: (data) => {
      console.log('Successfully fetched annual course stats:', data);
    }
  });

  return { 
    data: data || null, 
    loading, 
    error: error || null 
  };
};