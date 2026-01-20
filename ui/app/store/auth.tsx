import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { UserLoginResponse } from '~/dto/auth';

export interface AuthState {
    user: UserLoginResponse | null;
}

// local storage
export function loadAuthFromStorage() {
    if (typeof window === "undefined") return null;
    const item = localStorage.getItem("auth");
    if (item) {
        return JSON.parse(item);
    }
    return null;
}

const initialState: AuthState = {
    user: loadAuthFromStorage(),
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login(state, action: PayloadAction<UserLoginResponse>) {
            state.user = action.payload;
            localStorage.setItem("auth", JSON.stringify(action.payload));
        }
    }
});


export const { login } = authSlice.actions
export default authSlice.reducer
