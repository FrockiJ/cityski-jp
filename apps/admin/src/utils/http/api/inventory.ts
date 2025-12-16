import {
  GetInventoryRequestDTO,
  GetInventoryResponseDTO,
  ResponseWrapper,
} from '@repo/shared';
import { http } from '@/utils/http/instance';

export const getInventory = (params?: GetInventoryRequestDTO) => {
  return http.get<ResponseWrapper<GetInventoryResponseDTO>>('/api/inventory', params);
};

export const exportInventory = async (params?: GetInventoryRequestDTO): Promise<void> => {
  try {
    // Get access token and base URL
    const { store } = await import('@/state/store');
    const { BASE_URL } = await import('@/utils/http/config');
    const accessToken = store.getState().auth.accessToken;
    const baseURL = BASE_URL[process.env.NODE_ENV as keyof typeof BASE_URL];

    // Build query parameters
    const queryParams = new URLSearchParams();
    if (params?.fromDate) queryParams.append('fromDate', params.fromDate);
    if (params?.toDate) queryParams.append('toDate', params.toDate);
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder);
    if (params?.search) queryParams.append('search', params.search);

    const url = `${baseURL}/api/inventory/export${queryParams.toString() ? '?' + queryParams.toString() : ''}`;

    // Fetch Excel file
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

    // Download blob
    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = `inventory-${new Date().toISOString().split('T')[0]}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);
  } catch (error) {
    console.error('Error exporting inventory:', error);
    throw error;
  }
};
