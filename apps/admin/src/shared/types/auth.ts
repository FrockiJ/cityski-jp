export type AuthenticatedObj = {
	authenticated: boolean;
	token?: string;
};

export type UserAuthenticated = (token: string) => AuthenticatedObj;

export type Permissions = {
	view: boolean;
	edit: boolean;
};

export interface PermissionsProps {
	permissions?: Permissions;
}
