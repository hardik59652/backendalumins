import express from "express"
import { verifyJWT } from "../middleware/auth.middleware.js"
import { approveJob, createJobOpportunity, getApprovedJob, getMyJob, getPendingJob, rejctJob ,updateJob,getSingleJob,deleteJob} from "../controllers/jobOppertunity.controller.js"
import { verifyAdmin } from "../middleware/admin.middleware.js"
const router=express.Router()
router.route("/create").post(
    verifyJWT,
    createJobOpportunity)
router.route("/myjob").get(
    verifyJWT,
    getMyJob
)
router.route("/approved").get(
    getApprovedJob
)
router.put(
    "/update/:id",
    verifyJWT,
    updateJob
  );

//   router.get("/:id", verifyJWT, getSingleJob);
router.route("/pending").get(
    verifyJWT,
    verifyAdmin,
    getPendingJob
)
router.route("/approve/:id").patch(
    verifyJWT,
    verifyAdmin,
    approveJob
)
router.route("/reject/:id").patch(
    verifyJWT,
    verifyAdmin,
    rejctJob
)
router.route("/delete/:id").delete(
    verifyJWT,
    deleteJob
)
router.route("/:id").get(
    verifyJWT,
    getSingleJob
)
export default router
