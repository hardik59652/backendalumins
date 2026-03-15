import mongoose from "mongoose";
const achievementSchema =new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:"true"
    },
    title:{
        type:String,
        required:true,
        trim:true
    },
    category:{
        type:String,
        enum:["Entrepreneurship","Academic","Corporate","SocialWork","Sports"]

    },
    description:{
        type:String,
        required:true
    },
    photo:{
        type:String,
       
    },
    status:{
        type:String,
        enum:["pending","approved","rejected"],
        default:"pending"
    },
    approvedAt:{
        type:Date
    },
    },{
        timestamps:true
    })
export const Achievement=mongoose.model("Achievement",achievementSchema)