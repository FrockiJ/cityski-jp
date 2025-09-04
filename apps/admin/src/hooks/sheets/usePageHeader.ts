import { SheetsColumn } from '@/shared/constants/enums';
import { getSheetsApi, SheetsData } from '@/shared/constants/sheetsApi';

import { useSheetsApi } from './useSheetsApi';

function convertDataToObject(data: Array<Array<string | boolean>>): Record<string, string | boolean | undefined> {
	const result: Record<string, string | boolean | undefined> = {};

	for (let i = 1; i < data.length; i++) {
		const row = data[i];
		if (row.length >= 3) {
			const [key, isShow, value] = row;
			if (typeof key === 'string') {
				const camelCaseKey = key
					.split(' ')
					.map((word, index) => {
						if (index === 0) {
							return word.toLowerCase();
						} else {
							return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
						}
					})
					.join('');

				result[camelCaseKey] =
					typeof value === 'string' && String(isShow).toUpperCase() !== 'FALSE' ? value : undefined;
			}
		}
	}

	return result;
}

export interface PageHeader {
	pageTitle?: string | undefined;
	primaryButton?: string | undefined;
	secondaryButton?: string | undefined;
}

function parseData(data: Array<Array<string | boolean>>): PageHeader {
	const result: PageHeader = {
		pageTitle: undefined,
		primaryButton: undefined,
		secondaryButton: undefined,
	};

	console.log(convertDataToObject(data));

	data.forEach((row) => {
		const [key, isShow, value] = row;
		// console.log(key);
		// console.log(isShow);
		switch (key) {
			case 'Page Title':
				result.pageTitle = isShow === 'TRUE' || isShow === '-' ? String(value) : undefined;
				break;
			case 'Primary Button':
				result.primaryButton = isShow === 'TRUE' || isShow === '-' ? String(value) : undefined;
				break;
			case 'Secondary Button':
				result.secondaryButton = isShow === 'TRUE' || isShow === '-' ? String(value) : undefined;
				break;
			default:
				break;
		}
	});

	return result;
}
export const usePageHeader = (_noFetch = false) => {
	const api = getSheetsApi(SheetsColumn.PAGE_HEADER);
	return useSheetsApi<SheetsData, PageHeader>(api, parseData, false);
	// const [mutateCount, setMutateCount] = useState<number>(0);

	// const { data, mutate } = useFetch<SheetsData>(api, null, { noFetch: mutateCount === 0 });

	// const handleMutate = () => {
	//   console.log('mutate', mutateCount);
	//   setMutateCount(c => c + 1);
	//   mutate();
	// };

	// console.log(data);
	// return { data: data?.values && parseData(data.values), mutate: handleMutate };
};
