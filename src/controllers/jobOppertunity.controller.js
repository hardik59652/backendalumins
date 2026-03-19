import {asyncHandler} from "../utils/asynchandler.js"
import {apiError} from "../utils/apiError.js"
import {apiResponse} from "../utils/apiResponse.js"
import { JobOpportunity } from "../models/jobOppertunity.model.js"


const createJobOpportunity = asyncHandler(async (req, res) => {

    console.log("req.body ->", req.body);

    const {
        title,
        companyName,
        location,
        type, // ✅ CHANGE 1: frontend sends "type" not "jobType"
        description,
        skillsRequired,
        salaryRange,
        applyLink,
        deadline
    } = req.body;

    // ✅ CHANGE 2: validation updated to use "type"
    if (!title || !companyName || !type || !skillsRequired || !deadline) {
        throw new apiError(400, "You missed mandatory fields");
    }

    // ✅ CHANGE 3: skillsRequired can be string OR array
    // frontend sends array -> ["mernstack"]
    // earlier code assumed string -> "mern,react"
    let skillsArray;

    if (Array.isArray(skillsRequired)) {
        skillsArray = skillsRequired;
    } else {
        skillsArray = skillsRequired.split(",").map(skill => skill.trim());
    }

    // ✅ CREATE JOB IN DATABASE
    const job = await JobOpportunity.create({
        userId: req.user._id, // from verifyJWT middleware
        title,
        companyName,
        location,
        jobType: type, // ✅ CHANGE 4: mapping "type" -> "jobType"
        description,
        skillsRequired: skillsArray,
        salaryRange,
        applyLink,
        deadline,
        status: "pending"
    });

    // ✅ CHANGE 5: correct status code (201 for create)
    return res.status(201).json(
        new apiResponse(201, job, "Job opportunity submitted for approval")
    );

});


const approveJob=asyncHandler(async (req,res) => {
   const {id}=req.params
   const job =await JobOpportunity.findByIdAndUpdate(
    id,
    {
        status:"approved",
        approvedAt: new Date()

    },
    {new:true}
   ) 
   if(!job){
    throw new apiError(404,"job not found")
   }
   return res.status(200).json(
    new apiResponse(200,job,"job approved successfully")
   )
    
})
const rejctJob=asyncHandler(async (req,res) => {
    const {id}=req.params
    const job =await JobOpportunity.findByIdAndUpdate(
     id,
     {
         status:"rejected",
        
 
     },
     {new:true}
    ) 
    if(!job){
     throw new apiError(404,"job not found")
    }
    return res.status(200).json(
     new apiResponse(200,job,"job rejected  successfully")
    )
     
 })
const getApprovedJob=asyncHandler(async (req,res) => {
    const job = await JobOpportunity.find({
        status:"approved",
        deadline:{$gte:new Date()}
 }).sort({createdAt:-1})
 return res.status(200).json(new apiResponse(200,job,"approved job fetch"))
    
})
const getPendingJob=asyncHandler(async (req,res) => {
    const job= await JobOpportunity.find({
        status:"pending"
    })
    .populate("userId","fullName email company")
    .sort({createdAt:-1})
    return res.status(200).json(new apiResponse(200,job,"pending jobs fetched successfully"))
})
const getMyJob=asyncHandler(async (req,res) => {
    const job=await JobOpportunity.find(
        {
            userId:req.user._id
        }
    ) .sort({createdAt:-1})  
    return res.status(200).json(
        new apiResponse(200,job,"user jobs fetched successfully")
)
})
export {

    createJobOpportunity,
    approveJob,
    rejctJob,
    getApprovedJob,
    getPendingJob,
    getMyJob,
}