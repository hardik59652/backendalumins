import { JobOpportunity } from "../models/jobOppertunity.model.js"
import {asyncHandler} from "../utils/asynchandler.js"
import { apiError } from "../utils/apiError.js"
import {apiResponse} from "../utils/apiResponse.js"

const createJobOpportunity = asyncHandler(async (req,res) => {

    const { title, company, location, description, salary, type, applyLink } = req.body

    if(!title || !company || !location || !description){
        throw new apiError(400,"All required fields must be provided")
    }

    const job = await JobOpportunity.create({
        title,
        company,
        location,
        description,
        salary,
        type,
        applyLink,
        userId: req.user._id,
        status:"pending"
    })

    return res.status(201).json(
        new apiResponse(201,job,"Job created and waiting for admin approval")
    )

})

const approveJob = asyncHandler(async (req,res) => {

    const { id } = req.params

    const job = await JobOpportunity.findById(id)

    if(!job){
        throw new apiError(404,"Job not found")
    }

    job.status="approved"
    await job.save()

    return res.status(200).json(
        new apiResponse(200,job,"Job approved successfully")
    )

})

const rejctJob = asyncHandler(async (req,res) => {

    const { id } = req.params

    const job = await JobOpportunity.findById(id)

    if(!job){
        throw new apiError(404,"Job not found")
    }

    job.status="rejected"
    await job.save()

    return res.status(200).json(
        new apiResponse(200,job,"Job rejected")
    )

})

const getApprovedJob = asyncHandler(async (req,res) => {

    const jobs = await JobOpportunity.find({status:"approved"}).populate("userId","name email")

    return res.status(200).json(
        new apiResponse(200,jobs,"Approved jobs fetched successfully")
    )

})

const getPendingJob = asyncHandler(async (req,res) => {

    const jobs = await JobOpportunity.find({status:"pending"}).populate("userId","name email")

    return res.status(200).json(
        new apiResponse(200,jobs,"Pending jobs fetched successfully")
    )

})

const getMyJob = asyncHandler(async (req,res) => {

    const jobs = await JobOpportunity.find({userId:req.user._id})

    return res.status(200).json(
        new apiResponse(200,jobs,"User jobs fetched successfully")
    )

})

const updateJob = asyncHandler(async (req,res) => {

    const { id } = req.params

    const job = await JobOpportunity.findById(id)

    if(!job){
        throw new apiError(404,"Job not found")
    }

    if(job.userId.toString() !== req.user._id.toString()){
        throw new apiError(403,"Unauthorized")
    }

    const updatedJob = await JobOpportunity.findByIdAndUpdate(
        id,
        {
            ...req.body,
            status:"pending"
        },
        {new:true}
    )

    return res.status(200).json(
        new apiResponse(200,updatedJob,"Job updated and sent for approval")
    )

})
const getSingleJob = asyncHandler(async (req,res) => {

    const { id } = req.params

    const job = await JobOpportunity.findById(id)

    if(!job){
        throw new apiError(404,"Job not found")
    }

    return res.status(200).json(
        new apiResponse(200,job,"Job fetched successfully")
    )
})
const deleteJob = asyncHandler(async (req, res) => {

    const { id } = req.params

    const job = await JobOpportunity.findById(id)

    if (!job) {
        throw new apiError(404, "Job not found")
    }

    // Check if the job belongs to the logged-in user
    if (job.userId.toString() !== req.user._id.toString()) {
        throw new apiError(403, "Unauthorized to delete this job")
    }

    await JobOpportunity.findByIdAndDelete(id)

    return res.status(200).json(
        new apiResponse(200, {}, "Job deleted successfully")
    )
})
export {
    createJobOpportunity,
    approveJob,
    rejctJob,
    getApprovedJob,
    getPendingJob,
    getMyJob,
    updateJob,
    getSingleJob,
    deleteJob
}