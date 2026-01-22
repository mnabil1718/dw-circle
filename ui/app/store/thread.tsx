import { createAppAsyncThunk } from "./with-types";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { dummyThreads } from "~/data/threads";
import type { CreateThreadActionPayload, Thread } from "~/dto/thread";
import { store, type RootState } from "./store";
import { getThreads, postThreads } from "~/services/thread";
import type { AddLikeDTO, ToggleLikeResponse } from "~/dto/like";
import { postLikeThread } from "~/services/like";
import { selectAuthUser } from "./auth";

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
    likeToggled(state, action: PayloadAction<ToggleLikeResponse>) {
      const t = state.threads.find((t) => t.id === action.payload.thread_id);
      if (!t) return;

      t.optimistic = false;
      t.likes = action.payload.likes;
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
        const index = state.threads.findIndex((t) => t.optimistic);
        if (index !== -1) {
          const temp = state.threads[index];

          // Revoke local blob URL if needed
          if (temp.image?.startsWith("blob:")) URL.revokeObjectURL(temp.image);

          state.threads[index] = action.payload;
        }
      })

      .addCase(createThread.rejected, (state, action) => {
        state.threads = state.threads.filter((t) => !t.optimistic);
        state.error = action.error.message ?? "Failed to post";
      })

      // ======  CREATE LIKE =====
      .addCase(createLikeThread.pending, (state, action) => {
        const { user_id, tweet_id } = action.meta.arg;

        // guard
        if (!user_id || !tweet_id) return;

        const thread = state.threads.find(
          (t) => t.id === action.meta.arg.tweet_id,
        );
        if (thread) {
          thread.likes++;
          thread.isLiked = true;
          thread.optimistic = true;
        }

        state.error = null;
      })

      .addCase(createLikeThread.fulfilled, (state, action) => {
        // KEEP EMPTY, HANDLED IN SOCKET LISTENER
      })

      .addCase(createLikeThread.rejected, (state, action) => {
        const thread = state.threads.find(
          (t) => t.id === action.meta.arg.tweet_id,
        );

        if (thread) {
          thread.likes--;
          thread.isLiked = false;
          thread.optimistic = false;
        }
        state.error = action.error.message ?? "Failed to like";
      })

      // ======  DELETE LIKE =====
      .addCase(deleteLikeThread.pending, (state, action) => {
        const { user_id, tweet_id } = action.meta.arg;
        // guard
        if (!user_id || !tweet_id) return;

        const thread = state.threads.find(
          (t) => t.id === action.meta.arg.tweet_id,
        );

        if (thread) {
          thread.likes--;
          thread.isLiked = false;
          thread.optimistic = true;
        }
        state.error = null;
      })

      .addCase(deleteLikeThread.fulfilled, (state, action) => {
        // KEEP EMPTY, HANDLED IN SOCKET LISTENER
      })

      .addCase(deleteLikeThread.rejected, (state, action) => {
        const thread = state.threads.find(
          (t) => t.id === action.meta.arg.tweet_id,
        );

        if (thread) {
          thread.likes++;
          thread.isLiked = true;
          thread.optimistic = false;
        }
        state.error = action.error.message ?? "Failed to unlike";
      });
  },
});

export const { threadCreated, likeToggled } = threadSlice.actions;
export default threadSlice.reducer;

export const selectAllThreads = (state: RootState) => state.threads.threads;
export const selectThreadById = (id: number) => (state: RootState) =>
  state.threads.threads.find((t) => t.id === id);
export const selectThreadsStatus = (state: RootState) => state.threads.status;
export const selectThreadsError = (state: RootState) => state.threads.error;
