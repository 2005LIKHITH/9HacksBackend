import { Router } from "express";
import { z } from "zod";
import { User } from "../models/user.model.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { Admin } from "../models/admin.model.js"; // Assuming Admin is used elsewhere in your code
import Message from "../models/message.model.js"; // Import the Message model

const userRouter = Router();

userRouter.get("/details", verifyJWT, async (req, res) => {
    try {
        // Aggregate to find all messages with 'isAccepted' set to 'pending'
        const pendingMessages = await Message.aggregate([
            {
                $match: {
                    isAccepted: "pending" // Filter for pending messages
                }
            },
            {
                $lookup: {
                    from: "users", // The collection name for the User model
                    localField: "sender",
                    foreignField: "_id",
                    as: "senderDetails" // This will hold the user details
                }
            },
            {
                $unwind: {
                    path: "$senderDetails",
                    preserveNullAndEmptyArrays: true // Optional: keep messages even if sender details are missing
                }
            },
            {
                $project: {
                    message: 1,
                    outTime: 1,
                    isAccepted: 1,
                    Destination: 1,
                    senderDetails: {
                        username: "$senderDetails.username",
                        // Include other user fields as necessary
                    }
                }
            }
        ]);

        return res.json(pendingMessages);
    } catch (error) {
        console.error("Error fetching pending messages:", error);
        return res.status(500).json({ message: "Server error" });
    }
});

export default userRouter;
