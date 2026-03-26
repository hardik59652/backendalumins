import mongoose from "mongoose";

const donationSchema = new mongoose.Schema(
{
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    campaignId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Campaign",
        required: true
    },

    amount: {
        type: Number,
        required: true
    },

    message: {
        type: String,
        default: ""
    },

    isAnonymous: {
        type: Boolean,
        default: false
    },

    paymentStatus: {
        type: String,
        enum: ["pending", "completed", "failed"],
        default: "pending"
    },

    transactionId: {
        type: String
    },

    donationDate: {
        type: Date,
        default: Date.now
    }

},
{ timestamps: true }
);

export const Donation = mongoose.model("Donation", donationSchema);