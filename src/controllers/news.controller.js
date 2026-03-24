import { News } from "../models/news.model.js";
import { asyncHandler } from "../utils/asynchandler.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";




export const createNews = asyncHandler(async (req, res) => {
console.log(req.body)
  const { title, description, category, publish } = req.body;

  if (!title || !description) {
    throw new apiError(400, "Title and content are required");
  }
  const image = req.file ? `uploads/news/${req.file.filename}` : null;

  const news = await News.create({
    title,
    description,
    category,
    isPublished: publish === true,
    publishedAt: publish === true ? new Date() : null,
    image
  });

  return res
    .status(201)
    .json(new apiResponse(201, news, "News created successfully"));
});



export const getPublishedNews = asyncHandler(async (req, res) => {

  const news = await News
    .find({ isPublished: true })
    .sort({ publishedAt: -1 });

  return res
    .status(200)
    .json(new apiResponse(200, news, "Published news fetched"));
});



export const getAllNews = asyncHandler(async (req, res) => {

  const news = await News.find().sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new apiResponse(200, news, "All news fetched"));
});



export const publishNews = asyncHandler(async (req, res) => {

  const { id } = req.params;

  const news = await News.findById(id);

  if (!news) {
    throw new apiError(404, "News not found");
  }

  news.isPublished = true;
  news.publishedAt = new Date();

  await news.save();

  return res
    .status(200)
    .json(new apiResponse(200, news, "News published successfully"));
});