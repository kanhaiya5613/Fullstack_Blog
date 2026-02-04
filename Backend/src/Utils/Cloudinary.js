import { v2 as cloudinary } from 'cloudinary';
import fs from "fs"
import dotenv from "dotenv";
import { ApiError } from '../Utils/ApiError.js';

dotenv.config({ path: ".env" });


// Configuration
cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET 
});
// console.log(process.env.CLOUDINARY_CLOUD_NAME);
// console.log(process.env.CLOUDINARY_API_KEY);
// console.log(process.env.CLOUDINARY_API_SECRET);


const uploadOnCloudinary = async (localFilePath) => {
    // steps
    // check if file path is valid/available
    // upload to cloudinary
    // delete from local storage
    // return the response from cloudinary
    try {
        if(!localFilePath) return null;
        //console.log("Uploading to Cloudinary:",localFilePath);

        const response = await cloudinary.uploader.upload(localFilePath,{resource_type: "image",
            folder: "blog"
        });
        //console.log("Uploaded to Cloudinary:",response);

        if(fs.existsSync(localFilePath)){
            fs.unlinkSync(localFilePath);
        }
        return response;
        //console.log("Cloudinary Upload Response:",response);
    } catch (error) {
        //console.log("Cloudinary Upload Error");
        console.log(error);

        if(localFilePath && fs.existsSync(localFilePath)){
            fs.unlinkSync(localFilePath);
        }
        return null;
    }
};

const deleteFromCloudinary = async (publicId) => {
    // steps 
    // check if publicId is valid
    // delete from cloudinary
    // return the response from cloudinary
    try{
        if(!publicId) return null;

        const response = await cloudinary.uploader.destroy(publicId);
        return response;
    } catch(error){
        throw new ApiError(500,"Something went wrong while deleting the image from cloudinary");
        //console.log("Cloudinary Delete Error: ", error);
        return null;
    }
};

export {
    deleteFromCloudinary,
    uploadOnCloudinary
}