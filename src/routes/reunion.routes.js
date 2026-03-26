import express from "express";
import { createReunion, getReunion } from "../controllers/reunion.controller.js";
import { uploadReunion } from "../middleware/upload.middleware.js";
const router = express.Router();

router.post("/create",uploadReunion.single("bannerImage"),createReunion);
router.get("/",getReunion);

export default router;