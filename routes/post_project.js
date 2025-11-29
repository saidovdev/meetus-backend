import express from "express";
const router = express.Router();

import authenticateToken from "../middleware/authenticateToken.js";

import { uploadImages, uploadVideo } from "../middleware/uploadMiddleware.js";

import {
  post_projects_with_images,
  post_project_with_video,
  put_project_with_image,
  put_project_with_video,
  put_project,
  get_my_projects,
  delete_project,
} from "../controllers/post.posts.js";

router.use(authenticateToken);

router.post("/post_project_image", uploadImages, post_projects_with_images);

router.post("/post_project_video", uploadVideo, post_project_with_video);

router.put("/put_project_image/:id", uploadImages, put_project_with_image);

router.put("/put_project_video/:id", uploadVideo, put_project_with_video);

router.put("/put_project/:id", put_project);

router.delete("/delete_project/:id", delete_project);

router.get("/get_myprojects", get_my_projects);

export default router;
