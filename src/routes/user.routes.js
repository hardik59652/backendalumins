import { Router } from "express";
import { logoutUser, loginUser, registerUser ,getCurrentUser,updateUserProfile ,changePassword,  deleteAccount,} from "../controllers/user.controller.js";
import {uploadProfile} from "../middleware/upload.middleware.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
const router=Router()
router.route("/register").post(
    uploadProfile.fields([
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
router.route("/currentuser").get(
     verifyJWT, 
     getCurrentUser
)
router.route("/change-password").patch(
    verifyJWT,
    changePassword
)
router.route("/update-profile").patch(
    verifyJWT,
    uploadProfile.fields([
        {
            name: "profileImage",
            maxCount: 1
        }
    ]),
    updateUserProfile
)
router.route("/delete-account").delete(
    verifyJWT,
    deleteAccount
)
export default router