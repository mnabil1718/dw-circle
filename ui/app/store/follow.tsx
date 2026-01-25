import type { Follow, FollowToggledSocketPayload } from "~/dto/follow";
import { createAppAsyncThunk } from "./with-types";
import {
  getUserFollows,
  getUserFollowSuggestions,
  postToggleUsersFollows,
} from "~/services/follow";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { login, selectAuthUser } from "./auth";
import { store, type RootState } from "./store";
import type { UserLoginResponse } from "~/dto/auth";

export interface FollowState {
  following: Follow[];
  followers: Follow[];
  suggestions: Follow[];
  // statuses
  following_status: "idle" | "pending" | "succeeded" | "failed";
  follower_status: "idle" | "pending" | "succeeded" | "failed";
  suggestion_status: "idle" | "pending" | "succeeded" | "failed";
  error: string | null;
}

const initialState: FollowState = {
  following: [],
  followers: [],
  suggestions: [],
  following_status: "idle",
  follower_status: "idle",
  suggestion_status: "idle",
  error: null,
};

// ======== THUNKS =========

// GET SUGGESTIONS
export const fetchFollowSuggestions = createAppAsyncThunk(
  "follows/fetchFollowSuggestions",
  async () => {
    return await getUserFollowSuggestions();
  },
  {
    condition(arg, thunkApi) {
      const status = selectFollowsSuggestionStatus(thunkApi.getState());
      const user = selectAuthUser(thunkApi.getState());
      if (status !== "idle" || !user) {
        return false;
      }
    },
  },
);

// GET FOLLOWERS
export const fetchFollowers = createAppAsyncThunk(
  "follows/fetchFollowers",
  async () => {
    return await getUserFollows({ type: "followers" });
  },
  {
    condition(arg, thunkApi) {
      const status = selectFollowsFollowerStatus(thunkApi.getState());
      const user = selectAuthUser(thunkApi.getState());
      if (status !== "idle" || !user) {
        return false;
      }
    },
  },
);

// GET FOLLOWING
export const fetchFollowing = createAppAsyncThunk(
  "follows/fetchFollowing",
  async () => {
    return await getUserFollows({ type: "following" });
  },
  {
    condition(arg, thunkApi) {
      const status = selectFollowsFollowingStatus(thunkApi.getState());
      const user = selectAuthUser(thunkApi.getState());
      if (status !== "idle" || !user) {
        return false;
      }
    },
  },
);

// FOLLOW
export const follow = createAppAsyncThunk(
  "follows/follow",
  async (following_id: number) => {
    return await postToggleUsersFollows(following_id);
  },
);

// UNFOLLOW
export const unfollow = createAppAsyncThunk(
  "follows/unfollow",
  async (following_id: number) => {
    return await postToggleUsersFollows(following_id);
  },
);

// ======= SLICE ========
const followsSlice = createSlice({
  name: "follows",
  initialState,
  reducers: {
    followingAdded: (
      state,
      action: PayloadAction<{
        response: FollowToggledSocketPayload;
        curr_user: UserLoginResponse;
      }>,
    ) => {
      const { response, curr_user } = action.payload;

      const idx = state.following.findIndex(
        (f) => f.id === response.result.following.id,
      );

      // make sure data is new
      if (idx === -1) {
        const { result } = response;
        state.following.unshift({
          id: result.following.id,
          name: result.following.name,
          username: result.following.username,
          bio: result.following.bio,
          avatar: result.following.avatar,
          is_followed: true,
        });
      }
    },

    followingDeleted: (
      state,
      action: PayloadAction<FollowToggledSocketPayload>,
    ) => {
      const response = action.payload;

      const idx = state.following.findIndex(
        (f) => f.id === response.result.following.id,
      );

      if (idx !== -1) {
        state.following.splice(idx, 1);
      }
    },

    followerAdded: (
      state,
      action: PayloadAction<{
        response: FollowToggledSocketPayload;
        curr_user: UserLoginResponse;
      }>,
    ) => {
      const follower = action.payload.response.result.follower;

      const idx = state.followers.findIndex((f) => f.id === follower.id);
      if (idx !== -1) return;

      const isAlreadyFollowing = state.following.some(
        (f) => f.id === follower.id,
      );

      state.followers.unshift({
        id: follower.id,
        name: follower.name,
        username: follower.username,
        bio: follower.bio,
        avatar: follower.avatar,
        is_followed: isAlreadyFollowing,
      });
    },

    followerDeleted: (
      state,
      action: PayloadAction<FollowToggledSocketPayload>,
    ) => {
      console.log("FOLLOWER DELETED");
      const response = action.payload;

      const idx = state.followers.findIndex(
        (f) => f.id === response.result.follower.id,
      );

      if (idx !== -1) {
        state.followers.splice(idx, 1);
      }
    },
  },

  extraReducers(builder) {
    builder

      // ======  GET SUGGESTIONS =====
      .addCase(fetchFollowSuggestions.pending, (state, action) => {
        state.suggestion_status = "pending";
        state.error = null;
      })

      .addCase(fetchFollowSuggestions.fulfilled, (state, action) => {
        state.suggestions = action.payload;
        state.suggestion_status = "succeeded";
      })

      .addCase(fetchFollowSuggestions.rejected, (state, action) => {
        state.suggestions = [];
        state.suggestion_status = "failed";
        state.error = action.error.message ?? "Unknown Error";
      })

      // ======  GET FOLLOWERS =====
      .addCase(fetchFollowers.pending, (state, action) => {
        state.follower_status = "pending";
      })

      .addCase(fetchFollowers.fulfilled, (state, action) => {
        state.follower_status = "succeeded";
        state.followers = action.payload;
      })

      .addCase(fetchFollowers.rejected, (state, action) => {
        state.followers = [];
        state.follower_status = "failed";
        state.error = action.error.message ?? "Unknown Error";
      })

      // ======  GET FOLLOWING =====
      .addCase(fetchFollowing.pending, (state, action) => {
        state.following_status = "pending";
      })

      .addCase(fetchFollowing.fulfilled, (state, action) => {
        state.following = action.payload;
        state.following_status = "succeeded";
      })

      .addCase(fetchFollowing.rejected, (state, action) => {
        state.following = [];
        state.following_status = "failed";
        state.error = action.error.message ?? "Unknown Error";
      })

      // ========= FOLLOW ========
      .addCase(follow.pending, (state, action) => {
        const followingId = action.meta.arg;

        const i = state.following.findIndex((f) => f.id === followingId);
        if (i !== -1) {
          state.following[i].is_followed = true;
        }

        const y = state.followers.findIndex((f) => f.id === followingId);
        if (y !== -1) {
          state.followers[y].is_followed = true;
        }

        const z = state.suggestions.findIndex((f) => f.id === followingId);
        if (z !== -1) {
          state.suggestions[z].is_followed = true;
        }
      })

      .addCase(follow.fulfilled, (state, action) => {})

      .addCase(follow.rejected, (state, action) => {
        const followingId = action.meta.arg;

        const i = state.following.findIndex((f) => f.id === followingId);
        if (i !== -1) {
          state.following[i].is_followed = false;
        }

        const y = state.followers.findIndex((f) => f.id === followingId);
        if (y !== -1) {
          state.followers[y].is_followed = false;
        }

        const z = state.suggestions.findIndex((f) => f.id === followingId);
        if (z !== -1) {
          state.suggestions[z].is_followed = false;
        }

        state.error = action.error.message ?? "Unknown Error";
      })

      // ========= UNFOLLOW ========
      .addCase(unfollow.pending, (state, action) => {
        const followingId = action.meta.arg;

        const i = state.following.findIndex((f) => f.id === followingId);
        if (i !== -1) {
          state.following[i].is_followed = false;
        }

        const y = state.followers.findIndex((f) => f.id === followingId);
        if (y !== -1) {
          state.followers[y].is_followed = false;
        }

        const z = state.suggestions.findIndex((f) => f.id === followingId);
        if (z !== -1) {
          state.suggestions[z].is_followed = false;
        }
      })

      .addCase(unfollow.fulfilled, (state, action) => {})

      .addCase(unfollow.rejected, (state, action) => {
        const followingId = action.meta.arg;

        const i = state.following.findIndex((f) => f.id === followingId);
        if (i !== -1) {
          state.following[i].is_followed = true;
        }

        const y = state.followers.findIndex((f) => f.id === followingId);
        if (y !== -1) {
          state.followers[y].is_followed = true;
        }

        const z = state.suggestions.findIndex((f) => f.id === followingId);
        if (z !== -1) {
          state.suggestions[z].is_followed = true;
        }

        state.error = action.error.message ?? "Unknown Error";
      })

      .addCase(login, (state) => {
        return initialState;
      });
  },
});

export const {
  followingAdded,
  followerAdded,
  followingDeleted,
  followerDeleted,
} = followsSlice.actions;
export default followsSlice.reducer;

// ======== SELECT =========
export const selectFollowers = (state: RootState) => state.follows.followers;
export const selectFollowing = (state: RootState) => state.follows.following;

export const selectSingleFollower = (id: number) => (state: RootState) =>
  state.follows.followers.find((f) => f.id === id);
export const selectSingleFollowing = (id: number) => (state: RootState) =>
  state.follows.following.find((f) => f.id === id);
export const selectSingleSuggestion = (id: number) => (state: RootState) =>
  state.follows.suggestions.find((f) => f.id === id);

export const selectFollowSuggestions = (state: RootState) =>
  state.follows.suggestions;
export const selectFollowsError = (state: RootState) => state.follows.error;
export const selectFollowsFollowingStatus = (state: RootState) =>
  state.follows.following_status;
export const selectFollowsFollowerStatus = (state: RootState) =>
  state.follows.follower_status;
export const selectFollowsSuggestionStatus = (state: RootState) =>
  state.follows.suggestion_status;
