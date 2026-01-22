import { createAppAsyncThunk } from "./with-types";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { type RootState } from "./store";
import type { CreateReplyActionPayload, Reply } from "~/dto/reply";
import { getReplies, postReply } from "~/services/reply";

export interface ReplyState {
  replies: Reply[];
  listStatus: "idle" | "pending" | "succeeded" | "failed";
  error: string | null;
}

const initialState: ReplyState = {
  replies: [],
  listStatus: "idle",
  error: null,
};

// ======== THUNKS =========

// GET ALL
export const fetchReplies = createAppAsyncThunk(
  "replies/fetchReplies",
  async (threadId: number) => {
    return await getReplies(threadId);
  },
  {
    condition(arg, thunkApi) {
      const status = selectRepliesStatus(thunkApi.getState());
      if (status !== "idle") {
        return false;
      }
    },
  },
);

// CREATE
export const createReply = createAppAsyncThunk(
  "replies/addReplies",
  async (p: CreateReplyActionPayload) => {
    return await postReply(p);
  },
);

// TOGGLE LIKE
// export const createLikeThread = createAppAsyncThunk(
//   "threads/incLike",
//   async (p: AddLikeDTO) => {
//     return postLikeThread(p);
//   },
// );

// export const deleteLikeThread = createAppAsyncThunk(
//   "threads/decLike",
//   async (p: AddLikeDTO) => {
//     return postLikeThread(p);
//   },
// );

// ======= SLICE ========
const replySlice = createSlice({
  name: "replies",
  initialState,
  reducers: {
    // threadCreated(state, action: PayloadAction<Thread>) {
    //   // Check if optimistic thread exists
    //   const optimisticIndex = state.threads.findIndex((t) => t.optimistic);
    //   if (optimisticIndex !== -1) {
    //     // Replace
    //     const temp = state.threads[optimisticIndex];
    //     // revoke, could cause memory leak
    //     if (temp.image?.startsWith("blob:")) URL.revokeObjectURL(temp.image);
    //     state.threads[optimisticIndex] = action.payload;
    //     return;
    //   }
    //   // Otherwise, add like normal
    //   const exists = state.threads.some((t) => t.id === action.payload.id);
    //   if (!exists) {
    //     state.threads.unshift(action.payload);
    //   }
    // },
    // likeToggled(state, action: PayloadAction<ToggleLikeResponse>) {
    //   const t = state.threads.find((t) => t.id === action.payload.thread_id);
    //   if (!t) return;
    //   t.optimistic = false;
    //   t.likes = action.payload.likes;
    // },
  },
  extraReducers(builder) {
    builder

      // ======  GET THREADS =====
      .addCase(fetchReplies.pending, (state, _) => {
        state.listStatus = "pending";
      })

      .addCase(fetchReplies.fulfilled, (state, action) => {
        state.listStatus = "succeeded";
        state.replies = action.payload;
      })

      .addCase(fetchReplies.rejected, (state, action) => {
        state.listStatus = "failed";
        state.error = action.error.message ?? "Unknown Error";
      })

      // ======  GET SINGLE THREAD =====
      //   .addCase(fetchThread.pending, (state, action) => {
      //     state.threadStatus[action.meta.arg] = "pending";
      //   })

      //   .addCase(fetchThread.fulfilled, (state, action) => {
      //     const t = action.payload;
      //     state.thread[t.id] = t;
      //     state.threadStatus[t.id] = "succeeded";
      //   })

      //   .addCase(fetchThread.rejected, (state, action) => {
      //     state.threadStatus[action.meta.arg] = "failed";
      //     state.error = action.error.message ?? "Unknown Error";
      //   })

      // ======  CREATE REPLY =====
      .addCase(createReply.pending, (state, action) => {
        const user = action.meta.arg.user;
        state.replies.unshift({
          id: -1, // temp
          thread_id: -1,
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

      .addCase(createReply.fulfilled, (state, action) => {
        const index = state.replies.findIndex((t) => t.optimistic);
        if (index !== -1) {
          const temp = state.replies[index];

          // Revoke local blob URL if needed
          if (temp.image?.startsWith("blob:")) URL.revokeObjectURL(temp.image);

          state.replies[index] = action.payload;
        }
      })

      .addCase(createReply.rejected, (state, action) => {
        state.replies = state.replies.filter((r) => !r.optimistic);
        state.error = action.error.message ?? "Failed to reply";
      });

    //   // ======  CREATE LIKE =====
    //   .addCase(createLikeThread.pending, (state, action) => {
    //     const { tweet_id } = action.meta.arg;
    //     if (!tweet_id) return;

    //     // Update in threads array
    //     const threadInList = state.threads.find((t) => t.id === tweet_id);
    //     if (threadInList) {
    //       threadInList.likes++;
    //       threadInList.isLiked = true;
    //       threadInList.optimistic = true;
    //     }

    //     // Update active thread
    //     const threadActive = state.thread[tweet_id];
    //     if (threadActive) {
    //       threadActive.likes++;
    //       threadActive.isLiked = true;
    //       threadActive.optimistic = true;
    //     }

    //     state.error = null;
    //   })
    //   .addCase(createLikeThread.rejected, (state, action) => {
    //     const { tweet_id } = action.meta.arg;
    //     if (!tweet_id) return;

    //     // Revert in threads array
    //     const threadInList = state.threads.find((t) => t.id === tweet_id);
    //     if (threadInList) {
    //       threadInList.likes--;
    //       threadInList.isLiked = false;
    //       threadInList.optimistic = false;
    //     }

    //     // Revert active thread
    //     const threadActive = state.thread[tweet_id];
    //     if (threadActive) {
    //       threadActive.likes--;
    //       threadActive.isLiked = false;
    //       threadActive.optimistic = false;
    //     }

    //     state.error = action.error.message ?? "Failed to like";
    //   })

    //   // ======  DELETE LIKE =====
    //   .addCase(deleteLikeThread.pending, (state, action) => {
    //     const { tweet_id } = action.meta.arg;
    //     if (!tweet_id) return;

    //     const threadInList = state.threads.find((t) => t.id === tweet_id);
    //     if (threadInList) {
    //       threadInList.likes--;
    //       threadInList.isLiked = false;
    //       threadInList.optimistic = true;
    //     }

    //     const threadActive = state.thread[tweet_id];
    //     if (threadActive) {
    //       threadActive.likes--;
    //       threadActive.isLiked = false;
    //       threadActive.optimistic = true;
    //     }

    //     state.error = null;
    //   })
    //   .addCase(deleteLikeThread.rejected, (state, action) => {
    //     const { tweet_id } = action.meta.arg;
    //     if (!tweet_id) return;

    //     const threadInList = state.threads.find((t) => t.id === tweet_id);
    //     if (threadInList) {
    //       threadInList.likes++;
    //       threadInList.isLiked = true;
    //       threadInList.optimistic = false;
    //     }

    //     const threadActive = state.thread[tweet_id];
    //     if (threadActive) {
    //       threadActive.likes++;
    //       threadActive.isLiked = true;
    //       threadActive.optimistic = false;
    //     }

    //     state.error = action.error.message ?? "Failed to unlike";
    //   });
  },
});

export const {} = replySlice.actions;
export default replySlice.reducer;

// ======== THREADS =========
export const selectAllReplies = (state: RootState) => state.replies.replies;
export const selectRepliesById = (id: number) => (state: RootState) =>
  state.replies.replies.find((r) => r.id === id);
export const selectRepliesStatus = (state: RootState) =>
  state.threads.listStatus;
export const selectRepliesError = (state: RootState) => state.replies.error;
