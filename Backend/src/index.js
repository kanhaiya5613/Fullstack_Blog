import dotenv from "dotenv";
dotenv.config({ path: ".env" });

import app from "./app.js";
import express from "express";
import mongoose from "mongoose";
import ConnectDB from "../src/Db/index.js";
console.log(process.env.PORT)
console.log(process.env.CLOUDINARY_CLOUD_NAME)
ConnectDB() 
.then(()=>{
   app.listen(process.env.PORT || 8000, ()=>{
      console.log(`Server is Running at port : ${process.env.PORT}`);
   })
})
.catch((err) => {
   console.log("MONGODB connection failed !!! ",err);
})  