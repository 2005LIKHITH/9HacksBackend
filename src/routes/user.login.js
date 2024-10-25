import { Router } from "express";
import { User } from "../models/user.model.js";
import { z } from "zod";
import jwt from 'jsonwebtoken';
import { verifyJWT } from "../middlewares/auth.middleware.js";
import dotenv from 'dotenv';
dotenv.config({
    path:'./env'
})
const userRouter = Router();

// // Define the JWT secret and expiration settings
// const JWT_SECRET = process.env.JWT_SECRET; // Ensure this is set in your .env
// const JWT_EXPIRATION = '15m'; // Access token expiration time
// const REFRESH_TOKEN_EXPIRATION = '7d'; // Refresh token expiration time

const loginSchema = z.object({
    email: z.string().email().optional(),
    AdmissionNo: z.string().optional(),
    password: z.string().min(6, { message: "Password must be at least 6 characters long" }),
});

// Function to generate access and refresh tokens
const generateAccessAndRefreshToken = async (userId) => {
    const accessToken = jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRATION });
    const refreshToken = jwt.sign({ userId }, JWT_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRATION });

    // Save the refresh token in the database for future validation
    await User.findByIdAndUpdate(userId, { refreshToken });

    return { accessToken, refreshToken };
};

userRouter.post('/login',verifyJWT, async (req, res) => {
    try {
        const parsedData = loginSchema.safeParse(req.body);
        if (!parsedData.success) {
            return res.status(400).json({ message: "Invalid input", errors: parsedData.error.errors });
        }

        const { email, AdmissionNo, password } = parsedData.data;

        if (!password) {
            return res.status(400).json({ message: "Password is required" });
        }

        const user = await User.findOne({
            $or: [
                { email },
                { AdmissionNo }
            ]
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isPasswordValid = await user.isPasswordCorrect(password);

        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid Password" });
        }

        const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);

        const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

        const accessTokenOptions = { httpOnly: true, secure: true, sameSite: 'None' };
        const refreshTokenOptions = { httpOnly: true, secure: true, sameSite: 'None' };

        res.cookie("refreshToken", refreshToken, refreshTokenOptions);
        res.cookie("accessToken", accessToken, accessTokenOptions);

        return res.status(200).json({ user: loggedInUser, accessToken, refreshToken, message: "User logged in successfully" });

    } catch (err) {
        console.error(err); // Log the error for debugging
        return res.status(503).json({ message: "Server error, please try again later" });
    }
});

export default userRouter;
