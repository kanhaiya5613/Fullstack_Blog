import {User} from "../Models/user.model.js";
import {asyncHandler} from "../Utils/AsyncHandler.js";
import {ApiError} from "../Utils/ApiError.js"
import {ApiResponse} from "../Utils/ApiResponse.js"


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

export {
    registerUser
}