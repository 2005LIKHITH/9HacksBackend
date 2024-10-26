
import { Router } from "express";
import { z } from "zod";
import { User } from "../models/user.model.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { Admin } from "../models/admin.model.js";
import { Message } from "../models/message.model.js";
const userRouter = Router();

userRouter.post("/refresh-acess-token",async(req , res)=>{
    const token = req.cookies.refreshToken || req.body.refreshToken

    try {
        if(!token)return res.status(404).json({message:"unauthorized user"});

    
        const decodedtoken =  jwt.verify(token , process.env.REFRESH_TOKEN_SECRET);
    

        if(!decodedtoken)return res.status(404).json({message:"unauthorized user"});
    
        const user = await User.findById(decodedtoken._id);
    

        if(!user) return res.status(401).json({message:"invalid refresh token"});
    

        if(user.refreshToken != token) return res.status(401).json({message:"refresh token is expired"});
    
        const options = { httpOnly: true, secure: true, sameSite: 'None' };
    
        const {accessToken , refreshToken} = await generateAccessAndRefreshToken(user._id)
    
        return res.status(200).cookie("refreshToken" , refreshToken , options).cookie("accessToken" , accessToken , options)
        .json({status:200 , tokens:{accessToken , refreshToken} , message: "access token refreshed"})

    } catch (error) {
        return res.status(500).send(error)
    }
})