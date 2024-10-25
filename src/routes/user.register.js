import { Router } from "express";
import { z } from "zod";
import { User } from "../models/user.model.js";

const userRouter = Router();

userRouter.post("/register", async (req, res) => {
    const data = z.object({
        AdmissionNo: z.string(),
        email: z.string().email(),
        fullname: z.string().min(1),
        section: z.string(),
        password: z.string().min(5).max(15),
        school: z.string(),
        Branch: z.string()
    });

    const details = data.safeParse(req.body);

    if (!details.success) {
        const errors = details.error.issues.map(issue => ({
            field: issue.path.join('.'),
            message: issue.message
        }));

        return res.status(400).json({
            errors: errors
        });
    } 

    
    const { AdmissionNo, email, fullName, section, password, school, Branch } = details.data;

    try {
        
        const newUser = await User.create({
            AdmissionNo,
            email,
            fullName,
            section,
            password,
            school,
            Branch
        });

        return res.status(201).json({
            message: "User registered successfully",
            user: newUser 
        });
    } catch (error) {
        return res.status(500).json({
            error: "An error occurred while creating the user",
            details: error.message
        });
    }
});

export default userRouter;