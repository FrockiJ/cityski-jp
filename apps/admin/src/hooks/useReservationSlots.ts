import { useCallback,useEffect, useState } from 'react';

import { getReservationSlots, GetReservationSlotsParams,ReservationSlot } from '@/utils/http/api/reservation-slots';

interface UseReservationSlotsReturn {
	slots: ReservationSlot[];
	totalCount: number;
	loading: boolean;
	error: string | null;
	refetch: () => Promise<void>;
}

export const useReservationSlots = (params?: GetReservationSlotsParams): UseReservationSlotsReturn => {
	const [slots, setSlots] = useState<ReservationSlot[]>([]);
	const [totalCount, setTotalCount] = useState(0);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const fetchSlots = useCallback(async () => {
		if (!params?.branch_id || !params?.start_date || !params?.end_date) {
			return;
		}

		setLoading(true);
		setError(null);

		try {
			const response = await getReservationSlots(params);

			// Backend returns { statusCode, message, result: { slots, totalCount } }
			const result = response.result || response;
			const slots = result.slots || [];
			const totalCount = result.totalCount || 0;

			setSlots(slots);
			setTotalCount(totalCount);
		} catch (err: any) {
			console.error('Failed to fetch reservation slots:', err);
			setError(err?.response?.data?.message || err.message || '取得預約時段失敗');
			setSlots([]);
			setTotalCount(0);
		} finally {
			setLoading(false);
		}
	}, [params?.branch_id, params?.start_date, params?.end_date, params?.course_type, params?.instructor_id]);

	useEffect(() => {
		fetchSlots();
	}, [fetchSlots]);

	return {
		slots,
		totalCount,
		loading,
		error,
		refetch: fetchSlots,
	};
};
