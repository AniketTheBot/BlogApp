import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import likeService from "../appwrite/likes";

export const likePost = createAsyncThunk(
  "like/likePost",
  async ({ postId, userId }, thunkAPI) => {
    try {
      const newLike = await likeService.likePost({ postId, userId });
      return newLike;
    } catch (error) {
      let errorMessage = "Error Liking post. Please try again.";
      if (error.response && error.response.message) {
        errorMessage = error.response.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

export const unlikePost = createAsyncThunk(
  "like/unlikePost",
  async ({ postId, userId }, thunkAPI) => {
    try {
      const likeDocument = await likeService.getLike({ postId, userId });
      if (likeDocument) {
        await likeService.unlikePost(likeDocument.$id);
        return { postId, likeId: likeDocument.$id };
      } else {
        thunkAPI.rejectWithValue("Like not found.");
      }
    } catch (error) {
      let errorMessage = "Error unliking post. Please try again.";
      if (error.response && error.response.message) {
        errorMessage = error.response.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

export const fetchLikesForPost = createAsyncThunk(
  "like/fetchLikesForPost",
  async (postId, thunkAPI) => {
    try {
      const likeCount = await likeService.getLikesCount(postId);
      const { auth } = thunkAPI.getState();
      let userLike = null;
      if (auth.status) {
        userLike = await likeService.getLike({
          postId,
          userId: auth.userData.$id,
        });
      }
      return {
        postId,
        count: likeCount,
        userLike: userLike,
      };
    } catch (error) {
      let errorMessage =
        "Error fetching likes for this post. Please try again.";
      if (error.response && error.response.message) {
        errorMessage = error.response.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

const initialState = {
  likesByPost: {},
  loading: false,
  error: null,
};

const likeSlice = createSlice({
  name: "like",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // --- Cases for fetchLikesForPost ---
      .addCase(fetchLikesForPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLikesForPost.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null; // FIX: Set error to null on success, not true.
        const { postId, count, userLike } = action.payload;
        state.likesByPost[postId] = {
          count: count,
          userHasLiked: !!userLike,
          userLikeId: userLike?.$id || null,
        };
      })
      .addCase(fetchLikesForPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // --- Cases for likePost ---
      .addCase(likePost.pending, (state) => {
        state.error = null;
      })
      .addCase(likePost.fulfilled, (state, action) => {
        console.log("--- likePost.fulfilled ---");
        console.log("Payload:", action.payload);
        const newLike = action.payload;
        const postId = newLike.postId;

        if (state.likesByPost[postId]) {
          state.likesByPost[postId].count += 1;
          state.likesByPost[postId].userHasLiked = true;
          state.likesByPost[postId].userLikeId = newLike.$id;
        } else {
          // FIX: You need to assign the new object back to the state property.
          state.likesByPost[postId] = {
            count: 1,
            userHasLiked: true,
            userLikeId: newLike.$id,
          };
        }
      })
      .addCase(likePost.rejected, (state, action) => {
        state.error = action.payload;
      })

      // --- Cases for unlikePost ---
      .addCase(unlikePost.pending, (state, action) => {
        state.error = null;
      })
      .addCase(unlikePost.fulfilled, (state, action) => {
        // FIX: Added the builder syntax
        // The payload will be { postId, likeId } if the thunk is successful
        const { postId } = action.payload;
        if (state.likesByPost[postId]) {
          state.likesByPost[postId].count -= 1;
          state.likesByPost[postId].userHasLiked = false;
          state.likesByPost[postId].userLikeId = null;
        }
      })
      .addCase(unlikePost.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default likeSlice.reducer;
