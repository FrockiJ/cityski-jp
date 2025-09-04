import {
	CreateRoleRequestDTO,
	GetRoleDetailResponseDTO,
	GetRolesResponseDTO,
	Response,
	ResponseWrapper,
	ResWithPaginationDTO,
	UpdateRoleRequestDTO,
} from '@repo/shared';

import http from '@/utils/http/instance';

export const switchRoleStatus = ({ roleId }: { roleId: string }) => {
	return http.patch<Response>(`/api/roles/status/${roleId}`);
};

export const deleteRole = ({ roleId }: { roleId: string }) => {
	return http.delete<Response>(`/api/roles/${roleId}`);
};

export const createRole = ({ name, menuIds }: CreateRoleRequestDTO) => {
	return http.post<Response>(`/api/roles`, {
		name,
		menuIds,
	});
};

export const getRoles = () => {
	return http.get<ResponseWrapper<ResWithPaginationDTO<GetRolesResponseDTO[]>>>(`/api/roles`);
};

export const getRoleDetail = ({ roleId }: { roleId: string }) => {
	return http.get<ResponseWrapper<GetRoleDetailResponseDTO>>(`/api/roles/detail/${roleId}`);
};

export const updateRole = ({ name, menuIds, id }: UpdateRoleRequestDTO) => {
	return http.patch<Response>(`/api/roles`, {
		id,
		name,
		menuIds,
	});
};
