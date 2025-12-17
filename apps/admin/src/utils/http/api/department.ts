import { GetDepartmentsResponseDTO } from '@repo/shared';

import http from '@/utils/http/instance';

export const getDepartments = () => {
	return http.get<GetDepartmentsResponseDTO[]>(`/api/departments`);
};
