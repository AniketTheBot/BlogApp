import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../store/authSlice";
import postReducer from "../store/postSlice";
import commentReducer from "../store/commentSlice";
import likeReducer from "../store/likeSlice";
import profileReducer from "../store/profileSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    post: postReducer,
    comment: commentReducer,
    like: likeReducer,
    profile: profileReducer,
  },
});

export default store;
