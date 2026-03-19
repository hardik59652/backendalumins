import{  mongoose} from "mongoose"
const JobApplicationSchema=new mongoose.Schema
(
    {
    jobId:{
        type:mongoose.Schema.types.ObjectId,
        ref:"jobSchema",
        required:true,
    },
    userId:{
        type:mongoose.Schema.types.ObjectId,
        ref:"userSchema",
        equired:true,
    },
    resumeUrl:{
        type:String,
        required:true
    },
    coverLetter:{
        type:String,
        required:true,
    },
    status:{
        type:String,
        enum:["pending","reviewed","approved","rejected" ],
        default:"pending"
    },
    reviewedBy:{
        type:mongoose.Schema.types.ObjectId,
        ref:"userSchema"
    },
    reviewedAt:{
        type:Date,
    },
    },

    {
        timestamps:true
    },
    JobApplicationSchema.index({ jobId: 1, userId: 1 }, { unique: true })
);
export const JobApplication=mongoose.model
(
    "JobApplication",
    JobApplicationSchema
);