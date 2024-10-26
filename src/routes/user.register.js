import { Router } from "express";
import { z } from "zod";
import { User } from "../models/user.model.js";

const userRouter = Router();

userRouter.post("/", async (req, res) => {
    const data = z.object({
        AdmissionNo: z.string(),
        email: z.string().email(),
        fullName: z.string().min(1),
        section: z.string(),
        password: z.string().min(5).max(15),
        School: z.string(),
        Branch: z.string(),
        Gender: z.enum(["Male", "Female", "Other"]), // Required field
        phoneNumber: z.string().optional(), // Optional field
        semester: z.string().optional(), // Optional field
        Batch: z.number().optional() // Optional field
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

   const existedUser  = await User.find({$or:[{email:details.data.email},{AdmissionNo:details.data.AdmissionNo}]})
   if(existedUser)return res.status(400).json({message:"User Already Exists"});

    console.log(details.data);

    const { AdmissionNo, email, fullName, section, password, School, Branch, Gender, phoneNumber, semester, Batch } = details.data;

    try {
        const newUser = await User.create(
           details.data
        );
    
        console.log(newUser)
        newUser.save();

        return res.status(201).json({
            message: "User registered successfully",
            user: newUser 
        });
    } catch (error) {
        return res.status(500).json({
            error: "An error occurred while creating the user",
            details: error
        });
    }
});

export default userRouter;
