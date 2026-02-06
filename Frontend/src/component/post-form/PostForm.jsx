import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button, Input, Select, RTE } from "../index";
import PostService from "../../services/config";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function PostForm({ post }) {
  const navigate = useNavigate();
  const userData = useSelector((state) => state.auth.userData);
  const mode = useSelector((state) => state.theme.mode);
  const isDark = mode === "dark";

  const [preview, setPreview] = useState(post?.featuredImage || "");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    getValues,
  } = useForm({
    defaultValues: {
      title: post?.title || "",
      slug: post?.slug || "",
      content: post?.content || "",
      status: post?.status || "active",
    },
  });

  // slug generator
  const slugTransform = useCallback((value) => {
    if (typeof value === "string") {
      return value
        .trim()
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-");
    }
    return "";
  }, []);

  // auto slug only when empty
  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === "title" && !getValues("slug")) {
        setValue("slug", slugTransform(value.title), {
          shouldValidate: true,
        });
      }
    });

    return () => subscription.unsubscribe();
  }, [watch, slugTransform, setValue, getValues]);

  // set content on edit
  useEffect(() => {
    if (post?.content) {
      setValue("content", post.content);
    }
  }, [post, setValue]);

  // image preview
  const imageWatch = watch("image");

  useEffect(() => {
    if (imageWatch?.[0]) {
      const file = imageWatch[0];
      setPreview(URL.createObjectURL(file));
    }
  }, [imageWatch]);

  const submit = async (data) => {
  try {
    if (!userData?._id) return;

    const formData = new FormData();

    formData.append("title", data.title);
    formData.append("slug", data.slug);
    formData.append("content", data.content);
    formData.append("status", data.status);
    formData.append("userId", userData._id);

    if (data.image?.[0]) {
      formData.append("image", data.image[0]);
    }

    if (post?.featuredImage && !data.image?.[0]) {
      formData.append("featuredImage", post.featuredImage);
    }

    const response = post
      ? await PostService.updatePost(post._id, formData)
      : await PostService.createPost(formData);

    const createdPost =
      response?.data?.data ||
      response?.data?.post ||
      response?.data;

    if (!createdPost?._id) {
      console.log("Post id missing:", response);
      return;
    }
    console.log(response);
    navigate(`/post/${createdPost._id}`);
  } catch (error) {
    console.error("Post submit error:", error);
  }
}
;

  return (
    <form
      onSubmit={handleSubmit(submit)}
      className={`flex flex-wrap p-4 rounded-lg ${
        isDark ? "bg-gray-800 text-gray-100" : "bg-white text-black"
      }`}
    >
      {/* LEFT */}

      <div className="w-2/3 px-2 space-y-4">
        <Input
          label="Title"
          {...register("title", { required: "Title required" })}
        />


        <RTE
          key={post?._id}
          label="Content"
          name="content"
          control={control}
        />
      </div>

      {/* RIGHT */}

      <div className="w-1/3 px-2 space-y-4">
        <Input
          type="file"
          accept="image/*"
          {...register("image", {
            required: post ? false : "Image required",
          })}
        />

        {preview && (
          <img
            src={preview}
            className="rounded-lg w-full object-cover"
            alt="preview"
          />
        )}

        <Select options={["active", "inactive"]} {...register("status")} />

        <Button type="submit" className="w-full">
          {post ? "Update Post" : "Create Post"}
        </Button>
      </div>
    </form>
  );
}
