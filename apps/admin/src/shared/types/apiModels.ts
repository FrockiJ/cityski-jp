export type PostData = {
	data: string[];
};

export type LoginData = {
	account: string;
	password: string;
};

type AuthApiData = {
	message: string;
	success: boolean;
};

export type AuthApiRes = {
	status: number;
	data: AuthApiData;
};

/** Table **/
export type TableData = {
	count: number;
	result: TableDataResult[];
};

export type TableDataResult = {
	_id: string;
	conference: string;
	division: string;
	created: string;
	team: string;
	news: string;
	players: string[];
	coach: string;
};

export type ApiCommonRes<T = undefined> = {
	response_code: string;
	response_message: string;
	server_time: string;
	result_data: T;
};
