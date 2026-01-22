import { createAppAsyncThunk } from "./with-types";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { type RootState } from "./store";
import type { CreateReplyActionPayload, Reply } from "~/dto/reply";
import { getReplies, postReply } from "~/services/reply";
import type { AddReplyLikeDTO, ToggleReplyLikeResponse } from "~/dto/like";
import { postLikeReply } from "~/services/like";

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
export const createLikeReply = createAppAsyncThunk(
  "replies/incLike",
  async (p: AddReplyLikeDTO) => {
    return postLikeReply(p);
  },
);

export const deleteLikeReply = createAppAsyncThunk(
  "replies/decLike",
  async (p: AddReplyLikeDTO) => {
    return postLikeReply(p);
  },
);

// ======= SLICE ========
const replySlice = createSlice({
  name: "replies",
  initialState,
  reducers: {
    replyCreated(state, action: PayloadAction<Reply>) {
      // Check if optimistic reply exists
      const optimisticIndex = state.replies.findIndex((r) => r.optimistic);
      if (optimisticIndex !== -1) {
        // Replace
        const temp = state.replies[optimisticIndex];
        // revoke, could cause memory leak
        if (temp.image?.startsWith("blob:")) URL.revokeObjectURL(temp.image);
        state.replies[optimisticIndex] = action.payload;
        return;
      }
      // Otherwise, add like normal
      const exists = state.replies.some((r) => r.id === action.payload.id);
      if (!exists) {
        state.replies.unshift(action.payload);
      }
    },
    replyLikeToggled(state, action: PayloadAction<ToggleReplyLikeResponse>) {
      const r = state.replies.find((r) => r.id === action.payload.reply_id);
      if (!r) return;
      r.optimistic = false;
      r.likes = action.payload.likes;
    },
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
        // HANDLED BY SOCKET DISPATCH
      })

      .addCase(createReply.rejected, (state, action) => {
        state.replies = state.replies.filter((r) => !r.optimistic);
        state.error = action.error.message ?? "Failed to reply";
      })

      //   // ======  CREATE LIKE =====
      .addCase(createLikeReply.pending, (state, action) => {
        const { reply_id } = action.meta.arg;
        if (!reply_id) return;

        const replyInList = state.replies.find((r) => r.id === reply_id);
        if (replyInList) {
          replyInList.likes++;
          replyInList.isLiked = true;
          replyInList.optimistic = true;
        }

        state.error = null;
      })
      .addCase(createLikeReply.rejected, (state, action) => {
        const { reply_id } = action.meta.arg;
        if (!reply_id) return;

        // Revert in array
        const reply = state.replies.find((r) => r.id === reply_id);
        if (reply) {
          reply.likes--;
          reply.isLiked = false;
          reply.optimistic = false;
        }

        state.error = action.error.message ?? "Failed to like";
      })

      // ======  DELETE LIKE =====
      .addCase(deleteLikeReply.pending, (state, action) => {
        const { reply_id } = action.meta.arg;
        if (!reply_id) return;

        const reply = state.replies.find((r) => r.id === reply_id);
        if (reply) {
          reply.likes--;
          reply.isLiked = false;
          reply.optimistic = true;
        }

        state.error = null;
      })
      .addCase(deleteLikeReply.rejected, (state, action) => {
        const { reply_id } = action.meta.arg;
        if (!reply_id) return;

        const reply = state.replies.find((r) => r.id === reply_id);
        if (reply) {
          reply.likes++;
          reply.isLiked = true;
          reply.optimistic = false;
        }

        state.error = action.error.message ?? "Failed to unlike";
      });
  },
});

export const { replyLikeToggled, replyCreated } = replySlice.actions;
export default replySlice.reducer;

// ======== THREADS =========
export const selectAllReplies = (state: RootState) => state.replies.replies;
export const selectRepliesById = (id: number) => (state: RootState) =>
  state.replies.replies.find((r) => r.id === id);
export const selectRepliesStatus = (state: RootState) =>
  state.replies.listStatus;
export const selectRepliesError = (state: RootState) => state.replies.error;
