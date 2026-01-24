import { createAppAsyncThunk } from "./with-types";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { CreateThreadActionPayload, Thread } from "~/dto/thread";
import { type RootState } from "./store";
import { getThreads, postThreads } from "~/services/thread";
import type { ToggleLikeResponse } from "~/dto/like";
import type { ReplyThreadMetadata } from "~/dto/reply";
import { logout, selectAuthUser } from "./auth";
import {
  createLikeThread,
  deleteLikeThread,
  threadLikeToggled,
} from "./thread";

// ===== STATES ============

export interface ThreadsState {
  threads: Thread[];
  status: "idle" | "pending" | "succeeded" | "failed"; // useful to render loader while async request
  error: string | null;
}

const initialState: ThreadsState = {
  threads: [],
  status: "idle",
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
      const user = selectAuthUser(thunkApi.getState());
      const status = selectThreadsStatus(thunkApi.getState());
      if (status !== "idle" || !user) {
        return false;
      }
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

// ========= SLICE ==========

const threadsSlice = createSlice({
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

      const thread = state.threads.find((t) => t.id === id);

      if (thread) {
        thread.replies = replies;
      }
    },
  },
  extraReducers(builder) {
    builder

      // ======  GET THREADS =====
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

        state.error = action.error.message ?? "Failed to unlike";
      })

      .addCase(logout, (state) => {
        return initialState;
      })

      .addCase(
        threadLikeToggled,
        (state, action: PayloadAction<ToggleLikeResponse>) => {
          const t = state.threads.find(
            (t) => t.id === action.payload.thread_id,
          );
          if (!t) return;

          t.optimistic = false;
          t.likes = action.payload.likes;
        },
      );
  },
});

export const { threadCreated, threadReplyCreated } = threadsSlice.actions;
export default threadsSlice.reducer;

// ======== THREADS =========
export const selectAllThreads = (state: RootState) => state.threads.threads;
export const selectThreadsById = (id: number) => (state: RootState) =>
  state.threads.threads.find((t) => t.id === id);
export const selectThreadsStatus = (state: RootState) => state.threads.status;
export const selectThreadsError = (state: RootState) => state.threads.error;
