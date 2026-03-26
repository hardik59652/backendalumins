import { Mentor } from "../models/mentor.model.js";
import { asyncHandler } from "../utils/asynchandler.js";
import { apiResponse } from "../utils/apiResponse.js";
import { apiError } from "../utils/apiError.js";


/* =============================
   APPLY AS MENTOR
============================= */

export const applyMentor = asyncHandler(async (req, res) => {

  const { domains, motivation, availability } = req.body;

  const existing = await Mentor.findOne({ userId: req.user._id });

  if (existing) {
    throw new apiError(400, "You already applied for mentor");
  }

  const mentor = await Mentor.create({
    userId: req.user._id,
    domains,
    motivation,
    availability
  });

  res.status(201).json(
    new apiResponse(201, mentor, "Mentor application submitted")
  );
});


/* =============================
   GET APPROVED MENTORS
============================= */

export const getMentors = asyncHandler(async (req, res) => {

  const mentors = await Mentor.find({ status: "approved" })
  .populate("userId", "name batchYear linkedin_url profilePicture");

  res.status(200).json(
    new apiResponse(200, mentors, "Mentors fetched successfully")
  );

});


/* =============================
   GET PENDING MENTORS (ADMIN)
============================= */

export const getPendingMentors = asyncHandler(async (req, res) => {

  const mentors = await Mentor.find({ status: "pending" })
  .populate("userId", "name email batchYear linkedin_url");

  res.status(200).json(
    new apiResponse(200, mentors, "Pending mentors fetched")
  );

});


/* =============================
   APPROVE MENTOR (ADMIN)
============================= */

export const approveMentor = asyncHandler(async (req, res) => {

  const mentor = await Mentor.findById(req.params.id);

  if (!mentor) {
    throw new apiError(404, "Mentor application not found");
  }

  mentor.status = "approved";
  mentor.approvedAt = new Date();

  await mentor.save();

  res.status(200).json(
    new apiResponse(200, mentor, "Mentor approved successfully")
  );

});
/* =============================
   GET MY MENTOR APPLICATION
============================= */

export const getMyMentorApplication = asyncHandler(async (req, res) => {

    const mentor = await Mentor.findOne({ userId: req.user._id })
      .populate("userId", "name batchYear linkedin_url profilePicture");
  
    if (!mentor) {
      throw new apiError(404, "Mentor application not found");
    }
  
    res.status(200).json(
      new apiResponse(200, mentor, "Mentor application fetched")
    );
  
  });