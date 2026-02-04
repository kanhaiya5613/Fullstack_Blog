import {Post} from "../Models/post.model.js"
import { asyncHandler } from "../Utils/AsyncHandler.js"
import { ApiError } from "../Utils/ApiError.js"
import { ApiResponse } from "../Utils/ApiResponse.js"
import {uploadOnCloudinary,deleteFromCloudinary} from "../Utils/Cloudinary.js"
import { upload } from "../Middlewares/multer.middleware.js"

// Creating Post 
// steps
// get the details from req.body and req.file
// validate the details
// check if image/video available or not
// upload on cloudinary
// create post object - entry in db
// check for post creation
// return response
const createPost = asyncHandler(async (req, res) => {
    const { title, content, status } = req.body;

    // 1. Advanced Validation (Simplified example)
    const allowedStatus = ["active", "inactive"];
    if (status && !allowedStatus.includes(status)) {
        throw new ApiError(400, "Invalid status value");
    }

    // 2. File Check
    const localFilePath = req.file?.path;
    if (!localFilePath) {
        throw new ApiError(400, "Featured Image is required");
    }

    let cloudinaryResponse;
    try {
        // 3. Upload
        cloudinaryResponse = await uploadOnCloudinary(localFilePath);
        
        if (!cloudinaryResponse) {
            throw new ApiError(500, "Failed to upload to cloud");
        }

        // 4. DB Operation
        const post = await Post.create({
            title,
            content,
            featuredImage: {
                url: cloudinaryResponse.secure_url,
                publicId: cloudinaryResponse.public_id
            },
            status: status || "active",
            author: req.user._id
        });

        return res.status(201).json(
            new ApiResponse(201, post, "Post created successfully")
        );

    } catch (error) {
        // 5. CRITICAL: Cleanup
        // If DB fails, delete the image we just uploaded to Cloudinary
        if (cloudinaryResponse?.public_id) {
            await deleteFromCloudinary(cloudinaryResponse.public_id);
        }
        throw new ApiError(500, error?.message || "Post creation failed");
    }
});
const updatePost = asyncHandler(async (req, res) => {
  const postId = req.params.postId;

  // 1. Auth guard
  if (!req.user?._id) {
    throw new ApiError(401, "Unauthorized access");
  }

  // 2. Find existing post
  const post = await Post.findById(postId);

  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  // 3. Ownership check
  if (post.author.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not allowed to update this post");
  }

  // 4. Validate input
  const { title, content, status } = req.body || {};

  if (!title?.trim() || !content?.trim()) {
    throw new ApiError(400, "Title and content are required");
  }

  // 5. Optional image update
  let newImage = null;

  if (req.file?.path) {
    const uploaded = await uploadOnCloudinary(req.file.path);

    if (!uploaded?.secure_url || !uploaded?.public_id) {
      throw new ApiError(500, "Failed to upload new image");
    }

    newImage = {
      url: uploaded.secure_url,
      publicId: uploaded.public_id,
    };
  }

  // 6. Update fields
  post.title = title.trim();
  post.content = content.trim();
  post.status = status || post.status;

  if (newImage) {
    await deleteFromCloudinary(post.featuredImage.publicId);
    post.featuredImage = newImage;
  }

  await post.save();

  return res.status(200).json(
    new ApiResponse(200, { post }, "Post updated successfully")
  );
});

const deletePost = asyncHandler(async (req, res) => {
    const postId = req.params.postId;
    // steps 
    // Auth guard - verify user
    // find existing post
    // check ownership
    // delete from cloudinary
    // delete from db
    // return response
    
    // 1. Auth guard
    if(!req.user?.id){
        throw new ApiError(401,"Unauthorized access");
    }

    // 2. Find existing post
    const post = await Post.findById(postId);

    if(!post){
        throw new ApiError(404, "Post not found");
    }

    // 3. Ownership check
    if(post.author.toString() != req.user._id.toString()){
        throw new ApiError(403,"You are not allowed to delete this post");
    }
    // 4. Delete from Cloudinary
    await deleteFromCloudinary(post.featuredImage.publicId);

    // 5. Delete from DB
    await Post.findByIdAndDelete(postId);

    // 6. Return response
    return res.status(200).json(
        new ApiResponse(200, null, "Post deleted successfully")
    );

});

export {
    createPost,
    updatePost,
    deletePost
}