import {apiResponse} from "../utils/apiResponse.js"
import {apiError} from "../utils/apiError.js"
import {  JobApplication } from "../models/jobApplication.model.js"
import { asyncHandler } from "../utils/asynchandler.js"


const createApplication=asyncHandler(async (req,res) => {
    const {
       
        coverLetter,

    }=req.body
    const resumeUrl = req.file?.path 
    const {jobId}=req.params
    if(!resumeUrl||!coverLetter){
        throw new apiError(400,"you missed mandatory fields")
    }
    const existingApplication = await JobApplication.findOne({
        userId: req.user._id,
        jobId:jobId
    })
    
    if(existingApplication){
        throw new apiError(400,"You have already applied for this job")
    }
    const jobApp=await JobApplication.create({
        userId:req.user._id,
        jobId:jobId,
        resumeUrl,
        coverLetter,

    })
    return res.status(201).json(
        new apiResponse(201,jobApp,"applied for job successfully")
    )
    
})
const getJobApplicationForJob=asyncHandler(async (req,res) => {
    const {jobId}=req.params
    if(!jobId){
        throw new apiError(400,"job is required")
    }
    const applications=await JobApplication.find({jobId}).populate("userId","fullName email profileImage")
    
    if(!applications||applications.length===0){
    throw new apiError(404,"no applicatons for required job")
    }
    return res.status(200).json(
        new apiResponse(200,applications,"applications fetch successfully")
    )


    
})
const updateApplicationStatus=asyncHandler(async (req,res) => {
    const {id}=req.params
    const {status}=req.body
    console.log(status)
    if(!id){
        throw new apiError(400,"application id is required")
    }
    if(!status){
        throw new apiError(400,"status is required")
    }
    const validityStatus=["pending","reviewed","approved","rejected"]
    if(!validityStatus.includes(status)){
        throw new apiError(400,"status is invalid")
    }    
    const application= await JobApplication.findById(id)
    if(!application){
        throw new apiError(404,"application not found")
    }
    application.status=status
    application.reviewedBy=req.user._id
    application.reviewedAt=new Date()
    await application.save()
    return res.status(200).json(
        new apiResponse(200,application,"status updated successfully")
    )
})
const getMyJobApplication=asyncHandler(async (req,res) => {
    const applications = await JobApplication.find({
        userId: req.user._id
    })
    .populate("jobId", "title company location")
    .populate("userId","fullName email profileImage ")
console.log(applications)
    if(!applications || applications.length === 0){
        throw new apiError(404, "No applications found")
    }

    return res.status(200).json(
        new apiResponse(200, applications, "Applications fetched successfully")
    )

})
    

export {
    createApplication,
    getJobApplicationForJob,
    updateApplicationStatus,
    getMyJobApplication,
}