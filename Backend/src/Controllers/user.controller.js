import {User} from "../Models/user.model.js";
import {asyncHandler} from "../Utils/AsyncHandler.js";
import {ApiError} from "../Utils/ApiError.js"
import {ApiResponse} from "../Utils/ApiResponse.js"
import { trusted } from "mongoose";

const generateAccessAndRefreshTokens = async (userId)=>{
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false})
        return {accessToken, refreshToken}

    } catch (error) {
        throw new ApiError(500,"Something went wrong while generating refresh and access token")
    }
}

const registerUser = asyncHandler(async(req,res)=>{
     // get the details 
    // validate 
    // check the email or username already exist
    // check the image and avatar available or not 
    // upload on cloudinary
    // create user object - entry in db
    // remove password and refresh token from response
    // check for user creation 
    // return resonse


    //  getting user details

    const {fullName, email, password} = req.body

    // validation 
    if(
        [fullName,email,password].some((field)=>
            field?.trim()==="")
    ){
        throw new ApiError(400,"All fields are Required");
    }

    // check if user exist
    const existedUser = await User.findOne({
        $or: [{email}]
    })

    if(existedUser){
        throw new ApiError(409,"User with email already exist");
    }

    // Create User object - Create Entry in DB
    const user = await User.create({
        fullName,
        email,
        password
    })

    const createdUser = await User.findById(user.id).select(
        "-password -refreshToken"
    )
    if(!createdUser){
        throw new ApiError(500,"Something went wrong while registering the user")
    }

    // Return res 
    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered Successfully")
    )
})
const loginUser = asyncHandler(async(req,res)=>{
    // Get email and Password from req.body
    // check email present in db or not
    // if present then check password and if both are correct then sent a Api response anc cookies
    // if password is wrong the send a ApiError

    // get user info
    const {email,password} = req.body
    if(!email){
        throw new ApiError(400,"Email is Required ")
    }
    
    // check  userDetails in database

    const user = await User.findOne({ email })

    if(!user){
        throw new ApiError(404, "User does not exist");
    }

    const isPasswordValid = await user.isPasswordCorrect(password)

    if(!isPasswordValid){
        throw new ApiError(401, "Invalid User Credentials")
    }

    const {accessToken, refreshToken}  = await generateAccessAndRefreshTokens(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: trusted
    }
    return res
    .status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(
        new ApiResponse(
            200,{
                User: loggedInUser,
                accessToken,
                refreshToken
            },
            "User Logged in Successfully"
        )
    )
})
const logoutUser = asyncHandler(async(req,res)=>{
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset:{
                refreshToken:1
            }
        },
        {
            new: true
        }
    )
    const options = {
        httpOnly: true,
        
    }
    return res.status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(new ApiResponse(200,{},"User Logged Out Successfully"))
})
export {
    registerUser,
    loginUser,
    logoutUser
}