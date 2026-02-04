import {ApiError} from "../Utils/ApiError.js";
import jwt from "jsonwebtoken";
import {User} from "../Models/user.model.js";
import {asyncHandler} from "../Utils/AsyncHandler.js";

export const verifyJWT = asyncHandler(async(req,_,next) => {
    try{
        // Get token from cookies or Authorization header
        // replace "Bearer " with empty string to get only the token value
        // compare token with access token secret
        // find user by decoded token id
        //swlect user without password and refresh token
        // if no user found throw error
        // attach user to request object
        // call next middleware
        let token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer", "")

        if(!token){
            throw new ApiError(401,"Unauthorizes access")
        }

        const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)

        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")

        if(!user){
            throw new ApiError(401, "Invalid Access Token")
        }
        req.user = user;
        next()
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token");
    }
})