import { useState, useCallback } from 'react';
import {
  CreateReservationRequestDto,
  UpdateReservationRequestDto,
  GetReservationDetailResponseDto,
  CreateOrderReservationRequestDto,
  DialogAction
} from '@repo/shared';
import { createReservation, getReservationDetail, updateReservation } from '@/utils/http/api/reservation';
import { createOrderReservation, deleteOrderReservation } from '@/utils/http/api/order-reservation';

interface UseReservationDetailReturn {
  reservationDetail: GetReservationDetailResponseDto | null;
  loading: boolean;
  error: string | null;
  fetchReservationDetail: (id: string) => Promise<void>;
}

interface UseCreateReservationReturn {
  loading: boolean;
  error: string | null;
  createNewReservation: (data: CreateReservationRequestDto) => Promise<string | null>;
}

interface UseUpdateReservationReturn {
  loading: boolean;
  error: string | null;
  updateExistingReservation: (id: string, data: UpdateReservationRequestDto) => Promise<boolean>;
}

interface UseOrderReservationReturn {
  loading: boolean;
  error: string | null;
  createLink: (data: CreateOrderReservationRequestDto) => Promise<boolean>;
  deleteLink: (orderReservationId: string) => Promise<boolean>;
}

interface UseCreateReservationWithLinkReturn {
  loading: boolean;
  error: string | null;
  createReservationWithLink: (
    reservationData: CreateReservationRequestDto,
    orderId: string,
    index: number
  ) => Promise<string | null>;
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

  const createNewReservation = useCallback(async (data: CreateReservationRequestDto): Promise<string | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await createReservation(data);
      // 返回新建立的預約 ID
      return response?.result?.id || null;
    } catch (err) {
      console.error('創建預約失敗:', err);
      setError('創建預約失敗');
      return null;
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

/**
 * Hook for updating reservation
 */
export const useUpdateReservation = (): UseUpdateReservationReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateExistingReservation = useCallback(async (id: string, data: UpdateReservationRequestDto): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const response = await updateReservation(id, data as any);
      return !!response;
    } catch (err) {
      console.error('更新預約失敗:', err);
      setError('更新預約失敗');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    updateExistingReservation,
  };
};

/**
 * Hook for managing OrderReservation links
 */
export const useOrderReservation = (): UseOrderReservationReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createLink = useCallback(async (data: CreateOrderReservationRequestDto): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      await createOrderReservation(data);
      return true;
    } catch (err) {
      console.error('建立 OrderReservation 連結失敗:', err);
      setError('建立連結失敗');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteLink = useCallback(async (orderReservationId: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      await deleteOrderReservation(orderReservationId);
      return true;
    } catch (err) {
      console.error('刪除 OrderReservation 連結失敗:', err);
      setError('刪除連結失敗');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    createLink,
    deleteLink,
  };
};

/**
 * Hook for creating reservation with OrderReservation link
 * 建立預約並同時建立與訂單的連結
 */
export const useCreateReservationWithLink = (): UseCreateReservationWithLinkReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createReservationWithLink = useCallback(async (
    reservationData: CreateReservationRequestDto,
    orderId: string,
    index: number
  ): Promise<string | null> => {
    setLoading(true);
    setError(null);

    try {
      // 步驟 1: 建立 Reservation
      const reservationResponse = await createReservation(reservationData);
      const reservationId = reservationResponse?.result?.id;

      if (!reservationId) {
        throw new Error('無法取得新建立的預約 ID');
      }

      // 步驟 2: 建立 OrderReservation 連結
      await createOrderReservation({
        orderId,
        reservationId,
        index,
      });

      return reservationId;
    } catch (err) {
      console.error('建立預約及連結失敗:', err);
      setError('建立預約及連結失敗');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    createReservationWithLink,
  };
};