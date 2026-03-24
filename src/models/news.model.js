import mongoose from "mongoose";

const newsSchema = new mongoose.Schema(
{
  title: {
    type: String,
    required: true,
    trim: true
  },

  description: {
    type: String,
    required: true
  },

  image: {
    type: String
  },

  category: {
    type: String,
    enum: ["announcement", "achievement", "general"],
    default: "general"
  },

  isPublished: {
    type: Boolean,
    default: false
  },

  publishedAt: {
    type: Date
  }

},
{ timestamps: true }
);

export const News = mongoose.model("News", newsSchema);