import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { UserLoginResponse } from "~/dto/auth";
import type { RootState } from "./store";
import type { UpdateProfileDTO, UserProfile } from "~/dto/profile";
import { createAppAsyncThunk } from "./with-types";
import { getUserProfile, putUserProfile } from "~/services/profile";

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
      if (status !== "idle") {
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
  reducers: {},
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

      // ======  CREATE THREAD =====
      .addCase(updateProfile.pending, (state, action) => {
        state.profile = {
          id: -1,
          username: action.meta.arg.username,
          name: action.meta.arg.name,
          bio: action.meta.arg.bio,
          followers: 0,
          following: 0,
        };

        state.error = null;
      })

      .addCase(updateProfile.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.profile = action.payload;
      })

      .addCase(updateProfile.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Failed to uodate profile";
      });
  },
});

export const {} = profileSlice.actions;
export default profileSlice.reducer;

export const selectProfile = (state: RootState) => state.profile.profile;
export const selectProfileStatus = (state: RootState) => state.profile.status;
