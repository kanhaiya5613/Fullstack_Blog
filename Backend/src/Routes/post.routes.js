import {Router} from "express";
import { createPost,updatePost,deletePost, getPost, getPosts } from "../Controllers/post.controller.js";
import { verifyJWT } from "../Middlewares/auth.middleware.js";
import {upload} from "../Middlewares/multer.middleware.js";
const router = Router()
router.post("/", verifyJWT, upload.single("image"), createPost);
router.put("/:postId", verifyJWT, upload.single("image"), updatePost);
router.delete("/:postId", verifyJWT, deletePost);
router.get("/:postId", getPost);
router.get("/", getPosts);

export default router;
