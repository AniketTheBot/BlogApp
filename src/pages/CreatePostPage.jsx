// src/pages/CreatePostPage.jsx
import React from "react";
import PostForm from "../components/PostForm"; // Adjust path if needed

function CreatePostPage() {
  return (
    // Add a container with padding and a max-width
    <div className="py-8 container mx-auto">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
        Create a New Post
      </h1>
      <PostForm />
    </div>
  );
}

export default CreatePostPage;
