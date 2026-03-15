import { asyncHandler } from "../utils/asynchandler.js"
import { apiError } from "../utils/apiError.js"

export const verifyAdmin = asyncHandler(async (req, res, next) => {

    if (!req.user) {
        throw new apiError(401, "Unauthorized request")
    }

    if (req.user.role !== "admin") {
        throw new apiError(403, "Access denied. Admin only.")
    }

    next()

})