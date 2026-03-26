import { asyncHandler } from "../utils/asynchandler.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { Donation } from "../models/donation.model.js";
import { Campaign } from "../models/campaign.model.js";


/*
---------------------------------------
1️⃣ CREATE DONATION
---------------------------------------
*/

export const createDonation = asyncHandler(async (req, res) => {

    const { campaignId, amount, message, isAnonymous } = req.body;

    if (!campaignId || !amount) {
        throw new apiError(400, "Campaign ID and amount are required");
    }

    if (amount <= 0) {
        throw new apiError(400, "Donation amount must be greater than 0");
    }

    const campaign = await Campaign.findById(campaignId);

    if (!campaign) {
        throw new apiError(404, "Campaign not found");
    }

    if (campaign.status !== "active") {
        throw new apiError(400, "Campaign is not active");
    }
    if (campaign.currentAmount >= campaign.targetAmount) {
      throw new apiError(400, "Campaign target already achieved");
    }
    const donation = await Donation.create({
        userId: req.user._id,
        campaignId,
        amount,
        message,
        isAnonymous
    });

    return res.status(201).json(
        new apiResponse(201, donation, "Donation created successfully")
    );

});



/*
---------------------------------------
2️⃣ COMPLETE DONATION
(Update campaign currentAmount)
---------------------------------------
*/

export const completeDonation = asyncHandler(async (req, res) => {

    const { donationId, transactionId } = req.body;

    const donation = await Donation.findById(donationId);

    if (!donation) {
        throw new apiError(404, "Donation not found");
    }

    if (donation.paymentStatus === "completed") {
        throw new apiError(400, "Donation already completed");
    }

    donation.paymentStatus = "completed";
    donation.transactionId = transactionId;

    await donation.save();

    const campaign = await Campaign.findById(donation.campaignId);

    campaign.currentAmount += donation.amount;

    if (campaign.currentAmount >= campaign.targetAmount) {
        campaign.status = "completed";
    }

    await campaign.save();

    return res.status(200).json(
        new apiResponse(200, donation, "Donation completed successfully")
    );

});



/*
---------------------------------------
3️⃣ GET MY DONATIONS
---------------------------------------
*/

export const getMyDonations = asyncHandler(async (req, res) => {

    const donations = await Donation.find({
        userId: req.user._id
    })
    .populate("campaignId", "title targetAmount")
    .sort({ createdAt: -1 });

    return res.status(200).json(
        new apiResponse(200, donations, "User donations fetched")
    );

});



/*
---------------------------------------
4️⃣ ADMIN GET ALL DONATIONS
---------------------------------------
*/

export const getAllDonations = asyncHandler(async (req, res) => {

    const donations = await Donation.find()
        .populate("userId", "name email")
        .populate("campaignId", "title")
        .sort({ createdAt: -1 });

    return res.status(200).json(
        new apiResponse(200, donations, "All donations fetched")
    );

});

  export const getDonationStats = async (req, res) => {

    try {
  
      const totalDonations = await Donation.countDocuments();
  
      const totalAmountAgg = await Donation.aggregate([
        {
          $match: { paymentStatus: "completed" }
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$amount" }
          }
        }
      ]);
  
      const campaigns = await Campaign.find();
  
      const totalAmount =
        totalAmountAgg.length > 0 ? totalAmountAgg[0].total : 0;
  
      res.status(200).json({
        success: true,
        data: {
          totalDonations,
          totalAmount,
          campaigns
        }
      });
  
    } catch (error) {
  
      res.status(500).json({
        success: false,
        message: error.message
      });
  
    }
  
  };
  


  export const updateDonationStatus = async (req, res) => {

    try {
  
      const { id } = req.params;
      const { status } = req.body;
  
      const donation = await Donation.findById(id);
  
      if (!donation) {
        return res.status(404).json({
          success: false,
          message: "Donation not found"
        });
      }
  
      // prevent double approval
      if (donation.paymentStatus === "completed") {
        return res.status(400).json({
          success: false,
          message: "Donation already approved"
        });
      }
  
      donation.paymentStatus = status;
      await donation.save();
  
      if (status === "completed") {
  
        const campaign = await Campaign.findById(donation.campaignId);
  
        // update campaign amount
        campaign.currentAmount += donation.amount;
  
        // check target reached
        if (campaign.currentAmount >= campaign.targetAmount) {
          campaign.status = "completed";
        }
  
        await campaign.save();
      }
  
      res.status(200).json({
        success: true,
        message: "Donation status updated successfully"
      });
  
    } catch (error) {
  
      res.status(500).json({
        success: false,
        message: error.message
      });
  
    }
  
  };