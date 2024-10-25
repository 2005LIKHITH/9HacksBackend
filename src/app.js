import express, { urlencoded } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";


const app = express()

app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization', 'x-csrf-token', 'Access-Control-Allow-Headers', 'Access-Control-Allow-Methods'],
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
}));


app.use(express.json({limit : "16kb"}))
app.use(express.urlencoded({extended : true , limit : "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

//Routes Import
import adminRouter from "./routes/admin.approval.js"
app.use("/admin/approval" , adminRouter)
import adminLogin from "./routes/admin.login.js"
app.use("/admin/login" , adminLogin)
import adminDetails from "./routes/details.admin.js"
app.use("/admin/details" , adminDetails)
import prevOutpass from "./routes/prevOutpass.js"
app.use("/prev-outpass" , prevOutpass)
import getUser from "./routes/user.getuser.js"
app.use("/getUser" , getUser)
import userLogin from "./routes/user.login.js"
app.use("/user/login" , userLogin)
import userLogout from "./routes/user.logout.js"
app.use("/user/logout" , userLogout)
import userMessage from "./routes/user.message.js"
app.use("/user/message" , userMessage)
import userOutpassValidator from "./routes/user.outpass.validator.js"
app.use("/user/outpass" , userOutpassValidator)
import userOutpass from "./routes/user.outpass.js"
app.use("/user/outpass" , userOutpass)




export {app}