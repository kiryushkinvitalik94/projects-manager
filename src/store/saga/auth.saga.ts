// authSaga.ts
import { call, put, takeLatest, all } from "redux-saga/effects";
import {
  setUser,
  clearUser,
  login,
  logout,
  authError,
  registration,
  autoLogin,
  clearProjectsStore,
} from "store/reducers";
import { PayloadAction } from "@reduxjs/toolkit";
import { LoginRequestType, UserModel } from "models";
import {
  loginHttpRequest,
  autologinHttpRequest,
  registrationHttpRequest,
} from "api";

const JWT_TOKEN_ITEM_NAME = "jwtToken";

function saveTokenToLocalStorage(token: string) {
  localStorage.setItem(JWT_TOKEN_ITEM_NAME, token);
}

function removeTokenFromLocalStorage() {
  localStorage.removeItem(JWT_TOKEN_ITEM_NAME);
}

export function getTokenFromLocalStorage() {
  return localStorage.getItem(JWT_TOKEN_ITEM_NAME);
}

function* setTokenAndUser(action) {
  const { token, user } = action.payload;
  yield call(saveTokenToLocalStorage, token);
  yield put(setUser({ token, user }));
}

function* registrationRequest(action) {
  const { username, email, password } = action.payload;
  try {
    const data = yield registrationHttpRequest({
      username,
      email,
      password,
    });
    yield setTokenAndUser({ payload: data });
  } catch (error) {
    yield put(authError(error.message));
  }
}

function* clearTokenAndUser() {
  yield call(removeTokenFromLocalStorage);
  yield put(clearProjectsStore());
  yield put(clearUser());
}

function* loginRequest(action: PayloadAction<LoginRequestType>) {
  const { email, password } = action.payload;
  try {
    const data = yield call(loginHttpRequest, { email, password });
    yield setTokenAndUser({ payload: data });
  } catch (error) {
    yield put(authError(error.message));
  }
}

function* autoLoginRequest(action) {
  try {
    if (action.payload) {
      const data = yield autologinHttpRequest(action.payload);
      yield setTokenAndUser({ payload: data });
    }
  } catch (error) {
    yield put(authError(error.message));
  }
}

function* watchAuthentication() {
  yield takeLatest(login.type, loginRequest);
  yield takeLatest(logout.type, clearTokenAndUser);
  yield takeLatest(registration.type, registrationRequest);
  yield takeLatest(autoLogin.type, autoLoginRequest);
}

export default function* authSaga() {
  yield all([watchAuthentication()]);
}
