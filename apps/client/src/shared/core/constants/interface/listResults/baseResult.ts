export interface ListResultI {
	id: string;
}

export interface TableResultI<T extends ListResultI> {
	result: Array<T>;
	count: number;
}
