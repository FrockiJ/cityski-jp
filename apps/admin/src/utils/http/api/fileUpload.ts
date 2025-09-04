import { ResponseWrapper } from '@repo/shared';

import http from '@/utils/http/instance';

export const fileUpload = (file: File) => {
	return http.post<ResponseWrapper<{ key: string }>>(
		`/api/files/upload`,
		{
			file,
		},
		{
			headers: { 'Content-Type': 'multipart/form-data' },
		},
	);
};
