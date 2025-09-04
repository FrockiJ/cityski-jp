import { GetDepartmentsResponseDTO, ResponseWrapper } from '@repo/shared';

import http from '@/utils/http/instance';

export const getDepartments = () => {
	return http.get<ResponseWrapper<GetDepartmentsResponseDTO[]>>(`/api/departments`);
};
