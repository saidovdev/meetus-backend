import cloudinary from "../config/cloudinary.js";
import Post from "../models/Post.js";

export const uploadImagesToCloud = async (files) => {
  const images = [];

  for (const file of files) {
    const upload = await cloudinary.uploader.upload(file.path, {
      folder: "project_images",
    });

    images.push({
      imageUrl: upload.secure_url,
      imageId: upload.public_id,
    });
  }
  return images;
};

export const validateVideoInfo = async (publicId) => {
  const info = await cloudinary.api.resource(publicId, {
    resource_type: "video",
  });

  if (info.duration > 150) return "Video must be < 2:30";
  if (info.bytes > 40_000_000) return "Compressed video too large";

  return info;
};

export const updateProjectFields = async (project, fields) => {
  let update = false;
  for (const key in fields) {
    if (fields[key] !== undefined && fields[key] !== project[key]) {
      if (
        fields[key] === "githubLink" &&
        !fields[key].startsWith("https://github.com/")
      )
        continue;
      if (key === "link" && !fields[key].startsWith("https://")) continue;

      project[key] = fields[key];
      update = true;
    }
  }
  if (!update) return "Nothing to update";
  await project.save();
  return "Updated successfully";
};
