import { DependencyList, useEffect } from 'react';

export default function useDebounceEffect(fn: () => void, waitTime: number, deps: DependencyList) {
	useEffect(() => {
		const timer = setTimeout(() => {
			fn.apply(deps);
		}, waitTime);

		return () => {
			clearTimeout(timer);
		};
	}, [deps, fn, waitTime]);
}
