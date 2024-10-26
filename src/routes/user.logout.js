import { Router } from "express";
import { User } from "../models/user.model.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const userRouter = Router();

userRouter.post("/", verifyJWT, async (req, res) => {
    try {
        // Check if req.user exists and has an _id property
        if (!req.user || !req.user._id) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const id = req.user._id; // Extract the user ID directly
        
        // Clear the refresh token from the user document
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
