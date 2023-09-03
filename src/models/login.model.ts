import { UserModel } from "./users.model";

export type LoginResponseType = {
  user: UserModel;
  token: string;
};

export type LoginRequestType = {
  email: string;
  password: string;
};

export type AutoLoginRequestType = {
  token: string;
};
