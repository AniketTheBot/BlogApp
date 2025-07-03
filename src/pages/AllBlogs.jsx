import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllPosts } from "../store/postSlice";
import PostCard from "../components/PostCard";

function AllBlogs() {
  const dispatch = useDispatch();
  const { posts, loading, error } = useSelector((state) => state.post);
  useEffect(() => {
    dispatch(fetchAllPosts());
  }, [dispatch]);

  if (loading) {
    return <div>loading...</div>;
  }
  if (error) {
    return <div>Error : {error}</div>;
  }
  if (!loading && posts.length === 0) {
    return (
      <div className="text-center text-xl p-10">
        <h1>No posts found. Why not create one?</h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">All Blog Posts</h1>
      <div className="flex flex-wrap justify-center -m-4">
        {posts.map((post) => (
          <div key={post.$id} className="p-2">
            <PostCard post={post} />
          </div>
        ))}
      </div>
    </div>
  );
}
export default AllBlogs;
