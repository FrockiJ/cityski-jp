type EnumValues<T> = T[keyof T];

export const CheckFor = {
  EXISTS: 'exists',
  NOT_EXISTS: 'not exists',
} as const;

export type CheckForEnum = EnumValues<typeof CheckFor>;
