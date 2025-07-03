// src/components/CommentCard.jsx
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from "./Button";
import { deleteComment, updateComment } from "../store/commentSlice";

// This component receives a single 'comment' object as a prop
function CommentCard({ comment }) {
  // --- STATE ---
  // State to track if the user is currently editing this specific comment
  const [isCommentEditable, setIsCommentEditable] = useState(false);
  // State to hold the text while editing
  const [commentText, setCommentText] = useState(comment.text);





  // --- REDUX DATA ---
  const authUserData = useSelector((state) => state.auth.userData);
  const dispatch = useDispatch();

  const isAuthor = authUserData ? comment.userId === authUserData.$id : false;

  const handleDeleteComment = () => {
    dispatch(
      deleteComment({
        commentId: comment.$id,
        postId: comment.postId,
      })
    );
  };

  const handleUpdateComment = () => {
    if (commentText.trim() === "" || commentText.trim() === comment.text) {
      setIsCommentEditable(false);
      setCommentText(comment.text); // Reset to original text
      return;
    }

    dispatch(
      updateComment({
        commentId: comment.$id,
        commentData: { text: commentText.trim() },
      })
    );

    setIsCommentEditable(false);
  };

  const authorName = `${comment.userId.substring(0, 6)}`;

  return (
    <div className="bg-gray-100 p-4 rounded-lg flex justify-between items-start gap-4">
      <div className="flex-grow">
        <p className="text-sm font-bold text-gray-700 mb-1">{authorName}</p>
        {isCommentEditable ? (
          <textarea
            className="w-full p-2 border rounded-md"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            rows="3"
          />
        ) : (
          <p className="text-gray-800">{comment.text}</p>
        )}
      </div>

      {isAuthor && (
        <div className="flex-shrink-0 flex gap-2">
          <Button
            bgColor={isCommentEditable ? "bg-green-500" : "bg-blue-500"}
            onClick={() => {
              if (isCommentEditable) {
                handleUpdateComment();
              } else {
                setIsCommentEditable(true);
              }
            }}
          >
            {isCommentEditable ? "Save" : "Edit"}
          </Button>
          <Button bgColor="bg-red-500" onClick={handleDeleteComment}>
            Delete
          </Button>
        </div>
      )}
    </div>
  );
}

export default CommentCard;
