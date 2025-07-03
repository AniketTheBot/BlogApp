// src/pages/profile/LikedPosts.jsx (Corrected Version)
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import PostCard from "../components/PostCard"; // Corrected path assumption
import { fetchUserPosts } from "../store/profileSlice";

function LikedPosts() {
  const dispatch = useDispatch();

  // FIX 1: The state property is named 'likedPosts' (lowercase 'l')
  //        And we should rename the destructured variable to avoid confusion.
  const {
    userPosts: posts,
    loading,
    error,
  } = useSelector((state) => state.profile);

  useEffect(() => {
    dispatch(fetchUserPosts());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="text-center p-10">
        <h1>Loading your posts...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-10 text-red-500">
        <h1>Error: {error}</h1>
      </div>
    );
  }

  // FIX 2: Check the 'posts' variable we just created
  if (!loading && posts.length === 0) {
    return (
      <div className="text-center text-xl p-10">
        <h1>You haven't created any posts yet.</h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Your Posts</h1>
      <div className="flex flex-wrap justify-center -m-4">
        {/* FIX 3: Map over 'posts' and pass each 'post' to the PostCard */}
        {posts.map((post) => (
          <div key={post.$id} className="p-2">
            <PostCard post={post} />
          </div>
        ))}
      </div>
    </div>
  );
}
export default LikedPosts;
