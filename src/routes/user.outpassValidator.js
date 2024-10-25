import { Router } from "express";
import  {Section} from "../models/section.user.js";// Assuming your model is in this path
import { verifyJWT } from "../middlewares/auth.middleware.js";

const outpassRoute = Router();

outpassRoute.post("/check-outpass",verifyJWT ,async (req, res) => {
    const { section, day, time } = req.body;

    try {
        // Fetch the timetable for the given section
        const sectiontype = await Section.findOne(section);
        const sectionData = await Section.findOne({ _id: sectiontype._id });
        if (!sectionData) {
            return res.status(404).json({ message: "Section not found" });
        }


        const daySchedule = sectionData.timeTables[day];

        if (!daySchedule) {
            return res.status(400).json({ message: "Invalid day provided" });
        }


        const isClass = daySchedule.some(slot => slot.time === time);

        if (isClass) {
            return res.json({ message: "Outpass cannot be issued during class time." });
        } else {
            return res.json({ message: "Outpass can be issued." });
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
});

export default outpassRoute;