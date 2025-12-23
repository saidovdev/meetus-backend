import mongoose from "mongoose";

const PostSchema = mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "jobusers" },

    images: [
      {
        imageUrl: { type: String },
        imageId: { type: String },
      },
    ],

    videoUrl: { type: String },
    videoId: { type: String },

    title: { type: String, required: true },

    shortDescription: { type: String, maxlength: 180 },
    fullDescription: { type: String },
    skills: {
      type: [String],
      set: (v) => v.map((s) => s.trim().toLowerCase()),
    },

    category: {
      type: String,
      default: "other",
    },

    live: String,
    github: String,
    youtube: String,
    link: String,
    likes: [
      {
        likedBy: { type: mongoose.Schema.Types.ObjectId, ref: "jobusers" },
      },
    ],

    saves: [{ type: mongoose.Schema.Types.ObjectId, ref: "jobusers" }],
    views: { type: Number, default: 0 },
    location: { type: String },
    tags: { type: [String], default: [] },

    spamedBy: [
      {
        spamedUserId: { type: String },
        reason: { type: String },
        createdAt: { type: Date, default: Date.now },
      },
    ],

    status: {
      type: String,
      enum: ["draft", "published", "in-progress", "completed", "archived"],
      default: "published",
    },

    collaborators: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "jobusers" },
        role: String,
        accepted: { type: Boolean, default: false },
      },
    ],

    savedBy: { type: [String], default: [] },
    reports: [
      {
        reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: "jobusers" },
        reason: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("UserPosts", PostSchema);
