// src/pages/EditPostPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchPostById } from "../store/postSlice"; // Import the thunk to fetch the post
import PostForm from "../components/PostForm"; // Your reusable form

function EditPostPage() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // 2. Select the relevant data from the Redux store
  // We get 'currentPost' which will be populated by our fetch thunk
  const post = useSelector((state) => state.post.currentPost);
  const loading = useSelector((state) => state.post.loading);

  // 3. Use useEffect to fetch the post data when the component mounts or postId changes
  useEffect(() => {
    if (postId) {
      dispatch(fetchPostById(postId));
    } else {
      navigate("/");
    }
  }, [postId, dispatch, navigate]);

  if (loading) {
    return (
      <div className="text-center p-10">
        <h1>Loading post data...</h1>
      </div>
    );
  }

  // 5. If the post data is available, render the PostForm and pass the data to it
  //    If post is null after loading (e.g., post not found), show a message.
  return post ? (
    // Apply the same container styling here
    <div className="py-8 container mx-auto">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
        Edit Your Post
      </h1>
      <PostForm post={post} />
    </div>
  ) : (
    <div className="text-center p-10">
      <h1>Post not found.</h1>
    </div>
  );
}

export default EditPostPage;
