import {Router} from "express";
import { createPost } from "../Controllers/post.controller.js";
import { verifyJWT } from "../Middlewares/auth.middleware.js";
import {upload} from "../Middlewares/multer.middleware.js";
const router = Router()
router.post("/createPost", verifyJWT, upload.single("featuredImage"), createPost);

export default router;