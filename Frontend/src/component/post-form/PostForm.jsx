import { useForm } from "react-hook-form";
import { Button, Input, Select, RTE } from "../index";
import appwriteService from "../../appwrite/config";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import React, { useCallback, useEffect } from "react";

export default function PostForm({ post }) {
  const { register, handleSubmit, watch, setValue, control, getValues } =
    useForm({
      defaultValues: {
        title: post?.title || "",
        slug: post?.slug || "",
        content: post?.content || "",
        status: post?.status || "active",
      },
    });

  const navigate = useNavigate();
  const userData = useSelector((state) => state.auth.userData);
  const mode = useSelector((state) => state.theme.mode);

  const isDark = mode === "dark";
  //console.log("PostForm Redux user:", userData);

  const submit = async (data) => {
    try {
      if (!userData){
        //console.log("Userdata is undefined")
        return;
      }

      let fileId = post?.featuredImage;

      if (data.image?.[0]) {
        const file = await appwriteService.uploadFile(data.image[0]);
        if (file) {
          if (post && post.featuredImage) {
            await appwriteService.deleteFile(post.featuredImage);
          }
          fileId = file.$id;
        }
      }

      const cleanData = {
        title: data.title,
        slug: data.slug,
        content: data.content,
        status: data.status,
        featuredImage: fileId,
        userId: userData.$id,
      };

      let dbPost;
      if (post) {
        dbPost = await appwriteService.updatePost(post.$id, cleanData);
      } else {
        dbPost = await appwriteService.createPost(cleanData);
      }

      if (dbPost) navigate(`/post/${dbPost.$id}`);
    } catch (error) {
      console.log("Post submit error:", error);
    }
  };

  const slugTransform = useCallback((value) => {
    if (value && typeof value === "string")
      return value
        .trim()
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-");
    return "";
  }, []);

  useEffect(() => {
    const sub = watch((values, { name }) => {
      if (name === "title") {
        setValue("slug", slugTransform(values.title), {
          shouldValidate: true,
        });
      }
    });

    return () => sub.unsubscribe();
  }, [watch, slugTransform, setValue]);

  return (
    <form
      onSubmit={handleSubmit(submit)}
      className={`flex flex-wrap p-4 rounded-lg transition-all ${
        isDark ? "bg-gray-800 text-gray-100" : "bg-white text-black"
      }`}
    >
      {/* LEFT */}
      <div className="w-2/3 px-2">
        <Input
          label="Title"
          placeholder="Title"
          className={`mb-4 ${isDark ? "bg-gray-700 text-white" : ""}`}
          {...register("title", { required: true })}
        />

        <Input
          label="Slug"
          placeholder="Slug"
          className={`mb-4 ${isDark ? "bg-gray-700 text-white" : ""}`}
          {...register("slug", { required: true })}
          onChange={(e) =>
            setValue("slug", slugTransform(e.target.value), {
              shouldValidate: true,
            })
          }
        />

        <RTE
          label="Content"
          name="content"
          control={control}
          defaultValue={getValues("content")}
        />
      </div>

      <div className="w-1/3 px-2">
        <Input
          label="Featured Image"
          type="file"
          className={`mb-4 ${isDark ? "bg-gray-700 text-white" : ""}`}
          accept="image/png, image/jpg, image/jpeg, image/gif"
          {...register("image", { required: !post })}
        />

        {post && (
          <img
            src={appwriteService.getFilePreview(post.featuredImage)}
            alt={post.title}
            className="rounded-lg mb-4"
          />
        )}

        <Select
          options={["active", "inactive"]}
          label="Status"
          className={`mb-4 ${isDark ? "bg-gray-700 text-white" : ""}`}
          {...register("status", { required: true })}
        />

        <Button
          type="submit"
          className={`w-full ${
            isDark ? "bg-indigo-600 text-white" : "bg-black text-white"
          }`}
        >
          {post ? "Update" : "Submit"}
        </Button>
      </div>
    </form>
  );
}
