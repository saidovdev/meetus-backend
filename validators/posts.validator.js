import User from "../models/User.js";
import mongoose from "mongoose";

export const validateProject = async (body) => {
  let {
    title,
    shortDescription,
    github,
    link,
    location,
    tags,
    category,
    skills,
    live,
    youtube,
    status,
    collaborators,
  } = body;

  if (!title || !tags) return { error: "Missing required fields" };
  if (shortDescription && shortDescription.length > 150)
    return { error: "Short Description is too long" };
  if (title.length > 30) return { error: "Title is too long" };

  if (github && !github.startsWith("https://github.com/"))
    return { error: "Github repository must start with https://github.com/" };
  if (link && !link.startsWith("https://"))
    return { error: "Link must start with https://" };
  if (live && !live.startsWith("https://"))
    return { error: "Live link must start with https://" };
  if (youtube && !youtube.startsWith("https://youtube.com"))
    return { error: "Youtube video must start with https://youtube.com" };

  try {
    skills = typeof skills === "string" ? JSON.parse(skills) : skills || [];
  } catch (e) {
    skills = [];
  }


  
  try {

    collaborators =
      typeof collaborators === "string"
        ? JSON.parse(collaborators)
        : collaborators || [];
  } catch (e) {
    collaborators = [];
  }

  let notExistingUsers = [];
  let allCollaborators = [];
  for (const item of collaborators) {
    if (!item.userId) continue;
    const userExist = await User.findById(item.userId);
    if (userExist) {
      allCollaborators.push({
        userId: new mongoose.Types.ObjectId(item.userId),
        role: item.role,
      });
    } else {
      notExistingUsers.push(item);
    }
  }
  category = category || undefined;
  status = status || "in-progress";

  const data = {
    title,
    shortDescription,
    fullDescription: body.fullDescription || "",
    github: github || "",
    link: link || "",
    location,
    tags: Array.isArray(tags) ? tags : tags.split(",").map((t) => t.trim()),
    skills,
    collaborators: allCollaborators,
    category,
    status,
    live: live || "",
    youtube: youtube || "",
  };

  if (notExistingUsers.length > 0)
    return {
      message: "Some collaborators do not exist",
      notExistingUsers,
      data,
    };

  return { data };
};
