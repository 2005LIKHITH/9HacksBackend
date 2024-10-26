import { Message } from "../models/message.model.js";  
import mongoose from "mongoose";
import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { Section } from "../models/section.user.js"; // Import the Section model

const messageroute = Router();

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

messageroute.post("/", verifyJWT, async (req, res) => {
    const { message, outTime, Destination } = req.body;
    const section = req.user?.section;
    const sender = req.user?._id;

    // Validate request body
    if (!message || typeof message !== 'string') {
        return res.status(400).json({ error: "Message is required and must be a string." });
    }

    if (!sender || !isValidObjectId(sender)) {
        return res.status(400).json({ error: "Invalid sender ID." });
    }

    if (!outTime || isNaN(Date.parse(outTime))) {
        return res.status(400).json({ error: "Invalid outTime format." });
    }

    // Check for section's timetable
    try {
        const dayOfWeek = new Date(outTime).toLocaleString('en-US', { weekday: 'long' }); // Get the day of the week
        const timeToCheck = new Date(outTime).getHours() * 60 + new Date(outTime).getMinutes(); // Convert to minutes

        const sectionData = {
            "section": "S", 
            "timeTables": {
                "Monday": [
                    { "time": "09:00 To 09:55", "subject": "CSE 203(S 712)" },
                    { "time": "10:00 To 10:55", "subject": "CSE 203(S 712)" },
                    { "time": "11:00 To 11:55", "subject": "AEC 108(S 712)" },
                    { "time": "12:00 To 12:55", "subject": "AEC 108(S 712)" },
                    { "time": "01:00 To 01:55", "subject": "CSE 203(S 712)" },
                    { "time": "02:00 To 02:55", "subject": "CSE 202(C 411)" }
                ],
                "Tuesday": [
                    { "time": "09:00 To 09:55", "subject": "CSE 202(C 411)" },
                    { "time": "10:00 To 10:55", "subject": "CSE 207(S 712)" },
                    { "time": "11:00 To 11:55", "subject": "CSE 207(X 204)" },
                    { "time": "12:00 To 12:55", "subject": "CSE 207(X 204)" },
                    { "time": "01:00 To 01:55", "subject": "CSE 201(C 202)" },
                    { "time": "02:00 To 02:55", "subject": "CSE 204(S 712)" }
                ],
                "Wednesday": [
                    { "time": "09:00 To 09:55", "subject": "CSE 207(S 712)" },
                    { "time": "10:00 To 10:55", "subject": "CSE 207(S 712)" },
                    { "time": "11:00 To 11:55", "subject": "CSE 202(C 411)" },
                    { "time": "12:00 To 12:55", "subject": "CSE 207(X 204)" }
                ],
                "Thursday": [
                    { "time": "09:00 To 09:55", "subject": "CSE 204(S 613)" },
                    { "time": "10:00 To 10:55", "subject": "CSE 204(S 613)" },
                    { "time": "11:00 To 11:55", "subject": "CSE 201(C 202)" },
                    { "time": "12:00 To 12:55", "subject": "CSE 201(C 202)" },
                    { "time": "01:00 To 01:55", "subject": "AEC 108(S 712)" }
                ],
                "Friday": [
                    { "time": "09:00 To 09:55", "subject": "CSE 207(S 712)" },
                    { "time": "10:00 To 10:55", "subject": "CSE 207(S 712)" },
                    { "time": "11:00 To 11:55", "subject": "CSE 201(C 202)" },
                    { "time": "12:00 To 12:55", "subject": "CSE 201(C 202)" },
                    { "time": "01:00 To 01:55", "subject": "AEC 108(S 712)" },
                    { "time": "02:00 To 02:55", "subject": "CSE 202(V 604)" }
                ],
                "Saturday": [
                    { "time": "09:00 To 09:55", "subject": "CSE 204(S 712)" },
                    { "time": "10:00 To 10:55", "subject": "CSE 204(S 712)" },
                    { "time": "11:00 To 11:55", "subject": "CSE 202(V 604)" },
                    { "time": "12:00 To 12:55", "subject": "CSE 202(V 604)" },
                    { "time": "01:00 To 01:55", "subject": "MGT 262(S 503)" },
                    { "time": "02:00 To 02:55", "subject": "MGT 262(S 503)" }
                ]
            }
        }
        console.log(sectionData,section)

        if (!sectionData) {
            return res.status(404).json({ error: "Section not found." });
        }

        const classesToday = sectionData.timeTables[dayOfWeek] || [];
        const hasClassesAfter = classesToday.some(slot => {
            const [start, end] = slot.time.split(" To ").map(t => {
                const [hours, minutes] = t.split(":").map(Number);
                return hours * 60 + minutes; // Convert to total minutes
            });
            return start > timeToCheck; // Check if any class starts after the given time
        });

        const isAccepted = hasClassesAfter ? "pending" : "accepted";

        // Create the message
        const response = await Message.create({
            message,
            sender: new mongoose.Types.ObjectId(sender),
            outTime,
            isAccepted,
            Destination
        });

        return res.json({ message: "Message sent!", isAccepted , response});

    } catch (error) {
        console.error("Error sending message:", error);
        return res.status(500).json({
            error: "Failed to send message",
            details: error.message
        });
    }
});

export default messageroute;
