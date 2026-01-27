import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { UserLoginResponse } from "~/dto/auth";
import type { RootState } from "./store";
import type { UpdateProfileDTO, UserProfile } from "~/dto/profile";
import { createAppAsyncThunk } from "./with-types";
import {
  getUserProfile,
  getUserProfileByUsername,
  putUserProfile,
} from "~/services/profile";
import { login, selectAuthUser } from "./auth";
import type { FollowToggledSocketPayload } from "~/dto/follow";

export interface ProfileState {
  profile: UserProfile | null;
  userProfile: UserProfile | null; // for getting other people profile detail
  status: "idle" | "pending" | "succeeded" | "failed";
  error: string | null;
}

const initialState: ProfileState = {
  profile: null,
  userProfile: null,
  status: "idle",
  error: null,
};

// ======== THUNKS =========

// GET
export const fetchProfile = createAppAsyncThunk(
  "profile/fetchProfile",
  async (userId: number) => {
    return await getUserProfile(userId);
  },
  {
    condition(arg, thunkApi) {
      const status = selectProfileStatus(thunkApi.getState());
      const user = selectAuthUser(thunkApi.getState());
      if (status !== "idle" || !user) {
        return false;
      }
    },
  },
);

export const fetchUserProfile = createAppAsyncThunk(
  "profile/fetchUserProfile",
  async (username: string) => {
    return await getUserProfileByUsername(username);
  },
  {
    condition(arg, thunkApi) {
      const user = selectAuthUser(thunkApi.getState());
      if (!user) {
        return false;
      }
    },
  },
);

// UPDATE
export const updateProfile = createAppAsyncThunk(
  "profile/updateProfile",
  async (p: UpdateProfileDTO) => {
    return await putUserProfile(p);
  },
);

// HELPER
function applyFollowResult(
  profile: UserProfile | null,
  result: FollowToggledSocketPayload["result"],
) {
  if (!profile) return;

  if (profile.id === result.follower.id) {
    profile.followers = result.follower.followers;
    profile.following = result.follower.following;
  }

  if (profile.id === result.following.id) {
    profile.followers = result.following.followers;
    profile.following = result.following.following;
  }
}

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    followToggled(
      state,
      action: PayloadAction<{
        response: FollowToggledSocketPayload;
        user: UserLoginResponse;
      }>,
    ) {
      const { result } = action.payload.response;

      // ===== OWN PROFILE =====
      applyFollowResult(state.profile, result);

      // ===== OTHER USER PROFILE =====
      applyFollowResult(state.userProfile, result);
    },
  },
  extraReducers(builder) {
    builder

      // ======  GET PROFILE =====
      .addCase(fetchProfile.pending, (state, _) => {
        state.status = "pending";
      })

      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.profile = action.payload;
      })

      .addCase(fetchProfile.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Unknown Error";
      })

      // ======  GET USER PROFILE =====
      .addCase(fetchUserProfile.pending, (state, _) => {})

      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.userProfile = action.payload;
      })

      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.error = action.error.message ?? "Unknown Error";
      })

      // ======  UPDATE PROFILE =====
      .addCase(updateProfile.pending, (state, action) => {
        // state.profile = {
        //   id: -1,
        //   username: action.meta.arg.username,
        //   name: action.meta.arg.name,
        //   bio: action.meta.arg.bio,
        //   avatar: action.meta.arg.image
        //     ? URL.createObjectURL(action.meta.arg.image)
        //     : state.profile?.avatar,
        //   followers: 0,
        //   following: 0,
        // };

        state.error = null;
      })

      .addCase(updateProfile.fulfilled, (state, action) => {
        if (state.profile?.avatar) {
          URL.revokeObjectURL(state.profile.avatar);
        }

        state.profile = action.payload;
      })

      .addCase(updateProfile.rejected, (state, action) => {
        state.error = action.error.message ?? "Failed to uodate profile";
      })

      .addCase(login, (state) => {
        return initialState;
      });
  },
});

export const { followToggled } = profileSlice.actions;
export default profileSlice.reducer;

// ===========  SELECT   ===========
export const selectProfile = (state: RootState) => state.profile.profile;
export const selectUserProfile = (state: RootState) =>
  state.profile.userProfile;
export const selectProfileStatus = (state: RootState) => state.profile.status;

export const selectProfileOnType =
  (type: "own" | "other") => (state: RootState) => {
    switch (type) {
      case "own":
        return selectProfile(state);
      case "other":
        return selectUserProfile(state);
      default:
        return selectUserProfile(state);
    }
  };
