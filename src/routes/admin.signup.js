import { z } from "zod";
import { User } from "../models/user.model.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { Admin } from "../models/admin.model.js";
import { Router } from "express";
const userRouter = Router();


userRouter.post("/",async(req,res)=>{
    try{

        const username = req.body?.username;
        const password = req.body?.password;
        console.log(username , password);

        if(!(username && password))return res.status(400).send("All fields are required");
        const response = await Admin.create({username : username , password : password});
        return res.status(200).json({response:response});


    }catch(err){
        return res.status(500).send(err)
    }
})
export default userRouter