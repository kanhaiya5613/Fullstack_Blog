// steps
// import mongoose
// create async function to connect to MongoDB using connection string from environment variables and database name from constants
// log success message with host info
// catch and log any connection errors
// export the ConnectDB function as default
import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const ConnectDB = async ()=>{
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`);
        console.log(`MONGODB CONNECTED !! DB HOST: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.log("MongoDB Connection Error",err);
        process.exit(1); 
    }
}

export default ConnectDB;