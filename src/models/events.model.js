import mongoose from "mongoose"
const eventSchema = new mongoose.Schema({
    title: {
        type:String,
        required:true
    },

    description: 
    {
        type:String,
        required:true
    },
    eventDate:
    {
        type: Date,
        required:true
    },
    location: {
        type:String,
        required:true
    },
    image: {
        type:String
    },
  
    maxParticipants: {
        type:Number
    },
  
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft"
    },
  
    registrations: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      },
      registeredAt: {
        type: Date,
        default: Date.now
      }
    }]
  });
export const Event=mongoose.model("Event",eventSchema)