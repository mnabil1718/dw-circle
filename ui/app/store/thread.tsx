import { createAppAsyncThunk } from "./with-types";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { CreateThreadActionPayload, Thread } from "~/dto/thread";
import { store, type RootState } from "./store";
import { getThreadById, getThreads, postThreads } from "~/services/thread";
import type { AddLikeDTO, ToggleLikeResponse } from "~/dto/like";
import { postLikeThread } from "~/services/like";
import type { ReplyThreadMetadata } from "~/dto/reply";

export interface ThreadState {
  threads: Thread[];
  thread: Record<number, Thread>;
  listStatus: "idle" | "pending" | "succeeded" | "failed";
  threadStatus: Record<number, "idle" | "pending" | "succeeded" | "failed">;
  error: string | null;
}

const initialState: ThreadState = {
  threads: [],
  thread: {},
  listStatus: "idle",
  threadStatus: {},
  error: null,
};

// ======== THUNKS =========

// GET ALL
export const fetchThreads = createAppAsyncThunk(
  "threads/fetchThreads",
  async () => {
    return await getThreads();
  },
  {
    condition(arg, thunkApi) {
      const status = selectThreadsStatus(thunkApi.getState());
      if (status !== "idle") {
        return false;
      }
    },
  },
);

// GET BY ID
export const fetchThread = createAppAsyncThunk(
  "threads/fetchThread",
  async (id: number) => {
    return await getThreadById(id);
  },
  {
    condition(arg: number, thunkApi) {
      const status = thunkApi.getState().threads.threadStatus[arg] ?? "idle";
      return status === "idle"; // only fetch if this thread hasn't been fetched
    },
  },
);

// CREATE
export const createThread = createAppAsyncThunk(
  "threads/addThreads",
  async (p: CreateThreadActionPayload) => {
    return await postThreads(p.req);
  },
);

// TOGGLE LIKE
export const createLikeThread = createAppAsyncThunk(
  "threads/incLike",
  async (p: AddLikeDTO) => {
    return postLikeThread(p);
  },
);

export const deleteLikeThread = createAppAsyncThunk(
  "threads/decLike",
  async (p: AddLikeDTO) => {
    return postLikeThread(p);
  },
);

// ======= SLICE ========
const threadSlice = createSlice({
  name: "threads",
  initialState,
  reducers: {
    threadCreated(state, action: PayloadAction<Thread>) {
      // Check if optimistic thread exists
      const optimisticIndex = state.threads.findIndex((t) => t.optimistic);
      if (optimisticIndex !== -1) {
        // Replace
        const temp = state.threads[optimisticIndex];

        // revoke, could cause memory leak
        if (temp.image?.startsWith("blob:")) URL.revokeObjectURL(temp.image);

        state.threads[optimisticIndex] = action.payload;
        return;
      }

      // Otherwise, add like normal
      const exists = state.threads.some((t) => t.id === action.payload.id);
      if (!exists) {
        state.threads.unshift(action.payload);
      }
    },
    threadReplyCreated(state, action: PayloadAction<ReplyThreadMetadata>) {
      const { id, replies } = action.payload;

      const listThread = state.threads.find((t) => t.id === id);

      // DO NOT EARLY RETURN IN REDUCER!!!
      if (listThread) {
        listThread.replies = replies;
      }

      // DO NOT EARLY RETURN IN REDUCER!!!
      const active = state.thread[id];
      if (active) {
        active.replies = replies;
      }
    },
    threadLikeToggled(state, action: PayloadAction<ToggleLikeResponse>) {
      const t = state.threads.find((t) => t.id === action.payload.thread_id);
      if (!t) return;

      t.optimistic = false;
      t.likes = action.payload.likes;

      const th = state.thread[action.payload.thread_id];
      if (th) {
        th.optimistic = false;
        th.likes = action.payload.likes;
      }
    },
  },
  extraReducers(builder) {
    builder

      // ======  GET THREADS =====
      .addCase(fetchThreads.pending, (state, _) => {
        state.listStatus = "pending";
      })

      .addCase(fetchThreads.fulfilled, (state, action) => {
        state.listStatus = "succeeded";
        state.threads = action.payload;
      })

      .addCase(fetchThreads.rejected, (state, action) => {
        state.listStatus = "failed";
        state.error = action.error.message ?? "Unknown Error";
      })

      // ======  GET SINGLE THREAD =====
      .addCase(fetchThread.pending, (state, action) => {
        state.threadStatus[action.meta.arg] = "pending";
      })

      .addCase(fetchThread.fulfilled, (state, action) => {
        const t = action.payload;
        state.thread[t.id] = t;
        state.threadStatus[t.id] = "succeeded";
      })

      .addCase(fetchThread.rejected, (state, action) => {
        state.threadStatus[action.meta.arg] = "failed";
        state.error = action.error.message ?? "Unknown Error";
      })

      // ======  CREATE THREAD =====
      .addCase(createThread.pending, (state, action) => {
        const user = action.meta.arg.user;
        state.threads.unshift({
          id: -1, // temp
          content: action.meta.arg.req.content,
          image: action.meta.arg.req.image
            ? URL.createObjectURL(action.meta.arg.req.image)
            : undefined,
          created_at: new Date().toISOString(),
          user: {
            id: -1,
            name: user?.name ?? "amink",
            username: user?.username ?? "amink",
            profile_picture: user?.avatar ?? undefined,
          },
          replies: 0,
          isLiked: false,
          likes: 0,
          optimistic: true,
        });

        state.error = null;
      })

      .addCase(createThread.fulfilled, (state, action) => {
        // HANDLED ON SOCKET EVENT
      })

      .addCase(createThread.rejected, (state, action) => {
        state.threads = state.threads.filter((t) => !t.optimistic);
        state.error = action.error.message ?? "Failed to post";
      })

      // ======  CREATE LIKE =====
      .addCase(createLikeThread.pending, (state, action) => {
        const { tweet_id } = action.meta.arg;
        if (!tweet_id) return;

        // Update in threads array
        const threadInList = state.threads.find((t) => t.id === tweet_id);
        if (threadInList) {
          threadInList.likes++;
          threadInList.isLiked = true;
          threadInList.optimistic = true;
        }

        // Update active thread
        const threadActive = state.thread[tweet_id];
        if (threadActive) {
          threadActive.likes++;
          threadActive.isLiked = true;
          threadActive.optimistic = true;
        }

        state.error = null;
      })
      .addCase(createLikeThread.rejected, (state, action) => {
        const { tweet_id } = action.meta.arg;
        if (!tweet_id) return;

        // Revert in threads array
        const threadInList = state.threads.find((t) => t.id === tweet_id);
        if (threadInList) {
          threadInList.likes--;
          threadInList.isLiked = false;
          threadInList.optimistic = false;
        }

        // Revert active thread
        const threadActive = state.thread[tweet_id];
        if (threadActive) {
          threadActive.likes--;
          threadActive.isLiked = false;
          threadActive.optimistic = false;
        }

        state.error = action.error.message ?? "Failed to like";
      })

      // ======  DELETE LIKE =====
      .addCase(deleteLikeThread.pending, (state, action) => {
        const { tweet_id } = action.meta.arg;
        if (!tweet_id) return;

        const threadInList = state.threads.find((t) => t.id === tweet_id);
        if (threadInList) {
          threadInList.likes--;
          threadInList.isLiked = false;
          threadInList.optimistic = true;
        }

        const threadActive = state.thread[tweet_id];
        if (threadActive) {
          threadActive.likes--;
          threadActive.isLiked = false;
          threadActive.optimistic = true;
        }

        state.error = null;
      })
      .addCase(deleteLikeThread.rejected, (state, action) => {
        const { tweet_id } = action.meta.arg;
        if (!tweet_id) return;

        const threadInList = state.threads.find((t) => t.id === tweet_id);
        if (threadInList) {
          threadInList.likes++;
          threadInList.isLiked = true;
          threadInList.optimistic = false;
        }

        const threadActive = state.thread[tweet_id];
        if (threadActive) {
          threadActive.likes++;
          threadActive.isLiked = true;
          threadActive.optimistic = false;
        }

        state.error = action.error.message ?? "Failed to unlike";
      });
  },
});

export const { threadCreated, threadReplyCreated, threadLikeToggled } =
  threadSlice.actions;
export default threadSlice.reducer;

// ======== THREADS =========
export const selectAllThreads = (state: RootState) => state.threads.threads;
export const selectThreadsById = (id: number) => (state: RootState) =>
  state.threads.threads.find((t) => t.id === id);
export const selectThreadsStatus = (state: RootState) =>
  state.threads.listStatus;
export const selectThreadsError = (state: RootState) => state.threads.error;

// ========  THREAD =========
export const selectThreadById = (id: number) => (state: RootState) =>
  state.threads.thread[id];
export const selectThreadStatus = (id: number) => (state: RootState) =>
  state.threads.threadStatus[id] ?? "idle";
