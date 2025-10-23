import { useEffect, useState } from 'react';
import { GetOrderDetailResponseDTO } from '@repo/shared';
import { getOrderDetail } from '@/utils/http/api';

interface UseGetOrderDetailResult {
  orderDetail: GetOrderDetailResponseDTO | null;
  loading: boolean;
  error: any;
  refetch: () => void;
}

export const useGetOrderDetail = (orderId: string | undefined): UseGetOrderDetailResult => {
  const [orderDetail, setOrderDetail] = useState<GetOrderDetailResponseDTO | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const [refetchTrigger, setRefetchTrigger] = useState(0);

  const refetch = () => {
    setRefetchTrigger((prev) => prev + 1);
  };

  useEffect(() => {
    if (!orderId) {
      setOrderDetail(null);
      setLoading(false);
      return;
    }

    const fetchOrderDetail = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await getOrderDetail(orderId);
        setOrderDetail(response.result);
      } catch (err) {
        setError(err);
        console.error('Failed to fetch order detail:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetail();
  }, [orderId, refetchTrigger]);

  return { orderDetail, loading, error, refetch };
};
