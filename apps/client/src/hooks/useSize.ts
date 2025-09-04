'use client';
import { useEffect, useState } from 'react';
const useSize = () => {
	const [windowSize, setWindowSize] = useState([0, 0]);

	useEffect(() => {
		setWindowSize([window.innerWidth, window.innerHeight]);
		const windowSizeHandler = () => {
			setWindowSize([window.innerWidth, window.innerHeight]);
		};
		window.addEventListener('resize', windowSizeHandler);

		return () => {
			window.removeEventListener('resize', windowSizeHandler);
		};
	}, []);

	return windowSize;
};

export default useSize;
