import cloudinary from "../config/cloudinary.js";
import Post from "../models/Post.js";
export const uploadImagesToCloud = async (files) => {
  const uploaded = [];

  for (const file of files) {
    const result = await cloudinary.uploader.upload(file.path, {
      folder: "project_images",
    });

    uploaded.push({
      imageUrl: result.secure_url,
      imageId: result.public_id,
    });
  }

  return uploaded;
};
export const putUploadedImage = async (postId, imageId, imageUrl) => {
  const project = await findById(postId);
  const image = project?.images.find((i) => i.imageId === imageId);

  if (imageUrl) {
    await cloudinary.uploader.destroy(image.imageId);

    const uploader = await cloudinary.uploader.upload(imageUrl, {
      folder: "project_images",
    });
    image.imageUrl = uploader.secure_url;
    image.imageId = uploader.public_id;
    await project.save();
    return "Image updated successfully";
  }
  await cloudinary.uploader.destroy(image.imageId);
  image.imageUrl = "";
  image.imageId = "";
  await project.save();
  return "Image deleted successfully";
};
