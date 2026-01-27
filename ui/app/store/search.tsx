import type { Follow } from "~/dto/follow";
import { createAppAsyncThunk } from "./with-types";
import { getUserSearch } from "~/services/search";
import type { RootState } from "./store";
import { login, selectAuthUser } from "./auth";
import { createSlice } from "@reduxjs/toolkit";
import { follow, unfollow } from "./follow";

export interface SearchState {
  results: Follow[];
  keyword: string;
  status: "idle" | "pending" | "succeeded" | "failed";
  error: string | null;
}

const initialState: SearchState = {
  results: [],
  keyword: "",
  status: "idle",
  error: null,
};

// ======== THUNKS =========

// GET RESULTS
export const fetchResults = createAppAsyncThunk(
  "search/fetchResults",
  async (keyword: string) => {
    return await getUserSearch(keyword);
  },
);

// ======= SLICE ========
const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setKeyword: (state, action) => {
      // cheating
      if (action.payload === "") {
        state.status = "idle";
      } else {
        state.status = "pending";
      }

      state.keyword = action.payload;
    },
    resetSearch: (state) => {
      return initialState;
    },
  },

  extraReducers(builder) {
    builder

      // ======  GET RESULTS =====
      .addCase(fetchResults.pending, (state, action) => {
        state.status = "pending";
        state.error = null;
      })

      .addCase(fetchResults.fulfilled, (state, action) => {
        state.results = action.payload;
        state.status = "succeeded";
      })

      .addCase(fetchResults.rejected, (state, action) => {
        state.results = [];
        state.status = "failed";
        state.error = action.error.message ?? "Unknown Error";
      })

      // ==========  FOLLOW ==========

      .addCase(follow.pending, (state, action) => {
        const followingId = action.meta.arg;

        const i = state.results.findIndex((f) => f.id === followingId);
        if (i !== -1) {
          state.results[i].is_followed = true;
        }
      })

      .addCase(follow.rejected, (state, action) => {
        const followingId = action.meta.arg;

        const i = state.results.findIndex((f) => f.id === followingId);
        if (i !== -1) {
          state.results[i].is_followed = false;
        }

        state.error = action.error.message ?? "Unknown Error";
      })

      // ========= UNFOLLOW ========

      .addCase(unfollow.pending, (state, action) => {
        const followingId = action.meta.arg;

        const i = state.results.findIndex((f) => f.id === followingId);
        if (i !== -1) {
          state.results[i].is_followed = false;
        }
      })

      .addCase(unfollow.rejected, (state, action) => {
        const followingId = action.meta.arg;

        const i = state.results.findIndex((f) => f.id === followingId);
        if (i !== -1) {
          state.results[i].is_followed = true;
        }

        state.error = action.error.message ?? "Unknown Error";
      })

      //   ====== LOGIN ======

      .addCase(login, (state) => {
        return initialState;
      });
  },
});

export const { setKeyword, resetSearch } = searchSlice.actions;
export default searchSlice.reducer;

// ======== SELECT =========
export const selectSearchStatus = (state: RootState) => state.search.status;
export const selectSearchResults = (state: RootState) => state.search.results;
export const selectSearchResultById = (id: number) => (state: RootState) =>
  state.search.results.find((s) => s.id === id);
export const selectSearchKeyword = (state: RootState) => state.search.keyword;
