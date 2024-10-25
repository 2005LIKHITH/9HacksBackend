import { Router } from "express";
import { z } from "zod";
import { User } from "../models/user.model.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { Admin } from "../models/admin.model.js";
const userRouter = Router();


userRouter.get("/approval", verifyJWT, async (req, res) => {
        try{
            const users = await User.find({enum:"pending"});
            return res.status(200).send(users)
        }catch(err){
            return res.status(500).send(err)
        }
})

export default userRouter