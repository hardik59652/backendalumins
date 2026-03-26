import express from "express";

import { verifyJWT } from "../middleware/auth.middleware.js";
import { verifyAdmin } from "../middleware/admin.middleware.js"

import {
  applyMentor,
  getMentors,
  getPendingMentors,
  approveMentor,
  getMyMentorApplication,
} from "../controllers/mentor.controller.js";

import {
  applyVolunteer,
  getVolunteers,
  getPendingVolunteers,
  approveVolunteer,
  getMyVolunteerApplication,
} from "../controllers/volunteer.controller.js";

const router = express.Router();


// =========================
// MENTOR ROUTES
// =========================

// apply mentor (logged in user)
router.post("/mentor/apply", verifyJWT, applyMentor);

// get approved mentors (public page)
router.get("/mentors", getMentors);

// admin only
router.get("/mentor/pending", verifyJWT, verifyAdmin, getPendingMentors);

// admin approval
router.patch("/mentor/approve/:id", verifyJWT, verifyAdmin, approveMentor);


router.get("/mentor/my", verifyJWT, getMyMentorApplication);

// =========================
// VOLUNTEER ROUTES
// =========================

// apply volunteer
router.post("/volunteer/apply", verifyJWT, applyVolunteer);

// public list
router.get("/volunteers", getVolunteers);

// admin only
router.get("/volunteer/pending", verifyJWT, verifyAdmin, getPendingVolunteers);

// admin approval
router.patch("/volunteer/approve/:id", verifyJWT, verifyAdmin, approveVolunteer);

router.get("/volunteer/my", verifyJWT, getMyVolunteerApplication);

export default router;