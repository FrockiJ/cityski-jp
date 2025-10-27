import { useState, useEffect, useCallback } from 'react';
import { ReservationResponseDto } from '@repo/shared';
import { getOrderReservations } from '@/utils/http/api/order';

interface UseOrderReservationsResult {
	reservations: ReservationResponseDto[];
	loading: boolean;
	error: any;
	refetch: () => void;
}

export const useOrderReservations = (orderId: string | undefined): UseOrderReservationsResult => {
	const [reservations, setReservations] = useState<ReservationResponseDto[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<any>(null);
	const [refetchTrigger, setRefetchTrigger] = useState(0);

	const refetch = useCallback(() => {
		setRefetchTrigger((prev) => prev + 1);
	}, []);

	useEffect(() => {
		if (!orderId) {
			setReservations([]);
			return;
		}

		const fetchOrderReservations = async () => {
			try {
				setLoading(true);
				setError(null);
				const response = await getOrderReservations(orderId);
				setReservations(response.result || []);
			} catch (err) {
				setError(err);
				console.error('Failed to fetch order reservations:', err);
			} finally {
				setLoading(false);
			}
		};

		fetchOrderReservations();
	}, [orderId, refetchTrigger]);

	return { reservations, loading, error, refetch };
};
