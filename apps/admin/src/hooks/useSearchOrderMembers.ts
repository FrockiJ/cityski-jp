import { useState, useCallback, useEffect, useRef } from 'react';
import { OrderMemberSearchResponseDto, ResponseWrapper, ResWithPaginationDTO } from '@repo/shared';

import { httpWithToken } from '@/utils/http/instance';

interface useSearchOrderMembersResult {
	searchResults: OrderMemberSearchResponseDto[];
	loading: boolean;
	error: string | null;
	searchMembers: (keyword: string) => void;
}

/**
 * Hook for searching order members with debounce
 * @param debounceMs - Debounce delay in milliseconds (default: 500)
 * @returns Search results, loading state, error, and search function
 */
export const useSearchOrderMembers = (debounceMs: number = 500): useSearchOrderMembersResult => {
	const [searchResults, setSearchResults] = useState<OrderMemberSearchResponseDto[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

	// 清理 debounce timeout
	useEffect(() => {
		return () => {
			if (debounceTimeoutRef.current) {
				clearTimeout(debounceTimeoutRef.current);
			}
		};
	}, []);

	// 搜尋剩餘課程數量大於 0 的會員的函數
	const performSearch = useCallback(async (keyword: string) => {
		if (!keyword.trim()) {
			setSearchResults([]);
			setLoading(false);
			setError(null);
			return;
		}

		setLoading(true);
		setError(null);

		try {
			const response = await httpWithToken.get<ResponseWrapper<OrderMemberSearchResponseDto[]>>(
				`/api/order-members/search?keyword=${encodeURIComponent(keyword)}`,
			);
			setSearchResults(response.result || []);
		} catch (err) {
			console.error('搜尋會員失敗:', err);
			setError('搜尋會員時發生錯誤');
			setSearchResults([]);
		} finally {
			setLoading(false);
		}
	}, []);

	// 帶 debounce 的搜尋函數
	const searchMembers = useCallback(
		(keyword: string) => {
			// 清除之前的 timeout
			if (debounceTimeoutRef.current) {
				clearTimeout(debounceTimeoutRef.current);
			}

			// 如果關鍵字為空，立即清空結果
			if (!keyword.trim()) {
				setSearchResults([]);
				setLoading(false);
				return;
			}

			// 設定 loading 狀態
			setLoading(true);

			// 設定新的 debounce timeout
			debounceTimeoutRef.current = setTimeout(() => {
				performSearch(keyword);
			}, debounceMs);
		},
		[debounceMs, performSearch],
	);

	return {
		searchResults,
		loading,
		error,
		searchMembers,
	};
};
