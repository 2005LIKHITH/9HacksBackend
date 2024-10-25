import { messages } from "../models/message.model.js";  
import { z } from "zod";
import mongoose from "mongoose";
import { Router } from "express";

const messageroute = Router();

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

messageroute.post("/message", async (req, res) => {
    const data = z.object({
        message: z.string(),
        sender: z.string().refine(isValidObjectId, {
            message: "Invalid sender ID",
        }),
        outTime: z.string().refine((val) => !isNaN(Date.parse(val)), {
            message: "Invalid outTime format",
        }),
        isAccepted: z.enum(["rejected", "pending", "accepted"]), // Changed to z.enum
        Destination: z.string(), // Added Destination validation
    });

    const details = data.safeParse(req.body);

    if (!details.success) {
        const errors = details.error.issues.map(issue => ({
            field: issue.path.join('.'),
            message: issue.message
        }));

        return res.status(400).json({ errors });
    }

    const { message, sender, outTime, isAccepted, Destination } = details.data;

    try {
        await messages.create({
            message,
            sender: new mongoose.Types.ObjectId(sender),
            outTime,
            isAccepted,
            Destination // Include Destination in the message creation
        });
        res.json({ message: "Message sent!" });
    } catch (error) {
        console.error("Error sending message:", error);
        res.status(500).json({
            error: "Failed to send message",
            details: error.message
        });
    }
});

export default messageroute;
