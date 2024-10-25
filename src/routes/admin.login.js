import { Router } from "express";
import { z } from "zod";
import { User } from "../models/user.model.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { Admin } from "../models/admin.model.js";
const userRouter = Router();

userRouter.post('/login',async(req,res)=>{  
    try{

        const username  = req.body?.username;
        const password = req.body?.password;

        if(!(username && password))return res.status(400).send("All fields are required");

        const adminFound = await Admin.findOne({username : username});
        if(!adminFound) return res.status(404).send("Admin not found");

        if(password != adminFound.password)return res.status(404).send("Invalid Password");

        const accessToken = adminFound.generateAccessToken();
        const refreshToken = adminFound.generateRefreshToken();
        adminFound.refreshToken = refreshToken;

        await adminFound.save();

        const Options = { httpOnly: true, secure: true, sameSite: 'None' };

        res.cookie('accessToken', accessToken, Options);
        res.cookie('refreshToken', refreshToken, Options);
        res.status(200).send({message:"Admin Logged In",accessToken , refreshToken , key:"ADMIN"});
        
    }catch(err){
        return res.status(500).send(err.message);
    }

})

export default userRouter