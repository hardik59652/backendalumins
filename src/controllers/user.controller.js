import {asyncHandler} from "../utils/asynchandler.js"
import {apiError} from "../utils/apiError.js"
import {User} from "../models/user.model.js"
import { apiResponse } from "../utils/apiResponse.js"
const generateAccessAndRefreshToken=async(userId)=>{
    try {
        const user =await User.findById(userId)
        if (!user) {
            throw new apiError(404, "User not found")
        }
       const accessToken =user.generateAccessToken()
       const refreshToken=user.generateRefreshToken()
       user.refreshToken=refreshToken
      await user.save({validateBeforeSave:false})
      return {
        accessToken,refreshToken
      }
    } catch (error) {
        console.log("REAL ERROR:", error)
        throw new apiError(500,error.message)
        
    }
}
const registerUser =asyncHandler( async (req,res)=>{
     // get user details from frontend
    // validation - not empty
    // check if user already exists: username, email
    // check for images, /
      // create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation
    // return res
    console.log(req.body);
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
    throw new apiError(500, "somthing went wrong")
   }
   return res.status(201).json(
    new apiResponse(200, createdUser,"user registered successfully")
   )


})
const loginUser=asyncHandler(async (req,res)=>{
    // console.log("ACCESS SECRET:", process.env.ACCESS_TOKEN_SECRET)
    // console.log("REFRESH SECRET:", process.env.REFRESH_TOKEN_SECRET)
    // console.log("BODY:", req.body)
    const {email,password}=req.body||{}
    if(!email||!password){
        throw new apiError(400,"email  and passsword is needed for login")
    }
    const existedUser=await User.findOne({email})
    if(!existedUser){
        throw new apiError(404,"user is not existing")
    }
    const isPasswordValid=await existedUser.isPasswordCorrect(password)
    // console.log("Password valid:", isPasswordValid)
    if(!isPasswordValid){
        throw new apiError(401, "password is incorrect")
    }
   const {accessToken,refreshToken}=await  generateAccessAndRefreshToken(existedUser._id)
   const loggedInUser=await User.findById(existedUser._id).select("-password -refreshToken")
   const options = {
    httpOnly: true,
    secure: true,  // important for http
    sameSite: "lax"
  }
   return res
   .status(200)
   .cookie("accessToken",accessToken,options)
   .cookie("refreshToken",refreshToken,options)
   .json(
    new apiResponse(200,
        {
            user:loggedInUser,accessToken,refreshToken
        },
        "user logged in successfully"
    )
   )

})
const logoutUser = asyncHandler(async (req, res) => {

    await User.findByIdAndUpdate(
      req.user._id,
      {
        $set: {
          refreshToken: undefined
        }
      },
      { new: true }
    );
    const options = {
        httpOnly: true,
        secure: true,   // important for http
        sameSite: "lax"
      }
    
  
    return res
      .status(200)
      .clearCookie("AccessToken", options)
      .clearCookie("refreshToken", options)
      .json(new apiResponse(200, {}, "User logged out successfully"));
  
  });
const getCurrentUser = asyncHandler(async (req, res) => {

    return res.status(200).json(
      new apiResponse(200, req.user, "Current user fetched successfully")
    );
  
  });
export {
    registerUser,
    loginUser,
    logoutUser,
    getCurrentUser,
} 