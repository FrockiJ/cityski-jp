import { useState, useCallback, useRef } from 'react';
import { SelectOption } from '@repo/shared';
import { getCoaches } from '@/utils/http/api/user';
import { useUpdateReservation } from '@/hooks/useReservation';

interface UseInstructorSelectOptions {
	onError?: (error: string) => void;
}

export const useInstructorSelect = (options?: UseInstructorSelectOptions) => {
	// 按部門ID緩存教練列表
	const [coachesMap, setCoachesMap] = useState<Record<string, SelectOption[]>>({});
	const { updateExistingReservation } = useUpdateReservation();
	// 跟蹤正在加載的部門ID
	const loadingRef = useRef<Set<string>>(new Set());

	// 獲取特定部門的教練列表
	const fetchCoachesForDepartment = useCallback(async (departmentId: string) => {
		// 使用函數式更新來檢查緩存，避免依賴 coachesMap
		setCoachesMap((prevMap) => {
			// 如果已經有緩存或正在加載，直接返回
			if (prevMap[departmentId] || loadingRef.current.has(departmentId)) {
				return prevMap;
			}

			// 標記為正在加載
			loadingRef.current.add(departmentId);

			// 異步獲取教練列表
			getCoaches(departmentId)
				.then((response) => {
					const coaches =
						response.result?.map((coach) => ({
							value: coach.name,
							label: coach.name,
						})) || [];

					const coachOptions = [{ value: '', label: '未指定' }, ...coaches];

					setCoachesMap((prev) => ({
						...prev,
						[departmentId]: coachOptions,
					}));
					loadingRef.current.delete(departmentId);
				})
				.catch((error) => {
					console.error('[useInstructorSelect] 獲取教練列表失敗:', error);
					setCoachesMap((prev) => ({
						...prev,
						[departmentId]: [{ value: '', label: '未指定' }],
					}));
					loadingRef.current.delete(departmentId);
				});

			return prevMap;
		});
	}, []);

	// 處理教練選擇變更
	const handleInstructorChange = useCallback(
		async (reservationId: string, newInstructorName: string): Promise<boolean> => {
			try {
				const success = await updateExistingReservation(reservationId, {
					instructor: newInstructorName || undefined,
				});

				if (!success && options?.onError) {
					options.onError('更新教練失敗');
				}

				return success;
			} catch (error) {
				console.error('更新教練失敗:', error);
				if (options?.onError) {
					options.onError(error instanceof Error ? error.message : '更新教練時發生未知錯誤');
				}
				return false;
			}
		},
		[updateExistingReservation, options]
	);

	return {
		coachesMap,
		fetchCoachesForDepartment,
		handleInstructorChange,
	};
};
