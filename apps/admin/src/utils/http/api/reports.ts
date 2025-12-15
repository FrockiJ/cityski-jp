import { httpWithToken } from '../instance';

export interface MonthlyStatsResponse {
  classesCount: number;
  quotaAmount: number;
  classesGrowthRate: number | null;
  quotaGrowthRate: number | null;
}

export const getMonthlyStats = async (year?: number, month?: number): Promise<MonthlyStatsResponse> => {
  console.log('Calling getMonthlyStats with:', { year, month });
  
  const params: Record<string, string> = {};
  if (year) params.year = year.toString();
  if (month) params.month = month.toString();
  
  try {
    const response = await httpWithToken.get('/api/reports/monthly-stats', params);
    console.log('Full API response:', response);
    
    // Extract data from the wrapped response
    const result = response.result || response;
    console.log('Extracted result:', result);
    
    return result;
  } catch (error) {
    console.error('Error calling monthly stats API:', error);
    throw error;
  }
};

export interface AnnualCourseStatsResponse {
  year: number;
  total: number;
  stats: Array<{
    name: string;
    value: number;
    color: string;
  }>;
}

export const getAnnualCourseStats = async (year?: number): Promise<AnnualCourseStatsResponse> => {
  console.log('Calling getAnnualCourseStats with:', { year });
  
  const params: Record<string, string> = {};
  if (year) params.year = year.toString();
  
  try {
    const response = await httpWithToken.get('/api/reports/annual-course-stats', params);
    const result = response.result || response;
    console.log('Annual course stats result:', result);
    return result;
  } catch (error) {
    console.error('Error calling annual course stats API:', error);
    throw error;
  }
};

export interface DepartmentPerformanceResponse {
  year: number;
  departments: string[];
  monthlyData: { [departmentName: string]: number[] };
  months: string[];
}

export const getDepartmentPerformance = async (year?: number): Promise<DepartmentPerformanceResponse> => {
  console.log('Calling getDepartmentPerformance with:', { year });
  
  const params: Record<string, string> = {};
  if (year) params.year = year.toString();
  
  try {
    const response = await httpWithToken.get('/api/reports/department-performance', params);
    const result = response.result || response;
    console.log('Department performance result:', result);
    return result;
  } catch (error) {
    console.error('Error calling department performance API:', error);
    throw error;
  }
};