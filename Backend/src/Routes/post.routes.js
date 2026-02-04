import {Router} from "express";
import { createPost,updatePost,deletePost } from "../Controllers/post.controller.js";
import { verifyJWT } from "../Middlewares/auth.middleware.js";
import {upload} from "../Middlewares/multer.middleware.js";
const router = Router()
router.post("/createPost", verifyJWT, upload.single("featuredImage"), createPost);
router.put("/updatePost/:postId", verifyJWT, upload.single("featuredImage"), updatePost);
router.delete("/deletePost/:postId", verifyJWT, deletePost);
export default router;