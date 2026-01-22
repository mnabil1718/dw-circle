import {
  configureStore,
  type Action,
  type ThunkAction,
} from "@reduxjs/toolkit";
import authReducer from "./auth";
import threadReducer from "./thread";
import replyReducer from "./reply";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    threads: threadReducer,
    replies: replyReducer,
  },
});

export type AppStore = typeof store;
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk = ThunkAction<void, RootState, unknown, Action>;
