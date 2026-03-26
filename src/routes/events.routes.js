import express from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { verifyAdmin } from "../middleware/admin.middleware.js";
import { uploadEvent } from "../middleware/upload.middleware.js";

import {
  createEvent,
  publishEvent,
  getAllEvents,
  getPublishedEvents,
  registerForEvent,
  getMyRegisteredEvents
} from "../controllers/events.controller.js";

const router = express.Router();

/* =========================
   ADMIN ROUTES
========================= */

// create event (draft)
router.route("/create")
.post(verifyJWT, verifyAdmin, uploadEvent.single("image"), createEvent);

// publish event
router.route("/publish/:id")
.patch(verifyJWT, verifyAdmin, publishEvent);

// admin view all events
router.route("/all")
.get(verifyJWT, verifyAdmin, getAllEvents);


/* =========================
   PUBLIC ROUTES
========================= */

// fetch published events
router.route("/published")
.get(getPublishedEvents);


/* =========================
   ALUMNI ROUTES
========================= */

// register for event
router.route("/register/:eventId")
.post(verifyJWT, registerForEvent);

// my registered events
router.route("/my-events")
.get(verifyJWT, getMyRegisteredEvents);


export default router;