import mongoose from "mongoose";

import { DB_NAME } from "../constants.js";

import dotenv from "dotenv"
dotenv.config({
    path: './.env'
})
console.log(DB_NAME)
console.log(process.env.MONGODB_URI)

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}`)
        console.log(`\n MongoDB connected !! DB HOST : ${connectionInstance.connection.host}`)
    } catch (error) {
        console.log("MONGO DB connection error", error);
        process.exit(1)
    }
}


export default connectDB