import { AxiosError } from 'axios';

import { ErrorResponse } from '../types';

export default class HttpError extends AxiosError {
	public readonly errorResponse: ErrorResponse;

	constructor(errorResponse: ErrorResponse) {
		super(errorResponse?.message);

		this.errorResponse = errorResponse;
	}
}
