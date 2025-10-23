import { useState, useCallback } from 'react';
import { 
  CreateReservationRequestDto,
  GetReservationDetailResponseDto,
  DialogAction
} from '@repo/shared';
import { createReservation, getReservationDetail } from '@/utils/http/api/reservation';

interface UseReservationDetailReturn {
  reservationDetail: GetReservationDetailResponseDto | null;
  loading: boolean;
  error: string | null;
  fetchReservationDetail: (id: string) => Promise<void>;
}

interface UseCreateReservationReturn {
  loading: boolean;
  error: string | null;
  createNewReservation: (data: CreateReservationRequestDto) => Promise<boolean>;
}

/**
 * Hook for fetching reservation detail
 */
export const useReservationDetail = (): UseReservationDetailReturn => {
  const [reservationDetail, setReservationDetail] = useState<GetReservationDetailResponseDto | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReservationDetail = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await getReservationDetail(id);
      setReservationDetail(response.result);
    } catch (err) {
      console.error('獲取預約詳情失敗:', err);
      setError('獲取預約詳情失敗');
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    reservationDetail,
    loading,
    error,
    fetchReservationDetail,
  };
};

/**
 * Hook for creating reservation
 */
export const useCreateReservation = (): UseCreateReservationReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createNewReservation = useCallback(async (data: CreateReservationRequestDto): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await createReservation(data);
      return !!response;
    } catch (err) {
      console.error('創建預約失敗:', err);
      setError('創建預約失敗');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    createNewReservation,
  };
};