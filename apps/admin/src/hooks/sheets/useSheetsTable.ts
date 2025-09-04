import { SheetsColumn } from '@/shared/constants/enums';
import { getSheetsApi, SheetsData } from '@/shared/constants/sheetsApi';

import { useSheetsApi } from './useSheetsApi';

type TableType = 'TableList' | 'Draggable';

export interface SheetsTable {
	sortKey: string[];
	rowsPerPage: number;
	type: TableType;
}

export function parseData(data: Array<Array<string>>): SheetsTable | undefined {
	// console.log(data);
	let result: SheetsTable = {
		sortKey: [],
		rowsPerPage: 10,
		type: 'TableList',
	};

	for (let i = 1; i < data.length; i++) {
		const row = data[i];
		switch (row[0]) {
			case 'Sort Default':
				result.sortKey = row[1].split(',').map((s) => s.trim().replace('"', ''));
				break;
			case 'Rows per page':
				result.rowsPerPage = Number(row[1]) ?? 0;
				break;
			case 'Type':
				result.type = typeof row[1] === 'string' && (row[1] as TableType) ? (String(row[1]) as TableType) : 'TableList';
				break;
		}
	}

	return result;
}

export const useSheetsTable = (noFetch: boolean = false) => {
	const api = getSheetsApi(SheetsColumn.DATA);
	return useSheetsApi<SheetsData, SheetsTable | undefined>(api, parseData, noFetch);
};
