import { Router } from "express";
import {
createCampaign,
publishCampaign,
getAllCampaigns,
getActiveCampaigns
} from "../controllers/campaign.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { verifyAdmin } from "../middleware/admin.middleware.js";
const router = Router();

router.post("/create", verifyJWT,verifyAdmin, createCampaign);

router.patch("/publish/:id", verifyJWT,verifyAdmin, publishCampaign);

router.get("/all", verifyJWT,verifyAdmin, getAllCampaigns);

router.get("/active", verifyJWT, getActiveCampaigns);

export default router;