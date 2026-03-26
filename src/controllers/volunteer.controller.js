import { Volunteer } from "../models/volunteer.model.js";
import { asyncHandler } from "../utils/asynchandler.js";
import { apiResponse } from "../utils/apiResponse.js";
import { apiError } from "../utils/apiError.js";


/* =============================
   APPLY AS VOLUNTEER
============================= */

export const applyVolunteer = asyncHandler(async (req, res) => {

  const { domains, motivation, availability } = req.body;

  const existing = await Volunteer.findOne({ userId: req.user._id });

  if (existing) {
    throw new apiError(400, "You already applied for volunteer");
  }

  const volunteer = await Volunteer.create({
    userId: req.user._id,
    domains,
    motivation,
    availability
  });

  res.status(201).json(
    new apiResponse(201, volunteer, "Volunteer application submitted")
  );

});


/* =============================
   GET APPROVED VOLUNTEERS
============================= */

export const getVolunteers = asyncHandler(async (req, res) => {

  const volunteers = await Volunteer.find({ status: "approved" })
  .populate("userId", "name batchYear linkedin_url profilePicture");

  res.status(200).json(
    new apiResponse(200, volunteers, "Volunteers fetched successfully")
  );

});


/* =============================
   GET PENDING VOLUNTEERS (ADMIN)
============================= */

export const getPendingVolunteers = asyncHandler(async (req, res) => {

  const volunteers = await Volunteer.find({ status: "pending" })
  .populate("userId", "name email batchYear linkedin_url");

  res.status(200).json(
    new apiResponse(200, volunteers, "Pending volunteers fetched")
  );

});


/* =============================
   APPROVE VOLUNTEER (ADMIN)
============================= */

export const approveVolunteer = asyncHandler(async (req, res) => {

  const volunteer = await Volunteer.findById(req.params.id);

  if (!volunteer) {
    throw new apiError(404, "Volunteer application not found");
  }

  volunteer.status = "approved";
  volunteer.approvedAt = new Date();

  await volunteer.save();

  res.status(200).json(
    new apiResponse(200, volunteer, "Volunteer approved successfully")
  );

});



/* =============================
   GET MY VOLUNTEER APPLICATION
============================= */

export const getMyVolunteerApplication = asyncHandler(async (req, res) => {

  const volunteer = await Volunteer.findOne({ userId: req.user._id })
    .populate("userId", "name batchYear linkedin_url profilePicture");

  if (!volunteer) {
    throw new apiError(404, "Volunteer application not found");
  }

  res.status(200).json(
    new apiResponse(200, volunteer, "Volunteer application fetched")
  );

});