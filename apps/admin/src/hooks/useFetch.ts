import { useEffect, useState } from 'react';
import useSWR from 'swr';

import { useAppSelector } from '@/state/store';
import http, { httpWithToken } from '@/utils/http/instance';

interface ApiResponse<T> {
	data: T | undefined;
	error: any;
	loading: boolean;
	mutate: any;
}

interface UseSWROptions {
	revalidateIfStale?: boolean;
	revalidateOnFocus?: boolean;
	revalidateOnReconnect?: boolean;
	refreshInterval?: number;
}

/**
 * Uses SWR to request at an api endpoint and cache the data.
 * @template T - API response type
 * @param apiEndPoint - api endpoint
 * @param body - payload to append to the body of the request - automatically changes request to POST
 * @param options - Extra options for the request:
 * @param options.withAuth - whether request should use token authentication
 * @param options.requestType - request method
 * @param options.noFetch - not to fetch data on mount
 * @param options.disableCache - disable Cache
 * @param options.useSWROptions - optional useSWR cache revalidation options:
 * @param options.useSWROptions.revalidateIfStale - Disable Automatic Revalidation
 * @param options.useSWROptions.revalidateOnFocus - Disables revalidation when you leave then re-focus the window
 * @param options.useSWROptions.revalidateOnReconnect - Disables revalidation when an internet connection is available again after losing connection
 * @param options.useSWROptions.refreshInterval - Enables revalidation based on a looping time interval (in ms)
 * @returns
 */

const useFetch = <T>(
	apiEndPoint: string,
	options?: {
		noAuth?: boolean;
		noFetch?: boolean;
		useSWROptions?: UseSWROptions;
		disableCache?: boolean;
	},
): ApiResponse<T> => {
	const { noAuth, noFetch, useSWROptions, disableCache = false } = options || {};
	const [loading, setLoading] = useState(!noFetch ? false : true);
	const accessToken = useAppSelector((state) => state.auth.accessToken);

	// disableCacheFn
	const disableCacheFn = (useSWRNext: any) => {
		return (key: any, fetcher: any, config: any) => {
			// eslint-disable-next-line react-hooks/rules-of-hooks
			const swr = useSWRNext(key, fetcher, config);
			const { data, isValidating } = swr;
			return Object.assign({}, swr, {
				data: isValidating ? undefined : data,
			});
		};
	};

	/**
	 * Identifier(cache key) of data is first argument, which
	 * requires the body passed to it to prevent unexpected error
	 */
	const { data, error, mutate } = useSWR<T>(
		// only calls useSWR for fetching once interceptors are setup
		// in the case that authentication is needed or noFetch is false
		noFetch || !accessToken ? null : [apiEndPoint, accessToken],

		async () => {
			// request without token
			if (noAuth) await http.get<T>(apiEndPoint);

			// request with token
			return await httpWithToken.get<T>(apiEndPoint);
		},
		// *** useSWR Revalidation Options ***
		// per request options (passed in from args)
		{
			// global options - warning - these affect ALL requests
			// TODO: adjust these settings to decide when you want useSWR to revalidate cached data
			// revalidateIfStale: false, // Disable Automatic Revalidation
			revalidateOnFocus: false, // Disables revalidation when you leave then re-focus the window
			// revalidateOnReconnect: false, // Disables revalidation when an internet connection is available again after losing connection
			// refreshInterval: 1000, // Enables revalidation based on a looping time interval (in ms)
			use: disableCache ? [disableCacheFn] : [],
			...useSWROptions,
		},
	);

	// tracks api status and updates loading to false when request resolves
	useEffect(() => {
		setLoading(!noFetch ? false : true);
		if (data || error) {
			setLoading(false);
		}
	}, [noFetch, data, error]);

	return { data, error, loading, mutate };
};

export default useFetch;
