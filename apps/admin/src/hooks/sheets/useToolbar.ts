import useFetch from '@/hooks/useFetch';
import { SheetsColumn } from '@/shared/constants/enums';
import { getSheetsApi, SheetsData } from '@/shared/constants/sheetsApi';

export interface Toolbar {
	search?: { key: string[]; placeholder: string };
	filter?: { isShow: boolean };
	textButton?: { isShow: boolean };
}

export function parseData(data: Array<Array<string>>): Toolbar | undefined {
	// console.log(data);
	let result = {};

	for (let i = 1; i < data.length; i++) {
		const row = data[i];
		const isShow = row[1].toUpperCase() !== 'FALSE';
		if (isShow)
			switch (row[0]) {
				case 'Search':
					const [column, rowIsShow, placeholder, rowSearchKey] = row;
					console.log({ column, rowIsShow });
					const key = rowSearchKey.split(',').map((s) => s.trim().replace('"', ''));
					result = {
						...result,
						search: {
							key,
							placeholder,
						},
					};
					break;
				case 'Filter':
					result = {
						...result,
						filter: {
							isShow: true,
						},
					};
					break;
				case 'Text Button':
					result = {
						...result,
						textButton: {
							isShow: true,
						},
					};
					break;
			}
	}

	return result;
}

export const useToolbar = () => {
	const api = getSheetsApi(SheetsColumn.TOOLBAR);
	const data = useFetch<SheetsData>(api)?.data?.values;
	return data && parseData(data);
};
