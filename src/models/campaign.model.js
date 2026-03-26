import mongoose from "mongoose";

const campaignSchema = new mongoose.Schema(
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

    targetAmount: {
        type: Number,
        required: true
    },

    currentAmount: {
        type: Number,
        default: 0
    },

    startDate: {
        type: Date,
        required: true
    },

    endDate: {
        type: Date,
        required: true
    },

    status: {
        type: String,
        enum: ["draft", "active", "completed", "expired"],
        default: "draft"
    },

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }

},
{ timestamps: true }
);

export const Campaign = mongoose.model("Campaign", campaignSchema);