import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import commentService from "../appwrite/comments";
import authService from "../appwrite/auth";

export const fetchComments = createAsyncThunk(
  "comment/fetchComments",

  async (postId, thunkAPI) => {
    try {
      const response = await commentService.getComments(postId);
      if (response) {
        return { postId, comments: response.documents };
      } else {
        return thunkAPI.rejectWithValue("Error fetching comments");
      }
    } catch (error) {
      let errorMessage = "Error Fetching comments. Please try again.";
      if (error.response && error.response.message) {
        errorMessage = error.response.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

export const addComment = createAsyncThunk(
  "comment/addComment",
  async (commentData, thunkAPI) => {
    try {
      const commentDocumentData = {
        text: commentData.text,
        userId: commentData.userId,
        postId: commentData.postId,
      };

      const newComment = await commentService.createComment(
        commentDocumentData
      );
      return newComment;
    } catch (error) {
      let errorMessage = "Error adding comment. Please try again.";
      if (error.response && error.response.message) {
        errorMessage = error.response.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

export const updateComment = createAsyncThunk(
  "comment/updateComment",
  async ({ commentId, commentData }, thunkAPI) => {
    try {
      const updatedComment = await commentService.updateComment(commentId, {
        text: commentData.text,
      });
      return updatedComment;
    } catch (error) {
      let errorMessage = "Error updating comment. Please try again.";
      if (error.response && error.response.message) {
        errorMessage = error.response.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

export const deleteComment = createAsyncThunk(
  "comment/deleteComment",
  async ({ commentId, postId }, thunkAPI) => {
    try {
      await commentService.deleteComment(commentId);
      return { postId, commentId };
    } catch (error) {
      let errorMessage = "Error deleting comment. Please try again.";
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
  commentsByPostId: {},
  loading: false,
  error: null,
};

const commentSlice = createSlice({
  name: "comment",
  initialState,
  reducers: {
    // Optional: A synchronous reducer to clear comments manually if ever needed
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchComments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        const { postId, comments } = action.payload;
        state.commentsByPostId[postId] = comments;
      })
      .addCase(fetchComments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(addComment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addComment.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        const newComment = action.payload;
        const postId = newComment.postId;
        if (state.commentsByPostId[postId]) {
          state.commentsByPostId[postId].unshift(newComment);
        } else {
          state.commentsByPostId[postId] = [newComment];
        }
      })
      .addCase(addComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateComment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateComment.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;

        const updatedComment = action.payload;
        const postId = updatedComment.postId;

        if (state.commentsByPostId[postId]) {
          const commentIndex = state.commentsByPostId[postId].findIndex(
            (comment) => comment.$id === updatedComment.$id
          );

          if (commentIndex !== -1) {
            state.commentsByPostId[postId][commentIndex] = updatedComment;
          }
        }
      })
      .addCase(updateComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(deleteComment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        const { commentId, postId } = action.payload;
        if (state.commentsByPostId[postId]) {
          state.commentsByPostId[postId] = state.commentsByPostId[
            postId
          ].filter((comment) => comment.$id !== commentId);
        }
      })
      .addCase(deleteComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});
export default commentSlice.reducer;
