export const sheetTypes = [
	'Page Header',
	'Column Header',
	'Toolbar',
	'Filter',
	'InfoCard',
	'Card',
	'Data',
	'Chart',
	'Direction',
] as const;

export type SheetTypes = typeof sheetTypes;

export interface SheetsData {
	range: string;
	majorDimension: string;
	values: Array<Array<string>>;
}

export const getSheetsApi = (sheetName: SheetTypes[number]) => {
	return `https://sheets.googleapis.com/v4/spreadsheets/${process.env.GOOGLE_SHEETS_ID}/values/${sheetName}?alt=json&key=${process.env.GOOGLE_API_KEY}`;
};
