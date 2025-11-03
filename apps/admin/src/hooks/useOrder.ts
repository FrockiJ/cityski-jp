import { useState, useCallback } from 'react';
import { getOrderHistoryByOrderId, OrderHistory } from '@/utils/http/api/order-history';

interface UseOrderHistoryReturn {
  histories: OrderHistory[];
  loading: boolean;
  error: string | null;
  fetchOrderHistory: (orderId: string) => Promise<void>;
}

/**
 * Hook for fetching order history
 */
export const useOrderHistory = (): UseOrderHistoryReturn => {
  const [histories, setHistories] = useState<OrderHistory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrderHistory = useCallback(async (orderId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await getOrderHistoryByOrderId(orderId);
      setHistories(response.result);
    } catch (err) {
      console.error('獲取訂單歷史失敗:', err);
      setError('獲取訂單歷史失敗');
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    histories,
    loading,
    error,
    fetchOrderHistory,
  };
};