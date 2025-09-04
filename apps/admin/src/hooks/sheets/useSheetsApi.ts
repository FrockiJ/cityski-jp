import { useCallback, useEffect, useState } from 'react';

import useFetch from '@/hooks/useFetch';

interface FetchData {
	values: any;
}

type DataWithRange = {
	range?: any;
};

export const useSheetsApi = <T extends FetchData, ParseType>(
	api: string,
	parseData: any,
	noFetch: boolean = false,
): { data: ParseType | undefined; mutate: () => void } => {
	const [mutateCount, setMutateCount] = useState<number>(0);

	// eslint-disable-next-line react-hooks/exhaustive-deps
	const memoizedParseData = useCallback(parseData, [mutateCount]);

	const { data, mutate } = useFetch<T>(api, {
		noFetch: noFetch ? mutateCount === 0 : false,
		noAuth: true,
	});
	// console.log('data',data)
	const [result, setResult] = useState<ParseType | undefined>(undefined);

	const handleMutate = () => {
		// console.log('mutate', mutateCount);
		setMutateCount((c) => c + 1);
		mutate();
	};
	useEffect(() => {
		// console.log('@data', data);
		if ((data as DataWithRange)?.range === 'Data!A1:Z1000') {
			// console.log('@chart data', data);
		}
		if (data?.values) {
			setResult(memoizedParseData(data.values));
			// console.log('data.values', data.values);
		}
	}, [data, memoizedParseData, mutateCount]);

	// console.log(data);
	// console.log(result);
	return { data: result, mutate: handleMutate };
};
