import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth";
import threadReducer from "./thread";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    thread: threadReducer,
  },
});

export type AppStore = typeof store;
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
