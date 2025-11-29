import Post from "../models/Post.js";

export const validateIds = async (userId, postId, imageId) => {
  const project = await Post.findById(postId);

  if (!project) return "project / post not found";

  if (String(project.userId) !== String(userId))
    return "Project owner is not defined";
  const image = project?.images.find((i) => i.imageId === imageId);
  if (!image) return "Image not found";
  return null;
};
