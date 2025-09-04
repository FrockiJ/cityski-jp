type EnumValues<T> = T[keyof T];

export const OauthProvider = {
  GOOGLE: "google",
  FACEBOOK: "facebook",
  APPLE: "apple",
} as const;

export type OauthProvider = EnumValues<typeof OauthProvider>;

export const MergeAccount = {
  CREATE_ACCOUNT: "CREATE_ACCOUNT",
  MERGE_ACCOUNT: "MERGE_ACCOUNT",
};
export type MergeAccountEnum = EnumValues<typeof MergeAccount>;

export type CreateLineAccount = {
  status: MergeAccountEnum;
  access_token: string;
  id_token: string;
};
