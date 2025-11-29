export const validateProject = (body) => {
  const { title, desc, githubLink, link, location, tags } = body;

  if (!title || !location || !tags) return "Missing required fields";
  if (desc && desc.length > 700) return "Description is too long";
  if (title.length > 30) return "Title is too long";
  if (githubLink && !githubLink.startsWith("https://github.com/"))
    return "Github link must start with https://github.com/";
  if (link && !link.startsWith("https://"))
    return "Link must start with https://";

  return null;
};
