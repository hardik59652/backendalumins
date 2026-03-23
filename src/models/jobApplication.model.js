import mongoose from "mongoose";

const JobApplicationSchema = new mongoose.Schema(
  {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "JobOpportunity",
      required: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    resumeUrl: {
      type: String,
      required: true,
    },

    coverLetter: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "reviewed", "approved", "rejected"],
      default: "pending",
    },

    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    reviewedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// prevent duplicate applications for same job
JobApplicationSchema.index({ jobId: 1, userId: 1 }, { unique: true });

export const JobApplication = mongoose.model(
  "JobApplication",
  JobApplicationSchema
);