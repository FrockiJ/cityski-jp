import { ColumnType, SheetsColumn } from '@/shared/constants/enums';
import { getSheetsApi, SheetsData } from '@/shared/constants/sheetsApi';
import { AlignType, PositionType, TableColumnType } from '@/shared/types/dynamicTable';

import { useSheetsApi } from './useSheetsApi';

// Helper function to parse width
function parseWidth(input: string): string | number | undefined {
	const parsedNumber = parseFloat(input);
	if (!isNaN(parsedNumber)) {
		return parsedNumber;
	} else if (typeof input === 'string') {
		return input;
	} else {
		return undefined;
	}
}

// const getColumnType = (sheetsType: string) => {
// 	switch (sheetsType.trim()) {
// 		case 'Text':
// 			return ColumnType.CONTENT;
// 		case 'DateTimePicker':
// 			return ColumnType.CONTENT;
// 		case 'Delete Button':
// 			return ColumnType.DELETE;
// 		case 'Edit Button':
// 			return ColumnType.EDIT;
// 		default:
// 			return ColumnType.CONTENT;
// 	}
// };

export function parseData(data: Array<Array<string>>, options?: { handleChange?: () => void }): TableColumnType<any>[] {
	// console.log(data);
	const result: TableColumnType<any>[] = [];

	for (let i = 1; i < data.length; i++) {
		const row = data[i];
		if (row.length >= 6) {
			const [sequence, rowType, rowName, align, position, rowWidth, key] = row;
			console.log({ sequence });

			let type = ColumnType.CONTENT;
			let handleChange;
			let label;
			let name = rowName;
			let width = parseWidth(rowWidth);

			switch (rowType.trim()) {
				case 'Text':
					type = ColumnType.CONTENT;
					break;
				case 'Image':
					type = ColumnType.IMAGE;
					break;
				case 'DateTimePicker':
					type = ColumnType.CONTENT;
					break;
				case 'Delete Button':
					type = ColumnType.DELETE;
					handleChange = () => {};
					label = 'Delete';
					break;
				case 'Edit Button':
					type = ColumnType.EDIT;
					handleChange = () => {
						options?.handleChange?.();
					};
					label = 'Edit';
					name = '';
					width = '100%';
					break;
				default:
					type = ColumnType.CONTENT;
			}

			result.push({
				// sequence,
				name,
				type,
				label,
				handleChange,
				align: align?.toLowerCase() as AlignType,
				position: position?.toLowerCase() as PositionType,
				width,
				key,
			});
		}
	}

	return result;
}

export const useColumnHeader = <T>(noFetch: boolean = false, handleChange?: () => void) => {
	console.log({ handleChange });
	const api = getSheetsApi(SheetsColumn.COLUMN_HEADER);
	return useSheetsApi<SheetsData, TableColumnType<T>[]>(api, parseData, noFetch);
};
