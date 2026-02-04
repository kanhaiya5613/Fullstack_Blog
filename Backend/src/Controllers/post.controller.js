import { Post } from "../Models/post.model.js";
import { asyncHandler } from "../Utils/AsyncHandler.js";
import { ApiError } from "../Utils/ApiError.js";
import { ApiResponse } from "../Utils/ApiResponse.js";
import {
  uploadOnCloudinary,
  deleteFromCloudinary,
} from "../Utils/Cloudinary.js";

export const createPost = asyncHandler(async (req, res) => {
  // Auth guard
  if (!req.user?._id) {
    throw new ApiError(401, "Unauthorized access");
  }

  const { title, content, status } = req.body || {};

  // Validation (safe)
  if (!title?.trim() || !content?.trim()) {
    throw new ApiError(400, "Title and content are required");
  }

  // Image validation
  const featuredImagePath = req.file?.path;

  if (!featuredImagePath) {
    throw new ApiError(400, "Featured image is required");
  }

  // Upload to Cloudinary
  const cloudinaryResponse = await uploadOnCloudinary(featuredImagePath);

  if (!cloudinaryResponse?.secure_url || !cloudinaryResponse?.public_id) {
    throw new ApiError(500, "Failed to upload image to Cloudinary");
  }

  // Create post
  const post = await Post.create({
    title: title.trim(),
    content,
    featuredImage: {
      url: cloudinaryResponse.secure_url,
      publicId: cloudinaryResponse.public_id,
    },
    status: status || "active",
    author: req.user._id,
  });

  if (!post) {
    // rollback cloudinary if DB fails
    await deleteFromCloudinary(cloudinaryResponse.public_id);
    throw new ApiError(500, "Post creation failed");
  }

  return res.status(201).json(
    new ApiResponse(201, { post }, "Post created successfully")
  );
});
