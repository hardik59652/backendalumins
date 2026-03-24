import express from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { verifyAdmin } from "../middleware/admin.middleware.js";
import { uploadNews } from "../middleware/upload.middleware.js";

import {
  createNews,
  getPublishedNews,
  getAllNews,
  publishNews
} from "../controllers/news.controller.js";

const router = express.Router();

router.post("/create", verifyJWT, verifyAdmin,  uploadNews.single("image"),createNews);
router.get("/admin/all", verifyJWT, verifyAdmin, getAllNews);
router.patch("/publish/:id", verifyJWT, verifyAdmin, publishNews);


router.get("/published", getPublishedNews);

export default router;