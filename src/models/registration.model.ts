import { UserModel } from "./users.model";

export type RegistrationRequestType = {
  email: string;
  password: string;
  username: string;
};

export type RegistrationResponseType = {
  token: string;
  user: UserModel;
};
