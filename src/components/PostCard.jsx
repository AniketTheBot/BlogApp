// src/components/PostCard.jsx
import React from "react";
import { Link } from "react-router-dom";
import storageService from "../appwrite/storage";

function PostCard({ post }) {
  const imageUrl = post.featuredImage
    ? storageService.getFilePreview(post.featuredImage).href
    : null;

  return (
    <Link to={`/post/${post.$id}`}>
      <div className="relative flex w-80 flex-col rounded-xl bg-white bg-clip-border text-gray-700 shadow-md hover:shadow-xl transition-shadow duration-300 m-4">
        <div className="relative mx-4 -mt-6 h-56 overflow-hidden rounded-xl bg-blue-gray-500 bg-clip-border text-white shadow-lg shadow-blue-gray-500/40">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-300 flex items-center justify-center">
              <span className="text-gray-500">No Image</span>
            </div>
          )}
        </div>

        <div className="p-6">
          <h5 className="mb-2 block font-sans text-xl font-semibold leading-snug tracking-normal text-blue-gray-900 antialiased">
            {post.title}
          </h5>
        </div>

        <div className="p-6 pt-0">
          <button
            data-ripple-light="true"
            type="button"
            className="select-none rounded-lg bg-blue-500 py-3 px-6 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md shadow-blue-500/20 transition-all hover:shadow-lg hover:shadow-blue-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
          >
            Read More
          </button>
        </div>
      </div>
    </Link>
  );
}

export default PostCard;
