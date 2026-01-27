import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { createAppAsyncThunk } from "./with-types";
import type { RootState } from "./store";

import type { Thread, CreateThreadActionPayload } from "~/dto/thread";
import type { ToggleLikeResponse } from "~/dto/like";
import type { ReplyThreadMetadata } from "~/dto/reply";

import { getThreads, postThreads } from "~/services/thread";
import { login, selectAuthUser } from "./auth";
import {
  createLikeThread,
  deleteLikeThread,
  threadLikeToggled,
} from "./thread";
import { updateProfile } from "./profile";

/* =======================
   STATE
======================= */

export interface ThreadsState {
  threads: Thread[];
  myThreads: Thread[];
  status: "idle" | "pending" | "succeeded" | "failed";
  error: string | null;
}

const initialState: ThreadsState = {
  threads: [],
  myThreads: [],
  status: "idle",
  error: null,
};

/* =======================
   HELPERS
======================= */

function updateThreadInLists(
  state: ThreadsState,
  threadId: number,
  updater: (t: Thread) => void,
) {
  const t1 = state.threads.find((t) => t.id === threadId);
  if (t1) updater(t1);

  const t2 = state.myThreads.find((t) => t.id === threadId);
  if (t2) updater(t2);
}

/* =======================
   THUNKS
======================= */

// GET ALL
export const fetchThreads = createAppAsyncThunk(
  "threads/fetchThreads",
  async () => {
    return await getThreads();
  },
  {
    condition(_, thunkApi) {
      const user = selectAuthUser(thunkApi.getState());
      const status = selectThreadsStatus(thunkApi.getState());
      if (!user || status !== "idle") return false;
    },
  },
);

// GET MY THREADS
export const fetchMyThreads = createAppAsyncThunk(
  "threads/fetchMyThreads",
  async (userId: number) => {
    return await getThreads(30, userId);
  },
  {
    condition(_, thunkApi) {
      const user = selectAuthUser(thunkApi.getState());
      if (!user) return false;
    },
  },
);

// CREATE THREAD
export const createThread = createAppAsyncThunk(
  "threads/createThread",
  async (p: CreateThreadActionPayload) => {
    return await postThreads(p.req);
  },
);

/* =======================
   SLICE
======================= */

const threadsSlice = createSlice({
  name: "threads",
  initialState,
  reducers: {
    // SOCKET: THREAD CREATED
    threadCreated(state, action: PayloadAction<Thread>) {
      const thread = action.payload;

      // ---- threads ----
      const optimisticIndex = state.threads.findIndex((t) => t.optimistic);
      if (optimisticIndex !== -1) {
        const temp = state.threads[optimisticIndex];
        if (temp.image?.startsWith("blob:")) {
          URL.revokeObjectURL(temp.image);
        }
        state.threads[optimisticIndex] = thread;
      } else if (!state.threads.some((t) => t.id === thread.id)) {
        state.threads.unshift(thread);
      }

      // ---- myThreads ----
      const optimisticMyIndex = state.myThreads.findIndex((t) => t.optimistic);
      if (optimisticMyIndex !== -1) {
        state.myThreads[optimisticMyIndex] = thread;
      } else if (!state.myThreads.some((t) => t.id === thread.id)) {
        state.myThreads.unshift(thread);
      }
    },

    // SOCKET: REPLY CREATED
    threadReplyCreated(state, action: PayloadAction<ReplyThreadMetadata>) {
      const { id, replies } = action.payload;
      updateThreadInLists(state, id, (t) => {
        t.replies = replies;
      });
    },
  },

  extraReducers(builder) {
    builder
      /* ===== FETCH THREADS ===== */
      .addCase(fetchThreads.pending, (state) => {
        state.status = "pending";
      })
      .addCase(fetchThreads.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.threads = action.payload;
      })
      .addCase(fetchThreads.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Failed to fetch threads";
      })

      /* ===== FETCH MY THREADS ===== */
      .addCase(fetchMyThreads.fulfilled, (state, action) => {
        state.myThreads = action.payload;
      })
      .addCase(fetchMyThreads.rejected, (state, action) => {
        state.error = action.error.message ?? "Failed to fetch my threads";
      })

      /* ===== CREATE THREAD (OPTIMISTIC) ===== */
      .addCase(createThread.pending, (state, action) => {
        const user = action.meta.arg.user;
        if (!user) return;

        const optimisticThread: Thread = {
          id: -1,
          content: action.meta.arg.req.content,
          image: action.meta.arg.req.image
            ? URL.createObjectURL(action.meta.arg.req.image)
            : undefined,
          created_at: new Date().toISOString(),
          user: {
            id: user.user_id,
            name: user.name,
            username: user.username,
            profile_picture: user.avatar,
          },
          replies: 0,
          likes: 0,
          isLiked: false,
          optimistic: true,
        };

        state.threads.unshift(optimisticThread);
        state.myThreads.unshift(optimisticThread);
      })
      .addCase(createThread.rejected, (state, action) => {
        state.threads = state.threads.filter((t) => !t.optimistic);
        state.myThreads = state.myThreads.filter((t) => !t.optimistic);
        state.error = action.error.message ?? "Failed to create thread";
      })

      /* ===== LIKE THREAD ===== */
      .addCase(createLikeThread.pending, (state, action) => {
        const { tweet_id } = action.meta.arg;
        if (!tweet_id) return;

        updateThreadInLists(state, tweet_id, (t) => {
          t.likes++;
          t.isLiked = true;
          t.optimistic = true;
        });
      })
      .addCase(createLikeThread.rejected, (state, action) => {
        const { tweet_id } = action.meta.arg;
        if (!tweet_id) return;

        updateThreadInLists(state, tweet_id, (t) => {
          t.likes--;
          t.isLiked = false;
          t.optimistic = false;
        });
      })

      /* ===== UNLIKE THREAD ===== */
      .addCase(deleteLikeThread.pending, (state, action) => {
        const { tweet_id } = action.meta.arg;
        if (!tweet_id) return;

        updateThreadInLists(state, tweet_id, (t) => {
          t.likes--;
          t.isLiked = false;
          t.optimistic = true;
        });
      })
      .addCase(deleteLikeThread.rejected, (state, action) => {
        const { tweet_id } = action.meta.arg;
        if (!tweet_id) return;

        updateThreadInLists(state, tweet_id, (t) => {
          t.likes++;
          t.isLiked = true;
          t.optimistic = false;
        });
      })

      /* ===== SOCKET LIKE TOGGLE ===== */
      .addCase(
        threadLikeToggled,
        (state, action: PayloadAction<ToggleLikeResponse>) => {
          updateThreadInLists(state, action.payload.thread_id, (t) => {
            t.likes = action.payload.likes;
            t.optimistic = false;
          });
        },
      )

      /* ===== PROFILE UPDATE ===== */
      .addCase(updateProfile.fulfilled, (state, action) => {
        const { id, avatar } = action.payload;

        const updateAvatar = (t: Thread) => {
          if (t.user.id === id) {
            t.user.profile_picture = avatar;
          }
        };

        state.threads.forEach(updateAvatar);
        state.myThreads.forEach(updateAvatar);
      })

      /* ===== LOGOUT ===== */
      .addCase(login, () => initialState);
  },
});

export const { threadCreated, threadReplyCreated } = threadsSlice.actions;
export default threadsSlice.reducer;

/* =======================
   SELECTORS
======================= */

export const selectAllThreads = (state: RootState) => state.threads.threads;
export const selectThreadsById = (id: number) => (state: RootState) =>
  state.threads.threads.find((f) => f.id === id);
export const selectMyThreads = (state: RootState) => state.threads.myThreads;
export const selectMyImages = (state: RootState) =>
  state.threads.myThreads.filter((t) => !!t.image);
export const selectThreadsStatus = (state: RootState) => state.threads.status;
export const selectThreadsError = (state: RootState) => state.threads.error;
