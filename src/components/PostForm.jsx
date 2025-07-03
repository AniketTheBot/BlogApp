// src/components/PostForm.jsx

import React, { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addNewPost, updateExistingPost } from "../store/postSlice";
import storageService from "../appwrite/storage";

import Input from "./Input";
import RTE from "./RTE";
import Select from "./Select";
import Button from "./Button";

export default function PostForm({ post }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userData = useSelector((state) => state.auth.userData);

  const { register, handleSubmit, control, watch, setValue, getValues } =
    useForm({
      defaultValues: {
        title: post?.title || "",
        slug: post?.slug || "",
        content: post?.content || "",
        status: post?.status || "active",
      },
    });

  const submit = async (data) => {
    try {
      if (post) {
        const file = data.image[0]
          ? await storageService.uploadFile(data.image[0])
          : null;

        if (file) {
          if (post.featuredImage) {
            await storageService.deleteFile(post.featuredImage);
          }
        }

        const postDataForThunk = {
          ...data,
          status: data.status === "active",
          featuredImage: file ? file.$id : post.featuredImage,
        };

        const updatedPost = await dispatch(
          updateExistingPost({ postId: post.$id, postData: postDataForThunk })
        ).unwrap();

        if (updatedPost) {
          navigate(`/post/${updatedPost.$id}`);
        }
      } else {
        const postDataForThunk = {
          ...data,
          userId: userData?.$id,
          status: data.status === "active",

          featuredImage: data.image[0] ? data.image[0] : null,
        };

        const newPost = await dispatch(addNewPost(postDataForThunk)).unwrap();

        if (newPost) {
          navigate(`/post/${newPost.$id}`);
        }
      }
    } catch (error) {
      console.error("Failed to submit post:", error);
    }
  };

  const generateSlug = useCallback((value) => {
    if (value && typeof value === "string")
      return value
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .trim();
    return "";
  }, []);

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === "title") {
        setValue("slug", generateSlug(value.title), { shouldValidate: true });
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, setValue, generateSlug]);

  return (
    <form onSubmit={handleSubmit(submit)} className="p-4 flex flex-wrap gap-8">
      <div className="w-full md:w-2/3 space-y-4">
        <Input
          label="Title:"
          placeholder="Your Awesome Title"
          {...register("title", { required: "Title is required" })}
        />
        <Input
          label="Slug:"
          placeholder="your-awesome-title"
          readOnly
          {...register("slug", { required: "Slug is required" })}
        />
        <RTE
          label="Content:"
          name="content"
          control={control}
          defaultValue={getValues("content")}
        />
      </div>
      <div className="w-full md:w-1/3 space-y-4">
        <Input
          label="Featured Image:"
          type="file"
          accept="image/png, image/jpeg, image/gif, image/webp"
          {...register("image")}
        />
        {post && post.featuredImage && (
          <div className="w-full mb-4">
            <img
              src={storageService.getFilePreview(post.featuredImage)}
              alt={post.title}
              className="rounded-lg"
            />
          </div>
        )}
        <Select
          label="Status:"
          options={["active", "inactive"]}
          {...register("status")}
        />
        <Button type="submit" className="w-full bg-black">
          {post ? "Update Post" : "Create Post"}
        </Button>
      </div>
    </form>
  );
}
