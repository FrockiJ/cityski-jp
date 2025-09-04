/**
 * Error Handling Classes
 *
 * NOTE: We use classes here because they represent both a type and a value constructor at the same time.
 **/

// Represents a success state
export class Succ<S> {
	readonly _tag = 'Success';
	constructor(readonly result: S) {}
}

// Represents an error state
export class Err<E> {
	readonly _tag = 'Err';
	constructor(readonly error: E) {}
}

// Result type to use on your expected types from a function's return type
export type Result<SuccT, ErrT> = Succ<SuccT> | Err<ErrT>;

/**
 * Global Error Types
 **/
export class NoAuthError {
	readonly _tag = 'NoAuthError';
	readonly value: string;

	constructor(value: string = 'Authentication error. Access token has expired.') {
		this.value = value;
	}
}

// For API Request Helper Use
export class CustomResError {
	readonly_tag = 'AxiosError';
	readonly label: string;

	constructor(
		readonly error: string,
		label: string = 'Axios error.',
	) {
		this.label = label;
	}
}

/**
 * Examples
 **/

// -- Get Data Example DEFINTION --
const getDataMock = (): Result<{ data: { id: number; result: string }[] } | {}, NoAuthError> => {
	const rand = Math.random() * 10;
	const mockAuth = Math.random() * 4 > 1;

	// fetched data and got response
	const apiRes =
		rand > 5
			? {
					data: [
						{ id: 1, result: 'test' },
						{ id: 2, result: 'test2' },
						{ id: 3, result: 'test3' },
					],
				}
			: {};

	// if user is authenticated, return data with success
	if (mockAuth) {
		return new Succ<typeof apiRes>(apiRes);
	}

	// errored, throw specific error type based on our Global Error Types
	return new Err<NoAuthError>(new NoAuthError());
};

// -- Get Data Example USAGE --
const mockGetDataRes = getDataMock();

if (mockGetDataRes instanceof Err) {
	// handle error
	// console.log('Error when getting data:', mockGetDataRes.error); // value here will be the error
}

if (mockGetDataRes instanceof Succ) {
	// const responseRes = mockGetDataRes.result;
	// setData(responseRes);
}
