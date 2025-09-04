export type JwtSignPayload = {
  sub: string;
  username: string;
  userType: string;
};

export type JwtForgotPayload = {
  sub: string;
  email: string;
};

// -- Line Types --

export type LineProfileRes = {
  userId: string;
  displayName: string;
  pictureUrl: string;
};

export type CreateLineMember = {
  lineId: string;
  lineName: string;
  avatar: string;
  name: string;
  birthday: string;
  phone: string;
  email: string;
};

// -- End Line Types
