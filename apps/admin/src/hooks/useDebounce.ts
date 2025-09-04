import { useEffect, useState } from 'react';

const useDebounce = (val: any, delay: number) => {
	const [debounceVal, setDebounceVal] = useState(val);

	useEffect(() => {
		const handler = setTimeout(() => {
			setDebounceVal(val);
		}, delay);

		return () => {
			clearTimeout(handler);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [val]);
	return debounceVal;
};

export default useDebounce;
