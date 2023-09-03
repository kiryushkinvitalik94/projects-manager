import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserModel, LoginRequestType, RegistrationRequestType } from "models";

interface AuthState {
  isAuthenticated: boolean;
  user: null | UserModel;
  token: string | null;
  loading: boolean;
  error: string | null;
  isAutoLoggingIn: boolean;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  token: null,
  loading: false,
  error: "",
  isAutoLoggingIn: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (
      state,
      action: PayloadAction<{ user: UserModel; token: string } | null>
    ) => {
      state.isAuthenticated = !!action.payload;
      state.user = action.payload?.user || null;
      state.token = action.payload?.token || null;
      state.loading = false;
      state.isAutoLoggingIn = false;
    },
    autoLogin: (state, action: PayloadAction<string>) => {
      state.isAutoLoggingIn = true;
      state.loading = true;
    },
    authError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearUser: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
    },
    login: (state, action: PayloadAction<LoginRequestType>) => {
      state.loading = true;
      state.error = "";
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
    },
    registration: (state, action: PayloadAction<RegistrationRequestType>) => {
      state.loading = true;
      state.error = "";
    },
    clearAuthError(state) {
      state.error = null;
    },
  },
});

export const {
  login,
  setUser,
  authError,
  clearUser,
  logout,
  registration,
  autoLogin,
  clearAuthError,
} = authSlice.actions;

export default authSlice.reducer;
