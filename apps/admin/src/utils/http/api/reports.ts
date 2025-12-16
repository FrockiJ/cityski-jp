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

export const exportGroupList = async (): Promise<void> => {
  console.log('Calling exportGroupList');
  
  try {
    // 從 Redux store 獲取 access token
    const { store } = await import('@/state/store');
    const { BASE_URL } = await import('@/utils/http/config');
    const accessToken = store.getState().auth.accessToken;
    const baseURL = BASE_URL[process.env.NODE_ENV as keyof typeof BASE_URL];
    
    const response = await fetch(`${baseURL}/api/reports/export/group-list`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `group-list-${new Date().toISOString().split('T')[0]}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error calling export group list API:', error);
    throw error;
  }
};

export const exportInstructorSchedule = async (year?: number, month?: number): Promise<void> => {
  console.log('Calling exportInstructorSchedule with:', { year, month });

  try {
    // 從 Redux store 獲取 access token
    const { store } = await import('@/state/store');
    const { BASE_URL } = await import('@/utils/http/config');
    const accessToken = store.getState().auth.accessToken;
    const baseURL = BASE_URL[process.env.NODE_ENV as keyof typeof BASE_URL];

    // 準備查詢參數
    const queryParams = new URLSearchParams();
    if (year) queryParams.append('year', year.toString());
    if (month) queryParams.append('month', month.toString());

    const url = `${baseURL}/api/reports/export/instructor-schedule${queryParams.toString() ? '?' + queryParams.toString() : ''}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    const fileName = year && month
      ? `instructor-schedule-${year}-${month.toString().padStart(2, '0')}.xlsx`
      : `instructor-schedule-${new Date().toISOString().split('T')[0]}.xlsx`;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);
  } catch (error) {
    console.error('Error calling export instructor schedule API:', error);
    throw error;
  }
};

export const exportCoachScheduleSummary = async (year?: number, month?: number): Promise<void> => {
  console.log('Calling exportCoachScheduleSummary with:', { year, month });

  try {
    // 從 Redux store 獲取 access token
    const { store } = await import('@/state/store');
    const { BASE_URL } = await import('@/utils/http/config');
    const accessToken = store.getState().auth.accessToken;
    const baseURL = BASE_URL[process.env.NODE_ENV as keyof typeof BASE_URL];

    // 準備查詢參數
    const queryParams = new URLSearchParams();
    if (year) queryParams.append('year', year.toString());
    if (month) queryParams.append('month', month.toString());

    const url = `${baseURL}/api/reports/export/coach-schedule-summary${queryParams.toString() ? '?' + queryParams.toString() : ''}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    const fileName = year && month
      ? `coach-schedule-summary-${year}-${month.toString().padStart(2, '0')}.xlsx`
      : `coach-schedule-summary-${new Date().toISOString().split('T')[0]}.xlsx`;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);
  } catch (error) {
    console.error('Error calling export coach schedule summary API:', error);
    throw error;
  }
};

export const exportOrderClassList = async (): Promise<void> => {
  console.log('Calling exportOrderClassList');

  try {
    const { store } = await import('@/state/store');
    const { BASE_URL } = await import('@/utils/http/config');
    const accessToken = store.getState().auth.accessToken;
    const baseURL = BASE_URL[process.env.NODE_ENV as keyof typeof BASE_URL];

    const response = await fetch(`${baseURL}/api/reports/export/order-class-list`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `order-class-list-${new Date().toISOString().split('T')[0]}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error calling export order class list API:', error);
    throw error;
  }
};