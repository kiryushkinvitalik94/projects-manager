import ApiBuilder from "./apiBuilder";
import {
  UserModel,
  LoginResponseType,
  LoginRequestType,
  RegistrationRequestType,
  RegistrationResponseType,
} from "models";

const apiBuilder = new ApiBuilder();

export const getUsersHttpRequest = apiBuilder.get<UserModel[] | []>(
  "/api/users"
);

export const loginHttpRequest = apiBuilder.post<
  LoginRequestType,
  LoginResponseType
>("/api/login");

export const autologinHttpRequest =
  apiBuilder.get<LoginResponseType>("/api/auto-login");

export const registrationHttpRequest = apiBuilder.post<
  RegistrationRequestType,
  RegistrationResponseType
>("/api/registration");
