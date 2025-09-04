import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';

/**
 * Custom hook to detect page routing in Next.js.
 *
 * This hook tracks whether a page routing event is currently in progress,
 * excluding the first render.
 *
 * @returns {Object} An object containing:
 * - `pageRouting` {boolean}: Indicates if a page routing event is in progress and the page has changed.
 */
export const useDetectPageRouting = () => {
	const router = useRouter();
	const [routing, setRouting] = useState(false);
	const currentPathname = router.pathname;
	const previousPathname = useRef(currentPathname);
	const isPageChange = currentPathname !== previousPathname.current;
	const pageRouting = routing && isPageChange;

	const handleStart = () => {
		setRouting(true);
	};
	const handleComplete = () => {
		setRouting(false);
	};

	useEffect(() => {
		router.events.on('routeChangeStart', handleStart);
		router.events.on('routeChangeComplete', handleComplete);
		router.events.on('routeChangeError', handleComplete);

		return () => {
			router.events.off('routeChangeComplete', handleComplete);
			router.events.off('routeChangeStart', handleStart);
			router.events.off('routeChangeError', handleComplete);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		// Update previous pathname after a successful route change
		if (!routing) {
			previousPathname.current = currentPathname;
		}
	}, [currentPathname, routing]);

	return { pageRouting };
};
