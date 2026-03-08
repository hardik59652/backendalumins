import {asyncHandler} from "../utils/asynchandler.js"
import {apiError} from "../utils/apiError.js"
import {User} from "../models/user.model.js"
import { apiResponse } from "../utils/apiResponse.js"
const registerUser =asyncHandler( async (req,res)=>{
     // get user details from frontend
    // validation - not empty
    // check if user already exists: username, email
    // check for images, /
      // create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation
    // return res
    const {fullName,email,password,phoneNumber ,graduationYear,department,enrollmentNumber,  currentCompany,jobTitle, location, linkedinUrl, role}=req.body
    
    if(
        [
            fullName,email,password,graduationYear,department,enrollmentNumber,linkedinUrl,
        ].some((field)=>field?.trim()==="")
    ){
        throw new apiError(400,"the field is mandatory")

    }
    const existeduser=await User.findOne({
        $or:[
            {email},{enrollmentNumber}
        ]
    })
    if(existeduser){
        throw new apiError(409," enrollmentnumber or email already exixts")
    }
   const profileImagePath= req.files?.profileImage[0]?.path
   if(!profileImagePath){
    throw new apiError(400,"profile image is required ");
    
   }
    const user = await User.create({
    profileImage:profileImagePath,
    fullName,
    email,
    password,
    phoneNumber ,
    graduationYear,
    department,
    enrollmentNumber,
    currentCompany,
    jobTitle,
    location,
    linkedinUrl,
    role,





   })

   const createdUser=await User.findById(user._id).select(
    "-password -refreshToken"
   )
   if(!createdUser){
    throw new apiError(500, "somthing went ")
   }
   return res.status(201).json(
    new apiResponse(200, createdUser,"user registered successfully")
   )


})
export {registerUser} 