import { useState, useCallback } from 'react';
import {
  ReservationMember,
  CreateReservationMemberDto,
  getReservationMembers,
  createReservationMember,
  deleteReservationMember,
  updateReservationMember,
} from '@/utils/http/api/reservation-members';

interface UseReservationMembersReturn {
  members: ReservationMember[];
  loading: boolean;
  error: string | null;
  fetchMembers: (reservationId: string) => Promise<void>;
  addMember: (data: CreateReservationMemberDto) => Promise<boolean>;
  removeMember: (id: string) => Promise<boolean>;
  updateMember: (id: string, data: Partial<CreateReservationMemberDto>) => Promise<boolean>;
}

/**
 * Hook for managing reservation members
 */
export const useReservationMembers = (): UseReservationMembersReturn => {
  const [members, setMembers] = useState<ReservationMember[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMembers = useCallback(async (reservationId: string) => {
    if (!reservationId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await getReservationMembers(reservationId);
      setMembers(response.result || []);
    } catch (err) {
      console.error('獲取預約成員失敗:', err);
      setError('獲取預約成員失敗');
      setMembers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const addMember = useCallback(async (data: CreateReservationMemberDto): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const response = await createReservationMember(data);
      if (response.result) {
        // 將新成員加入列表
        setMembers((prevMembers) => [...prevMembers, response.result]);
        return true;
      }
      return false;
    } catch (err) {
      console.error('加入成員失敗:', err);
      setError('加入成員失敗');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const removeMember = useCallback(async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      await deleteReservationMember(id);
      // 從列表中移除成員
      setMembers((prevMembers) => prevMembers.filter((member) => member.id !== id));
      return true;
    } catch (err) {
      console.error('移除成員失敗:', err);
      setError('移除成員失敗');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateMember = useCallback(async (id: string, data: Partial<CreateReservationMemberDto>): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const response = await updateReservationMember(id, data);
      if (response.result) {
        // 更新列表中的成員
        setMembers((prevMembers) =>
          prevMembers.map((member) => (member.id === id ? response.result : member))
        );
        return true;
      }
      return false;
    } catch (err) {
      console.error('更新成員失敗:', err);
      setError('更新成員失敗');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    members,
    loading,
    error,
    fetchMembers,
    addMember,
    removeMember,
    updateMember,
  };
};
