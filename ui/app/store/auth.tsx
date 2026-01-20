import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { UserLoginResponse } from "~/dto/auth";

export interface AuthState {
  user: UserLoginResponse | null;
}

const LOCAL_STORAGE_KEY = "store:auth";

// local storage
export function loadAuthFromStorage() {
  if (typeof window === "undefined") return null;
  const item = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (item) {
    return JSON.parse(item);
  }
  return null;
}

const initialState: AuthState = {
  user: loadAuthFromStorage(),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, action: PayloadAction<UserLoginResponse>) {
      state.user = action.payload;
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(action.payload));
    },
    logout(state) {
      state.user = null;
      if (typeof window !== "undefined")
        localStorage.removeItem(LOCAL_STORAGE_KEY);
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
