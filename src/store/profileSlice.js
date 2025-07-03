import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import likeService from "../appwrite/likes";
import postService from "../appwrite/posts";
import { Query } from "appwrite";

export const fetchLikedPosts = createAsyncThunk(
  "profile/fetchLikedPosts",
  async (_, { getState, rejectWithValue }) => {
    // Corrected: Destructure thunkAPI
    try {
      const { auth } = getState();
      if (!auth.userData) return rejectWithValue("User Not Logged In");

      const userId = auth.userData.$id;

      const likeResponse = await likeService.getLikedPostsByUser(userId);
      const likedPostIds = likeResponse.documents.map((like) => like.postId);

      // FIX 1: Check the LENGTH of the array
      if (likedPostIds.length === 0) {
        return []; // Return an empty array, which is a successful result
      }

      const postResponse = await postService.listPosts([
        Query.equal("$id", likedPostIds),
      ]);

      return postResponse.documents;
    } catch (error) {
      // FIX 2: You need to call rejectWithValue here, it's not globally available
      console.error("Error in fetchLikedPosts thunk:", error); // Good to log the actual error
      return rejectWithValue("Failed to fetch liked posts.");
    }
  }
);

export const fetchUserPosts = createAsyncThunk(
  "profile/fetchYourPosts",
  async (_, thunkAPI) => {
    try {
      const { auth } = thunkAPI.getState();
      if (!auth.userData) return thunkAPI.rejectWithValue("User Not Logged In");
      const userId = auth.userData.$id;

      const postResponse = await postService.listPostsByUser(userId);
      return postResponse.documents;
    } catch (error) {
      console.error("Error in fetchUserPosts thunk:", error);
      return rejectWithValue("Failed to fetch your posts.");
    }
  }
);
const initialState = {
  likedPosts: [],
  userPosts: [],
  loading: false,
  error: null,
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLikedPosts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchLikedPosts.fulfilled, (state, action) => {
        state.likedPosts = action.payload;
        state.loading = false;
      })
      .addCase(fetchLikedPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchUserPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserPosts.fulfilled, (state, action) => {
        state.loading = false;
        // Populate the userPosts array with the payload
        state.userPosts = action.payload;
      })
      .addCase(fetchUserPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.userPosts = []; // Clear on error
      });
  },
});
export default profileSlice.reducer;
