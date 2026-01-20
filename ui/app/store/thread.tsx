import { createSlice } from "@reduxjs/toolkit";
import { dummyThreads } from "~/data/threads";
import type { Thread } from "~/dto/thread";
import type { RootState } from "./store";
import { createAppAsyncThunk } from "./with-types";
import { getThreads } from "~/services/thread";

export interface ThreadState {
  threads: Thread[];
  status: "idle" | "pending" | "succeeded" | "failed";
  error: string | null;
}

const initialState: ThreadState = {
  threads: dummyThreads,
  status: "idle",
  error: null,
};

export const fetchThreads = createAppAsyncThunk(
  "threads/fetchThreads",
  async () => {
    return dummyThreads;
  },
);

const threadSlice = createSlice({
  name: "threads",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchThreads.pending, (state, _) => {
        state.status = "pending";
      })
      .addCase(fetchThreads.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.threads = action.payload;
      })
      .addCase(fetchThreads.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Unknown Error";
      });
  },
});

export const {} = threadSlice.actions;
export default threadSlice.reducer;

export const selectAllThreads = (state: RootState) => state.threads.threads;
export const selectThreadsStatus = (state: RootState) => state.threads.status;
export const selectThreadsError = (state: RootState) => state.threads.error;
