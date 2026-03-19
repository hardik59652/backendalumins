import mongoose from "mongoose"
const jobSchema= new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
        index:true
    },
    title:{
        type:String,
        required:true,

    },
    companyName:{
        type:String,
        required:true,

    },
    location:String,
    jobType:{
        type:String,
        enum:["Full-time","Part-time","Internship","Contract","Remote"],
        required:true,
        index:true
      },
    description:String,
    skillsRequired:{
        type:[String],
        required:true
        ,
        index:true},
    salaryRange:String,
    applyLink:String,
    deadline:{
      type:Date,
      required:true,
    },
    status:{
      type:String,
      enum:["pending","approved","rejected","expired"],
      default:"pending",
      index:true
    },
    approvedAt:Date
  },
  {timestamps:true}
  )
  
  export const JobOpportunity = mongoose.model("JobOpportunity",jobSchema)