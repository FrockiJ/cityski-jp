type EnumValues<T> = T[keyof T];

export const HttpMethod = {
	GET: 'GET',
	POST: 'POST',
	PUT: 'PUT',
	PATCH: 'PATCH',
	DELETE: 'DELETE',
} as const;

export type HttpMethod = EnumValues<typeof HttpMethod>;
