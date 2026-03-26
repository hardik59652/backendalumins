import { asyncHandler } from "../utils/asynchandler.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { Campaign } from "../models/campaign.model.js";

export const createCampaign = asyncHandler(async (req, res) => {
    console.log(req.body)
    const { title, description, targetAmount, startDate, endDate } = req.body;

    // validation
    if (!title || !description || !targetAmount || !startDate || !endDate) {
        throw new apiError(400, "All fields are required");
    }

    // check date logic
    if (new Date(endDate) <= new Date(startDate)) {
        throw new apiError(400, "End date must be greater than start date");
    }

    const campaign = await Campaign.create({
        title,
        description,
        targetAmount,
        startDate,
        endDate,
        createdBy: req.user._id
    });

    return res.status(201).json(
        new apiResponse(201, campaign, "Campaign created successfully")
    );

});
export const publishCampaign = asyncHandler(async (req, res) => {

    const { id } = req.params;

    const campaign = await Campaign.findById(id);

    if (!campaign) {
        throw new apiError(404, "Campaign not found");
    }

    if (campaign.status !== "draft") {
        throw new apiError(400, "Only draft campaigns can be published");
    }

    campaign.status = "active";

    await campaign.save();

    return res.status(200).json(
        new apiResponse(200, campaign, "Campaign published successfully")
    );

});
export const getAllCampaigns = asyncHandler(async (req, res) => {

    const campaigns = await Campaign.find()
        .sort({ createdAt: -1 })
        .populate("createdBy", "name email");

    return res.status(200).json(
        new apiResponse(200, campaigns, "All campaigns fetched successfully")
    );

});
export const getActiveCampaigns = asyncHandler(async (req, res) => {

    const campaigns = await Campaign.find({
        status: "active"
    }).sort({ createdAt: -1 });

    const filteredCampaigns = campaigns.filter(
        c => c.currentAmount < c.targetAmount
    );

    return res.status(200).json(
        new apiResponse(200, filteredCampaigns, "Active campaigns fetched")
    );

});
// export const getActiveCampaigns = asyncHandler(async (req, res) => {

//     const campaigns = await Campaign.find({
//         status: "active"
//     }).sort({ createdAt: -1 });

//     return res.status(200).json(
//         new apiResponse(200, campaigns, "Active campaigns fetched")
//     );

// });
export const checkExpiredCampaigns = asyncHandler(async () => {

    const now = new Date();

    const campaigns = await Campaign.find({
        status: "active",
        endDate: { $lt: now }
    });

    for (const campaign of campaigns) {

        campaign.status = "expired";

        await campaign.save();

    }

});