import { useCallback, useEffect, useRef } from 'react';

/*
 Returns true if a component is mounted, prevents potential attempted changes
 to an unmounted component 
 */

export default function useMounted(): () => boolean {
	const mountedRef = useRef(false);
	const isMounted = useCallback(() => mountedRef.current, []);

	useEffect(() => {
		mountedRef.current = true;
		return () => {
			mountedRef.current = false;
		};
	}, []);

	return isMounted;
}
