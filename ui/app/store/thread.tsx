import type { Thread } from "~/dto/thread";
import { createAppAsyncThunk } from "./with-types";
import { getThreadById } from "~/services/thread";
import { login, logout, selectAuthUser } from "./auth";
import type { RootState } from "./store";
import type { AddLikeDTO, ToggleLikeResponse } from "~/dto/like";
import { postLikeThread } from "~/services/like";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { threadReplyCreated } from "./threads";
import type { ReplyThreadMetadata } from "~/dto/reply";
import { updateProfile } from "./profile";

export interface ThreadState {
  thread: Thread | null;
  status: "idle" | "pending" | "succeeded" | "failed";
  error: string | null;
}

// ========= STATES ============

const initialState: ThreadState = {
  thread: null,
  status: "idle",
  error: null,
};

// ======== THUNKS =========

// GET BY ID
export const fetchThread = createAppAsyncThunk(
  "thread/fetchThread",
  async (id: number) => {
    return await getThreadById(id);
  },
  {
    condition(arg: number, thunkApi) {
      const user = selectAuthUser(thunkApi.getState());
      const status = selectThreadStatus(thunkApi.getState());
      if (status !== "idle" || !user) {
        return false;
      }
    },
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

// =========== SLICE ============
const threadSlice = createSlice({
  name: "thread",
  initialState,
  reducers: {
    threadLikeToggled(state, action: PayloadAction<ToggleLikeResponse>) {
      const t = state.thread;
      if (t && t.id === action.payload.thread_id) {
        if (t.optimistic !== undefined) t.optimistic = false;
        t.likes = action.payload.likes;
      }
    },
    resetThread(state) {
      return initialState;
    },
  },
  extraReducers(builder) {
    builder

      // ======  GET SINGLE THREAD =====
      .addCase(fetchThread.pending, (state, action) => {
        state.status = "pending";
        state.error = null;
      })

      .addCase(fetchThread.fulfilled, (state, action) => {
        const t = action.payload;
        state.thread = t;
        state.status = "succeeded";
      })

      .addCase(fetchThread.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Unknown Error";
      })

      // ======  CREATE LIKE =====
      .addCase(createLikeThread.pending, (state, action) => {
        const { tweet_id } = action.meta.arg;
        if (!tweet_id) return;

        // Update active thread
        const t = state.thread;
        if (t && t.id === tweet_id) {
          t.likes++;
          t.isLiked = true;
          t.optimistic = true;
        }

        state.error = null;
      })
      .addCase(createLikeThread.rejected, (state, action) => {
        const { tweet_id } = action.meta.arg;
        if (!tweet_id) return;

        // Revert active thread
        const t = state.thread;
        if (t && t.id === tweet_id) {
          t.likes--;
          t.isLiked = false;
          t.optimistic = false;
        }

        state.error = action.error.message ?? "Failed to like";
      })

      // ======  DELETE LIKE =====
      .addCase(deleteLikeThread.pending, (state, action) => {
        const { tweet_id } = action.meta.arg;
        if (!tweet_id) return;

        const t = state.thread;
        if (t && t.id === tweet_id) {
          t.likes--;
          t.isLiked = false;
          t.optimistic = true;
        }

        state.error = null;
      })
      .addCase(deleteLikeThread.rejected, (state, action) => {
        const { tweet_id } = action.meta.arg;
        if (!tweet_id) return;

        const t = state.thread;
        if (t && t.id === tweet_id) {
          t.likes++;
          t.isLiked = true;
          t.optimistic = false;
        }

        state.error = action.error.message ?? "Failed to unlike";
      })

      .addCase(login, (state) => {
        return initialState;
      })

      .addCase(
        threadReplyCreated,
        (state, action: PayloadAction<ReplyThreadMetadata>) => {
          const { id, replies } = action.payload;

          // DO NOT EARLY RETURN IN REDUCER!!!
          const t = state.thread;
          if (t && t.id === id) {
            t.replies = replies;
          }
        },
      )

      .addCase(updateProfile.fulfilled, (state, action) => {
        const { id, name, username, avatar } = action.payload;
        if (state.thread && state.thread.user.id === id) {
          state.thread.user.name = name;
          state.thread.user.username = username;
          if (avatar) state.thread.user.profile_picture = avatar;
        }
      });
  },
});

// ==========  REDUCER ============
export const { threadLikeToggled, resetThread } = threadSlice.actions;
export default threadSlice.reducer;

// =========== SELECT ============
export const selectThread = (state: RootState) => state.thread.thread;
export const selectThreadStatus = (state: RootState) => state.thread.status;
export const selectThreadError = (state: RootState) => state.thread.error;
