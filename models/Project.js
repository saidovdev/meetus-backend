import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "jobusers",
      required: true,
    },

    title: { type: String, required: true },
    shortDescription: { type: String, maxlength: 180 },
    fullDescription: { type: String },

    screenshots: [
      {
        url: String,
        urlId: String,
      },
    ],

    videoUrl: String,
    videoId: String,

    skills: {
      type: [String],
      set: (v) => v.map((s) => s.trim().toLowerCase()),
    },

    category: {
      type: String,
      enum: [
        "web-development",
        "mobile-development",
        "ui-ux",
        "graphic-design",
        "3d",
        "video-edit",
        "ai",
        "other",
      ],
      default: "other",
    },

    live: String,
    github: String,
    youtube: String,
    link: String,

    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "jobusers" }],
    saves: [{ type: mongoose.Schema.Types.ObjectId, ref: "jobusers" }],
    views: { type: Number, default: 0 },

    status: {
      type: String,
      enum: ["draft", "published", "in-progress", "completed", "archived"],
      default: "published",
    },

    collaborators: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "jobusers" },
        role: String,
      },
    ],

    commentsNumber: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("projects", projectSchema);
