import express from "express"
import { verifyJWT } from "../middleware/auth.middleware.js"
import {verifyAdmin} from "../middleware/admin.middleware.js"
import {upload} from "../middleware/upload.middleware.js"
import {
    createAchievement,
    getmyAchievements,
    getApprovedAchievements,
    approveAchievement,
    rejectAchievement,
    getPendingAchievements
} from "../controllers/achievements.controllers.js"
const router=express.Router()
router.route("/create").post(
    verifyJWT,
    upload.single("photo"),
    createAchievement
)
router.route("/my-achievements").get(
    verifyJWT,
    getmyAchievements
)
router.route("/approved").get(
    getApprovedAchievements
)
router.route("/approve/:id").patch(
    verifyJWT,
    verifyAdmin,
    approveAchievement
)
router.route("/reject/:id").patch(
    verifyJWT,
    verifyAdmin,
    rejectAchievement
)
router.route("/pending").get(
verifyJWT,
verifyAdmin,
getPendingAchievements
)
export default router
