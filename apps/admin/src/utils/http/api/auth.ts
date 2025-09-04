import {
	ForgotRequestDTO,
	GetPermissionRequestDTO,
	GetPermissionResponseDTO,
	Response,
	ResponseWrapper,
	SignInRequestDTO,
	SignInResponseDTO,
	UpdatePasswordByForgotRequestDTO,
	UpdatePasswordRequestDTO,
} from '@repo/shared';

import http from '@/utils/http/instance';

export const signin = ({ email, password }: SignInRequestDTO) => {
	return http.post<ResponseWrapper<SignInResponseDTO>>(`/api/auth/signin`, {
		email,
		password,
	});
};

export const signOut = () => {
	return http.get<Response>(`/api/auth/sign-out`);
};

export const userPermission = ({ departmentId }: GetPermissionRequestDTO) => {
	return http.post<ResponseWrapper<GetPermissionResponseDTO>>(`/api/auth/user-permission`, {
		departmentId,
	});
};

export const updatePassword = ({ oldPassword, newPassword, repeatNewPassword }: UpdatePasswordRequestDTO) => {
	return http.patch<ResponseWrapper<any>>(`/api/auth/update-password`, {
		oldPassword,
		newPassword,
		repeatNewPassword,
	});
};

export const forgotPassword = ({ email, token }: ForgotRequestDTO) => {
	return http.post<Response>(`/api/auth/forgot`, {
		email,
		token,
		eitherEmailOrToken: true,
	});
};

export const checkResetToken = (token: string) => {
	return http.get<Response>(`/api/auth/check-reset-token/${token}`);
};

export const updatePasswordByForgot = ({ newPassword, repeatNewPassword, token }: UpdatePasswordByForgotRequestDTO) => {
	return http.patch<ResponseWrapper<any>>(`/api/auth/update-password-by-forgot`, {
		newPassword,
		repeatNewPassword,
		token,
	});
};
