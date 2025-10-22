import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { GetOrdersResponseDTO, ResponseWrapper, ResWithPaginationDTO } from '@repo/shared';

import api from '@/lib/api';
import { selectToken } from '@/state/slices/authSlice';

interface UseMyOrdersResult {
  orders: GetOrdersResponseDTO[];
  loading: boolean;
  error: string | null;
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
  fetchOrders: (page?: number, limit?: number) => Promise<void>;
  refetch: () => Promise<void>;
}

export const useMyOrders = (): UseMyOrdersResult => {
  const [orders, setOrders] = useState<GetOrdersResponseDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    pages: 0,
  });
  
  const accessToken = useSelector(selectToken);

  const fetchOrders = async (page: number = 1, limit: number = 10) => {
    if (!accessToken) {
      setError('No access token available');
      setOrders([]);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const response = await api.get<ResponseWrapper<ResWithPaginationDTO<GetOrdersResponseDTO[]>>>(
        `/api/orders/my-orders?page=${page}&limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.data?.result) {
        throw new Error('No result in response');
      }

      const { data, total, page: currentPage, limit: currentLimit, pages } = response.data.result;
      
      // Ensure data is always an array
      const ordersData = Array.isArray(data) ? data : [];
      setOrders(ordersData);
      setPagination({
        total,
        page: currentPage,
        limit: currentLimit,
        pages,
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch orders');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const refetch = () => fetchOrders(pagination.page, pagination.limit);

  // Auto-fetch on mount if token is available
  useEffect(() => {
    if (accessToken) {
      fetchOrders();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken]);

  return {
    orders,
    loading,
    error,
    pagination,
    fetchOrders,
    refetch,
  };
};