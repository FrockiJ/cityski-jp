import { useLazyRequest } from './useLazyRequest';

interface UseRequestOptions<TValues, TError> {
	autoFetch?: boolean;
	onSuccess?: (values: TValues) => void;
	onError?: (error: TError) => void;
}

export function useRequest<TCallback extends (...args: any[]) => any, TError = Error>(
	callback: TCallback,
	options: Omit<UseRequestOptions<Awaited<ReturnType<TCallback>>, TError>, 'autoFetch'> = {},
) {
	const [runCallbackAsync, state] = useLazyRequest(callback, { ...options, autoFetch: true });

	return {
		...state,
		runCallbackAsync,
	};
}
