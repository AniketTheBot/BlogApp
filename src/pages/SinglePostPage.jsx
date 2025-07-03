import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { deletePost, fetchPostById } from "../store/postSlice";
import storageService from "../appwrite/storage";
import Button from "../components/Button";
import parse from "html-react-parser";
import { addComment, fetchComments } from "../store/commentSlice";
import CommentCard from "../components/CommentCard";
import { fetchLikesForPost, likePost, unlikePost } from "../store/likeSlice";

function SinglePostPage() {
  const [newCommentText, setNewCommentText] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { postId } = useParams();

  console.log("Post Id from URL: ", postId);
  const { currentPost, loading, error } = useSelector((state) => state.post);
  const authUserData = useSelector((state) => state.auth.userData);
  const postLikeData = useSelector((state) => state.like.likesByPost[postId]);

  const {
    commentsByPostId: comments,
    loading: commentsLoading,
    error: commentsError,
  } = useSelector((state) => state.comment);
  const postComments = comments[postId] || [];

  const likeCount = postLikeData?.count ?? 0;
  const userHasLiked = postLikeData?.userHasLiked ?? false;

  useEffect(() => {
    if (postId) {
      dispatch(fetchPostById(postId));
      if (!comments[postId]) {
        dispatch(fetchComments(postId));
      }
      dispatch(fetchLikesForPost(postId));
    } else navigate("/");
  }, [postId, dispatch, navigate]);

  const handleAddComment = async (e) => {
    if (!newCommentText.trim()) return;
    e.preventDefault();
    try {
      await dispatch(
        addComment({
          text: newCommentText,
          postId: postId,
          userId: authUserData.$id,
        })
      ).unwrap();
      setNewCommentText("");
      console.log("Comment succesfull added");
    } catch (error) {
      console.error("Error adding comment", error);
    }
  };

  const handleLikeToggle = async () => {
    if (!authUserData) {
      navigate("/login");
      return;
    }
    if (userHasLiked) {
      dispatch(unlikePost({ postId: postId, userId: authUserData.$id }));
    } else {
      dispatch(likePost({ postId: postId, userId: authUserData.$id }));
    }
  };

  const isAuthor =
    currentPost && authUserData
      ? currentPost.userId === authUserData.$id
      : false;

  const handleDeletePost = async () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await dispatch(deletePost(postId)).unwrap();
        navigate("/");
      } catch (error) {
        console.error("Failed to delete post:", error);
      }
    }
  };

  if (loading)
    return (
      <div className="text-center p-10">
        <h1>Loading post...</h1>
      </div>
    );
  if (error) {
    return (
      <div className="text-center p-10 text-red-500">
        <h1>Error: {error}</h1>
      </div>
    );
  }
  if (!currentPost) {
    return (
      <div className="text-center p-10">
        <h1>Post not found.</h1>
      </div>
    );
  }
  return (
    <div className="py-8 container mx-auto">
      <div className="w-full flex justify-center mb-4 relative border rounded-xl p-2">
        <img
          src={storageService.getFilePreview(currentPost.featuredImage)?.href}
          alt={currentPost.title}
          className="rounded-xl object-contain max-h-96" // Constrain image size
        />

        {isAuthor && (
          <div className="absolute right-6 top-6">
            <Link to={`/edit-post/${currentPost.$id}`}>
              <Button bgColor="bg-green-500" className="mr-3">
                Edit
              </Button>
            </Link>
            <Button bgColor="bg-red-500" onClick={handleDeletePost}>
              Delete
            </Button>
          </div>
        )}
      </div>
      <div className="w-full mb-6">
        <h1 className="text-2xl font-bold">{currentPost.title}</h1>
      </div>
      <div className="browser-css">{parse(String(currentPost.content))}</div>
      <div className="mt-6 flex items-center gap-4">
        <Button
          onClick={handleLikeToggle}
          bgColor={userHasLiked ? "bg-red-500" : "bg-gray-500"}
        >
          {userHasLiked ? "❤️ Liked" : "🤍 Like"}
        </Button>
        <span className="font-semibold text-lg">
          {likeCount} {likeCount === 1 ? "Like" : "Likes"}
        </span>
      </div>

      <div className="mt-10 border-t pt-6">
        <h2 className="text-2xl font-bold mb-4">Comments</h2>

        {/* Add Comment Form */}
        {authUserData ? ( // Only show form if user is logged in
          <form
            onSubmit={handleAddComment}
            className="mb-6 flex gap-4 items-start"
          >
            <textarea
              className="w-full p-2 border rounded-md"
              placeholder="Write a comment..."
              value={newCommentText}
              onChange={(e) => setNewCommentText(e.target.value)} // Correctly update state
              rows="3"
            />
            <Button
              className=" bg-black"
              type="submit"
              disabled={commentsLoading}
            >
              {commentsLoading ? "..." : "Post"}
            </Button>
          </form>
        ) : (
          <p>
            Please
            <Link to="/login" className="text-blue-600 hover:underline">
              log in
            </Link>
            to add a comment.
          </p>
        )}

        <div className="space-y-4">
          {commentsLoading && comments.length === 0 && (
            <p>Loading comments...</p>
          )}
          {postComments.map((comment) => (
            <CommentCard key={comment.$id} comment={comment} />
          ))}
          {!commentsLoading && comments.length === 0 && (
            <p>No comments yet. Be the first to comment!</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default SinglePostPage;
