import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import postService from "../appwrite/posts";
import storageService from "../appwrite/storage";

export const fetchAllPosts = createAsyncThunk(
  "post/fetchAll",
  async (_, thunkAPI) => {
    try {
      const postResponse = await postService.listPosts();
      return postResponse
        ? postResponse
        : thunkAPI.rejectWithValue("Could not fetch posts");
    } catch (error) {
      let errorMessage = "Error fetching posts. Please try again.";
      if (error.response && error.response.message) {
        errorMessage = error.response.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

export const addNewPost = createAsyncThunk(
  "post/addNew",
  async (postData, thunkAPI) => {
    try {
      let fileId = null;
      console.log("Thunk received featuredImage:", postData.featuredImage);

      if (postData.featuredImage) {
        const file = await storageService.uploadFile(postData.featuredImage);
        if (file) {
          fileId = file.$id;
          console.log("File uploaded, ID is:", fileId); // Are you seeing this log?
        } else {
          console.log("storageService.uploadFile returned a falsy value.");

          return thunkAPI.rejectWithValue("Image upload failed");
        }
      }

      const postDocumentData = {
        title: postData.title,
        slug: postData.slug,
        content: postData.content,
        status: postData.status,
        userId: postData.userId,
        featuredImage: fileId,
      };
      console.log("Data being sent to createPost service:", postDocumentData); // Add this log!

      const newPost = await postService.createPost(postDocumentData);
      return newPost
        ? newPost
        : thunkAPI.rejectWithValue("Could not create Post");
    } catch (error) {
      let errorMessage = "Error creating post. Please try again.";
      if (error.response && error.response.message) {
        errorMessage = error.response.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

export const fetchPostById = createAsyncThunk(
  "post/fetchById",
  async (postId, thunkAPI) => {
    try {
      const post = await postService.getPost(postId);
      return post ? post : thunkAPI.rejectWithValue("Error in displaying post");
    } catch (error) {
      let errorMessage = "Error Fetching post. Please try again.";
      if (error.response && error.response.message) {
        errorMessage = error.response.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

export const deletePost = createAsyncThunk(
  "post/deletePost",
  async (postId, thunkAPI) => {
    try {
      const post = await postService.getPost(postId);
      if (post && post.featuredImage) {
        await storageService.deleteFile(post.featuredImage);
      }
      await postService.deletePost(postId);
      return postId;
    } catch (error) {
      let errorMessage = "Error Deleting post. Please try again.";
      if (error.response && error.response.message) {
        errorMessage = error.response.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

export const updateExistingPost = createAsyncThunk(
  "post/updatePost",
  async ({ postId, postData }, thunkAPI) => {
    try {
      if (postData.image && postData.image[0]) {
        const file = await storageService.uploadFile(postData.image[0]);
        if (file) {
          const originalPost = postService.getPost(postId);
          if (originalPost.featuredImage) {
            await storageService.deleteFile(originalPost.featuredImage);
          }
          postData.featuredImage = file.$id;
        }
      }
      const updatedPost = await postService.updatePost(postId, {
        title: postData.title,
        slug: postData.slug,
        content: postData.content,
        status: postData.status,
        featuredImage: postData.featuredImage,
      });

      return updatedPost;
    } catch (error) {
      let errorMessage = "Error Updating post. Please try again.";
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
  posts: [],
  currentPost: null,
  loading: false,
  error: null,
};

const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllPosts.fulfilled, (state, action) => {
        state.posts = action.payload.documents;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchAllPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.posts = [];
      })

      .addCase(addNewPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addNewPost.fulfilled, (state, action) => {
        state.posts.push(action.payload);
        state.loading = false;
        state.error = null;
      })
      .addCase(addNewPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchPostById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.currentPost = null;
      })
      .addCase(fetchPostById.fulfilled, (state, action) => {
        state.currentPost = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchPostById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.currentPost = null;
      })

      .addCase(deletePost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.currentPost = null;
        state.loading = false;
        state.error = null;
        state.posts = state.posts.filter((post) => post.$id !== action.payload);
      })
      .addCase(deletePost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateExistingPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateExistingPost.fulfilled, (state, action) => {
        state.currentPost = action.payload;
        state.loading = false;
        state.error = null;

        const index = state.posts.findIndex(
          (post) => post.$id === action.payload.$id
        );
        if (index !== -1) state.posts[index] = action.payload;
      })
      .addCase(updateExistingPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default postSlice.reducer;
