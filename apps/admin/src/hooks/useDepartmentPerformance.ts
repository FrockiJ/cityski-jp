import { useRequest } from '@/utils/http/hooks/useRequest';
import { getDepartmentPerformance, DepartmentPerformanceResponse } from '@/utils/http/api/reports';

interface UseDepartmentPerformanceReturn {
  data: DepartmentPerformanceResponse | null;
  loading: boolean;
  error: Error | null;
}

export const useDepartmentPerformance = (year?: number | string): UseDepartmentPerformanceReturn => {
  const yearNumber = typeof year === 'string' ? parseInt(year) : year;
  const { data, loading, error } = useRequest(() => getDepartmentPerformance(yearNumber), {
    onError: (error) => {
      console.error('Error fetching department performance:', error);
    },
    onSuccess: (data) => {
      console.log('Successfully fetched department performance:', data);
    }
  });

  return { 
    data: data || null, 
    loading, 
    error: error || null 
  };
};