import { createAppAsyncThunk } from "./with-types";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { dummyThreads } from "~/data/threads";
import type {
  CreateThreadActionPayload,
  CreateThreadDTO,
  CreateThreadResponse,
  Thread,
} from "~/dto/thread";
import type { RootState } from "./store";
import { getThreads, postThreads } from "~/services/thread";
import { selectAuthUser } from "./auth";
import type { UserLoginResponse } from "~/dto/auth";
import type { AddLikeDTO } from "~/dto/like";
import { postLikeThread } from "~/services/like";

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
  reducers: {},
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

          // revoke, could cause memory leak
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
        // TODO
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
        // TODO
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

export const {} = threadSlice.actions;
export default threadSlice.reducer;

export const selectAllThreads = (state: RootState) => state.threads.threads;
export const selectThreadById = (id: number) => (state: RootState) =>
  state.threads.threads.find((t) => t.id === id);
export const selectThreadsStatus = (state: RootState) => state.threads.status;
export const selectThreadsError = (state: RootState) => state.threads.error;
