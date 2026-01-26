import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { UserLoginResponse } from "~/dto/auth";
import type { RootState } from "./store";
import type { UpdateProfileDTO, UserProfile } from "~/dto/profile";
import { createAppAsyncThunk } from "./with-types";
import { getUserProfile, putUserProfile } from "~/services/profile";
import { login, selectAuthUser } from "./auth";
import type { FollowToggledSocketPayload } from "~/dto/follow";

export interface ProfileState {
  profile: UserProfile | null;
  status: "idle" | "pending" | "succeeded" | "failed";
  error: string | null;
}

const initialState: ProfileState = {
  profile: null,
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

// UPDATE
export const updateProfile = createAppAsyncThunk(
  "profile/updateProfile",
  async (p: UpdateProfileDTO) => {
    return await putUserProfile(p);
  },
);

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
      const { response } = action.payload;
      const { result } = response;

      if (!state.profile) return;

      const profileUserId = state.profile.id;

      if (profileUserId === result.follower.id) {
        // Profile belongs to follower
        state.profile.followers = result.follower.followers;
        state.profile.following = result.follower.following;
      }

      if (profileUserId === result.following.id) {
        // Profile belongs to followed user
        state.profile.followers = result.following.followers;
        state.profile.following = result.following.following;
      }
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
export const selectProfileStatus = (state: RootState) => state.profile.status;
