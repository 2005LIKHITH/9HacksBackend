import dotenv from "dotenv"
import { app } from "./app.js";
import connectDB from "./db/index.js";

dotenv.config({
    path: './.env'
})
console.log(process.env.MONGODB_URI)
console.log(process.env.PORT)
connectDB()
.then(() => {
    app.listen(process.env.PORT || 8000 , () => {
        console.log(`server is running on https://localhost:${process.env.PORT}`);
    })
}).catch((err) => {
    console.log("Mongo DB connection failed :",err);
})

