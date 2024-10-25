import { Router } from "express";
import { z } from "zod";
import { User } from "../models/user.model.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { Admin } from "../models/admin.model.js";
import { Message } from "../models/message.model.js";
const userRouter = Router();


userRouter.get("/prev-outpass", verifyJWT, async (req, res) => {
    try{
            const user  = await Message.find({sender : req.user._id});
            if(!user) return res.status(404).send("User not found");

            res.status(200).json({user});
            const outPasses = await Message.find()
    }catch(err){
        return res.status(500).send(err)
    }
})

userRouter.patch("/cancel-outpass",verifyJWT, async (req, res) => {
    try{
        const user  = await Message.findById(req.body.messageId);
        if(!user) return res.status(404).send("User not found");
        user.isAccepted = "rejected";
        await user.save();
        res.status(200).json({user});
    }catch(err){
        return res.status(500).send(err)
    }
})

export default userRouter