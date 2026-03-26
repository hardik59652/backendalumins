import { Reunion } from "../models/reunion.model.js";
import { asyncHandler } from "../utils/asynchandler.js";
import { apiResponse } from "../utils/apiResponse.js";
import { apiError } from "../utils/apiError.js";

export const createReunion = asyncHandler(async (req, res) => {

  const { title, description, date, location, highlights } = req.body;

  const reunion = await Reunion.create({
    title,
    description,
    date,
    location,
    highlights: highlights ? JSON.parse(highlights) : [],
    bannerImage: req.file?.path
  });

  res.status(201).json(
    new apiResponse(201, reunion, "Reunion created")
  );

});

export const getReunion = asyncHandler(async (req, res) => {

  const reunion = await Reunion.findOne().sort({ createdAt: -1 });

  if (!reunion) {
    throw new apiError(404, "Reunion not found");
  }

  res.status(200).json(
    new apiResponse(200, reunion, "Reunion fetched")
  );

});