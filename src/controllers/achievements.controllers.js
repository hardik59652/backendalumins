import { asyncHandler } from "../utils/asynchandler.js";
import {apiError} from "../utils/apiError.js"
import {apiResponse} from "../utils/apiResponse.js"
import {Achievement} from "../models/achievement.model.js"

export const createAchievement = asyncHandler(async (req,res) => {
    const {title,category,description}=req.body
    if(!title||!category||!description){
        throw new apiError(400,"title, category and description is required")
    }
    const achievement=await Achievement.create(
        {
            userId:req.user._id,
            title,
            category,
            description,
            photo:req.file?.photo[0].path
        }

    )
    return res
    .status(200)
    .json(
        new apiResponse(201,achievement,"achievement submitted for approval")
    )
})
export const getmyAchievements =asyncHandler(async (req,res) => {
    const achievement=await Achievement.find({
        userId: req.user._id}
    ).sort({createdAt:-1})
    return res.status(200).json(
        new apiResponse(200,achievement,"User achievements fetched")
    )
    
})
export const getApprovedAchievements=asyncHandler(async (req,res) => {
    const achievement=await Achievement.find({
        status:"approved"

    }).populate("userId","fullName")
   return res.status(200).json(
    new apiResponse(200,achievement,"Approved achievements fetched")
   )
    
})
export const approveAchievement=asyncHandler(async (req,res) => {
    const {id}= req.params
    const achievement =await Achievement.findByIdAndUpdate(
        id,
        {
            status:"approved",
            approvedAt:new Date()
        },
        {
            new:true
        }
    )
    if(!achievement){
        throw new apiError(404,"achievement not found");
    }
    return res.status(200).json(new apiResponse(201,achievement,"achievement approved successfully"))    
})
export const rejectAchievement = asyncHandler(async (req,res)=>{

    const { id } = req.params

    const achievement = await Achievement.findByIdAndUpdate(
        id,
        { status:"rejected" },
        { new:true }
    )

    if(!achievement){
        throw new apiError(404,"Achievement not found")
    }

    return res.status(200).json(
        new apiResponse(200,achievement,"Achievement rejected")
    )

})
export const getPendingAchievements = asyncHandler(async (req, res) => {

    const achievements = await Achievement.find({ status: "pending" })
        .populate("userId", "fullName email")   // optional if you want user info
        .sort({ createdAt: -1 })

    if (!achievements || achievements.length === 0) {
        return res.status(200).json(
            new apiResponse(200, [], "No pending achievements")
        )
    }

    return res.status(200).json(
        new apiResponse(
            200,
            achievements,
            "Pending achievements fetched successfully"
        )
    )

})                                 
