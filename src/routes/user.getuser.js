import { Router } from "express";
import { z } from "zod";
import { User } from "../models/user.model.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const userRouter = Router();

// Zod schema to validate req.user
const userIdSchema = z.object({
    _id: z.string().min(1) // Ensure _id is a non-empty string
});

userRouter.get("/getUser", verifyJWT,async (req, res) => {
    try {
        // Validate req.user
        const userValidation = userIdSchema.safeParse(req.user);

        if (!userValidation.success) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const id = userValidation.data._id; // Extract the validated user ID

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
