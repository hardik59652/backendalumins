import mongoose from "mongoose";

const reunionSchema = new mongoose.Schema(
{
  title:{
    type:String,
    required:true
  },
  description:{
    type:String
  },
  date:{
    type:Date,
    required:true
  },
  location:{
    type:String,
    required:true
  },
  highlights:[
    {
      title:String,
      icon:String
    }
  ],
  bannerImage:{
    type:String
  }
},
{timestamps:true}
);

export const Reunion = mongoose.model("Reunion",reunionSchema);