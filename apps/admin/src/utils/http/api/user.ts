import {
	CreateUserRequestDTO,
	GetRoleOptionsResponseDTO,
	GetUserByEmailResponseDTO,
	Response,
	ResponseWrapper,
	UpdateUserRequestDTO,
} from '@repo/shared';

import http from '@/utils/http/instance';

export const createUser = ({ name, email, departmentsWithRoles }: CreateUserRequestDTO) => {
	return http.post<Response>(`/api/users`, {
		name,
		email,
		departmentsWithRoles,
	});
};

export const updateUser = ({ id, name, status, departmentsWithRoles }: UpdateUserRequestDTO) => {
	return http.patch<Response>(`/api/users`, {
		id,
		name,
		status,
		departmentsWithRoles,
	});
};

export const deleteUser = ({ userId }: { userId: string }) => {
	return http.delete<Response>(`/api/users/${userId}`);
};

export const switchUserStatus = ({ userId }: { userId: string }) => {
	return http.patch<Response>(`/api/users/status/${userId}`);
};

export const getUserByEmail = ({ email }: { email: string }) => {
	return http.get<ResponseWrapper<GetUserByEmailResponseDTO>>(`/api/users/email/${email}`);
};

export const getRoleOptions = () => {
	return http.get<ResponseWrapper<GetRoleOptionsResponseDTO>>(`/api/users/role-options`);
};
