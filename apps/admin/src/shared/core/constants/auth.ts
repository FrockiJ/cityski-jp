type EnumValues<T> = T[keyof T];

export const OauthProvider = {
	GOOGLE: 'google',
	FACEBOOK: 'facebook',
	APPLE: 'apple',
} as const;

export type OauthProvider = EnumValues<typeof OauthProvider>;
