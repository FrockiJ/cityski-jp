// *** User Roles ***
const roles = ['user', 'admin'] as const;

export type Role = (typeof roles)[number];
export const RoleUser = roles[0];
export const RoleAdmin = roles[1];
