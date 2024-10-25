
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const verifyJWT = (async (req , res , next) => {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer " , "");
        if(!token) return res.status(404).json({message:"Unauthorized User"})
    
    
        const decodedToken = jwt.verify(token , process.env.ACCESS_TOKEN_SECRET );
        console.log(decodedToken);
    
        const user = await User.findById(decodedToken?.userId).select("-password -refreshToken")
        console.log(user)
        if(!user) return res.status(404).json({message:"Unauthorized User"})
    
        req.user = user ;
        next()
})