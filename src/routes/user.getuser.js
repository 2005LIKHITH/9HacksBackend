import { Router } from "express";
import { User } from "../models/user.model.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const userRouter = Router();

userRouter.get("/get-user", verifyJWT, async (req, res) => {
    try {
        console.log("Hi");

        // Check if req.user exists and has an _id property
        if (!req.user || !req.user._id) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const id = req.user._id; // Extract the user ID directly

        // Find the user by ID
        const user = await User.findById(id); 

        if (!user) {
            return res.status(404).json({ message: "User Not Found" });
        }

        return res.status(200).json({ user });

    } catch (err) {
        console.error(err); // Log the error for debugging
        return res.status(503).json({ message: "Internal Server Error" });
    }
});

export default userRouter;
