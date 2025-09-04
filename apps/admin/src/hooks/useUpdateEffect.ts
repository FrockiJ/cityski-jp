import { useEffect, useRef } from 'react';

/*
 *	Equal to useEffect usage, the difference is that it will not be executed for the first time.
 */

export const useUpdateEffect = (fn: Function, input: any[]) => {
	const isInitialMount = useRef(true);

	useEffect(() => {
		if (isInitialMount.current) isInitialMount.current = false;
		else fn();

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, input);
};
