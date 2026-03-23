import express from "express"
import { verifyJWT } from "../middleware/auth.middleware.js"
import { uploadResume } from "../middleware/upload.middleware.js"

import { 
    createApplication,
    getJobApplicationForJob,
    updateApplicationStatus,
    getMyJobApplication,
 } from "../controllers/jobApplication.controller.js"
 const router =express.Router()
 router.route(
    "/apply/:jobId").post(
    verifyJWT,
    uploadResume.single("resume"),
    createApplication
  );
  router.route("/job/:jobId").get(
    verifyJWT,
    getJobApplicationForJob
  )
  router.route("/status/:id").patch(
    verifyJWT,
    updateApplicationStatus
  )
  router.route("/myApplications").get(
    verifyJWT,
    getMyJobApplication
  )
  export default router;