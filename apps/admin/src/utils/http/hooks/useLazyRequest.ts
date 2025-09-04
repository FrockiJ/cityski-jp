import { useEffect, useRef, useState } from 'react';

interface UseLazyRequestOptions<TValues, TError> {
	autoFetch?: boolean;
	onSuccess?: (values: TValues) => void;
	onError?: (error: TError) => void;
}

export function useLazyRequest<TCallback extends (...args: any[]) => any, TError = Error>(
	callback: TCallback,
	options: UseLazyRequestOptions<Awaited<ReturnType<TCallback>>, TError> = {},
) {
	const { autoFetch = false } = options;
	const [loading, setLoading] = useState(autoFetch);
	const [data, setData] = useState<null | Awaited<ReturnType<TCallback>>>(null);
	const [error, setError] = useState<TError | null>(null);
	const previousDataRef = useRef(data);

	const callbackRef = useRef(callback);
	callbackRef.current = callback;

	// --- FUNCTIONS ---

	const runCallbackAsync = (async (...args) => {
		try {
			setError(null);
			setLoading(true);

			const newData = await callbackRef.current(...args);
			previousDataRef.current = data;

			setData(newData);
			options.onSuccess?.(newData);
			return newData;
		} catch (error) {
			setError(error as never);
			options.onError?.(error as never);
			throw error;
		} finally {
			setLoading(false);
		}
	}) as TCallback;

	const runCallback = (async (...args) => {
		try {
			return await runCallbackAsync(...args);
		} catch {}
	}) as TCallback;

	// --- EFFECTS ---

	useEffect(() => {
		if (autoFetch) runCallback();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return [
		runCallbackAsync,
		{
			previousData: previousDataRef.current,
			data,
			error,
			loading,
			runCallback,
		},
	] as const;
}
