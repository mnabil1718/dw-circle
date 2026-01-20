import { createSlice } from "@reduxjs/toolkit";
import { dummyThreads } from "~/data/threads";
import type { Thread } from "~/dto/thread";

export interface ThreadState {
  threads: Thread[];
}

const initialState: ThreadState = {
  threads: dummyThreads,
};

const threadSlice = createSlice({
  name: "thread",
  initialState,
  reducers: {},
});

export const {} = threadSlice.actions;
export default threadSlice.reducer;
