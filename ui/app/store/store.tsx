import {
  configureStore,
  type Action,
  type ThunkAction,
} from "@reduxjs/toolkit";
import authReducer from "./auth";
import threadsReducer from "./threads";
import threadReducer from "./thread";
import replyReducer from "./reply";
import profileReducer from "./profile";
import followsReducer from "./follow";
import searchReducer from "./search";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    threads: threadsReducer,
    thread: threadReducer,
    replies: replyReducer,
    profile: profileReducer,
    follows: followsReducer,
    search: searchReducer,
  },
});

export type AppStore = typeof store;
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk = ThunkAction<void, RootState, unknown, Action>;
