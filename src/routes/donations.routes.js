import { Router } from "express";

import {
createDonation,
completeDonation,
getMyDonations,
getAllDonations,
updateDonationStatus,
} from "../controllers/donations.controller.js"
import { getDonationStats } from "../controllers/donations.controller.js";

import { verifyJWT } from "../middleware/auth.middleware.js";
import { verifyAdmin } from "../middleware/admin.middleware.js";

const router = Router();

router.post("/create", verifyJWT, createDonation);

router.post("/complete", verifyJWT, completeDonation);
router.patch("/:id/status", verifyJWT, verifyAdmin, updateDonationStatus);
router.get("/my", verifyJWT, getMyDonations);
router.get("/stats", verifyJWT, verifyAdmin, getDonationStats);
router.get("/all", verifyJWT, verifyAdmin, getAllDonations);

export default router;