import { httpWithToken } from '../instance';

export interface MonthlyStatsResponse {
  classesCount: number;
  quotaAmount: number;
  classesGrowthRate: number;
  quotaGrowthRate: number;
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