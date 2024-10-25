import { Router } from "express";
import { User } from "../models/User.models.js";
import { z } from "zod";

const userRouter = Router();

const userIdSchema = z.object({
    _id: z.string().min(1) // Validate that _id is a non-empty string
});

userRouter.post("/logout",verifyJWT, async (req, res) => {
    try {
        const userValidation = userIdSchema.safeParse(req.user);
        
        if (!userValidation.success) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const id = userValidation.data._id; // Extract validated user ID
        
        await User.findByIdAndUpdate(id, { $unset: { refreshToken: 1 } }, { new: true });

        const options = { httpOnly: true, secure: false }; 

        // Clear cookies
        return res.status(200)
            .clearCookie("accessToken", options)
            .clearCookie("refreshToken", options)
            .json({ message: "Logged Out" });

    } catch (err) {
        console.error(err); // Log the error for debugging
        return res.status(503).json({ message: "Server error, please try again later." });
    }
});

export default userRouter;
