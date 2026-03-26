import mongoose from "mongoose";

const mentorSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
   domains: [
      {
        type: String,
        required: true
      }
    ],

    motivation: {
      type: String,
      required: true,
      trim: true
    },
    availability: {
      type: String,
      enum: ["Weekends", "Evenings", "Flexible", "Monthly Sessions"],
      default: "Flexible"
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending"
    },

    approvedAt: {
      type: Date,
      default: null
    }
  },
  { timestamps: true }
);

export const Mentor = mongoose.model("Mentor", mentorSchema);