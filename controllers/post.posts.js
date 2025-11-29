import Post from "../models/Post.js";
import { validateProject } from "../validators/posts.validator.js";

import {
  updateProjectFields,
  uploadImagesToCloud,
} from "../services/posts.service.js";

import {
  checkVideo,
  deleteCloudVideo,
  deleteProjectVideo,
  handleVideoUpdate,
} from "../services/video.service.js";

import { validateIds } from "../validators/posts.id.validator.js";
import { putUploadedImage } from "../services/image.service.js";

export const post_projects_with_images = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log(req.body);

    const error = validateProject(req.body);

    if (error) return res.status(400).json({ warning: error });

    const images = req.files?.length
      ? await uploadImagesToCloud(req.files)
      : [];

    const project = new Post({ userId, ...req.body, images });
    await project.save();

    return res.status(200).json({ success: "Project created successfully" });
  } catch (error) {
    console.log("Error creating post:", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const post_project_with_video = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!req.file) return res.status(400).json({ warning: "Video required" });

    const info = await checkVideo(req.file.filename);

    if (typeof info === "string") {
      await deleteCloudVideo(req.file.filename);
      return res.status(400).json({ warning: info });
    }

    const error = validateProject(req.body);
    if (error) return res.status(400).json({ warning: error });

    const newProject = new Post({
      userId,
      ...req.body,
      videoUrl: info.secure_url,
      videoId: info.public_id,
    });

    await newProject.save();

    return res.status(200).json({ success: "Project created successfully" });
  } catch (error) {
    console.log("Error creating post:", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const put_project_with_image = async (req, res) => {
  const userId = req.user.id;
  const postId = req.params.id;
  const imageUrl = req.file?.path;
  const { imageId } = req.body;

  if (!postId)
    return res.status(400).json({ warning: "Post id is not defined" });

  if (!imageId)
    return res.status(400).json({ warning: "Image id is not defined" });

  try {
    const validate = await validateIds(userId, postId);
    if (validate) return res.status(400).json({ warning: validate });

    const result = await putUploadedImage(postId, imageId, imageUrl);

    return res.status(200).json({ success: result });
  } catch (error) {
    console.log("Error occurred while updating image:", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const put_project_with_video = async (req, res) => {
  const userId = req.user.id;
  const postId = req.params.id;
  const { videoId } = req.body;

  if (!postId || !videoId)
    return res.status(400).json({ warning: "Video and post id is required" });

  try {
    const validate = await validateIds(userId, postId);
    if (validate) return res.status(400).json({ warning: validate });

    const project = await Post.findById(postId);
    if (!project) return res.status(404).json({ warning: "Project not found" });

    if (req.file) {
      const result = await handleVideoUpdate(project, req.file.filename);
      return res.status(200).json({ success: result });
    }

    const deleted = await deleteProjectVideo(project);

    return res.status(200).json({ success: deleted });
  } catch (error) {
    console.log("Error while updating video:", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const put_project = async (req, res) => {
  const userId = req.user.id;
  const postId = req.params.id;

  if (!postId)
    return res.status(400).json({ warning: "Post id is not defined" });

  try {
    const validate = await validateIds(userId, postId);
    if (validate) return res.status(400).json({ warning: validate });

    const project = await Post.findById(postId);
    if (!project) return res.status(404).json({ warning: "Project not found" });

    const result = await updateProjectFields(project, req.body);

    if (result === "Nothing to update")
      return res.status(304).json({ warning: result });

    return res.status(200).json({ success: result });
  } catch (error) {
    console.log("Error while updating post:", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const delete_project = async (req, res) => {
  const userId = req.user.id;
  const postId = req.params.id;

  if (!postId)
    return res.status(400).json({ warning: "Post id is not defined" });

  try {
    const validate = await validateIds(userId, postId);
    if (validate) return res.status(400).json({ warning: validate });

    const project = await Post.findById(postId);
    if (!project) return res.status(404).json({ warning: "Project not found" });

    await project.deleteOne();

    return res.status(200).json({ success: "Project deleted successfully" });
  } catch (error) {
    console.log("Error while deleting project:", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const get_my_projects = async (req, res) => {
  try {
    const userId = req.user.id;

    const projects = await Post.find({ userId });

    if (!projects.length)
      return res
        .status(200)
        .json({ success: false, message: "You don't have posts" });

    return res.status(200).json({
      success: true,
      message: "Your posts",
      posts: projects,
    });
  } catch (error) {
    console.log("Error while getting posts:", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};
