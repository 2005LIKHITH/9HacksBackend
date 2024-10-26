import { Router } from "express";
import  {Section} from "../models/section.user.js";// Assuming your model is in this path
import { verifyJWT } from "../middlewares/auth.middleware.js";

const outpassRoute = Router();

outpassRoute.post("/",verifyJWT ,async (req, res) => {
    const { day, time } = req.body;
    const section = req.user?.section;

    try {
        // Fetch the timetable for the given section
        // const sectiontype = await Section.findOne(section);

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
        // const sectionData = 
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