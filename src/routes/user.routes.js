import { Router } from "express";
import { logoutUser, loginUser, registerUser ,getCurrentUser} from "../controllers/user.controller.js";
import {upload} from "../middleware/upload.middleware.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
const router=Router()
router.route("/register").post(
    upload.fields([
        {
            name:"profileImage",
            maxCount:1
            
        }
    ]),
    registerUser
)
router.route("/login").post(
   
    loginUser

)
router.route("/logout").post(
   verifyJWT,
    logoutUser
)
router.get("/current-user", verifyJWT, getCurrentUser);

export default router