import mongoose, { Schema } from "mongoose";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'; // Import jwt

const userSchema = new Schema({
    School: {
        type: String,
    },
    Branch: {
        type: String,
        // required: true,
    },
    AdmissionNo: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
    email: {
        type: String,
        lowercase: true,
        unique: true,
        required: true,
    },
    fullName: {
        type: String,
        required: true,
    },
    section: {
        type: String,
        required: true,
        index: true,
    },
    password: {
        type: String,
        required: true,
    },
    refreshToken: {
        type: String,
    },
    Gender: {
        enum: ["Male", "Female", "Other"],
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        // required: true,
    },
    semester: {
        type: String,
        // required: true,
    },
    Batch: {
        type: Number,
        // required: true,
    }
}, { timestamps: true });

userSchema.pre('save', async function (next) {
    if (!this.isModified("password")) return next();
    try {
        this.password = await bcrypt.hash(this.password, 10);
        next();
    } catch (error) {
        next(error); // Pass error to the next middleware
    }
});

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
}

userSchema.methods.generateAccessToken = function () {
    return jwt.sign({
        _id: this._id,
        email: this.email,
        fullName: this.fullName,
        section: this.section,
        phoneNumber: this.phoneNumber,
        AdmissionNo: this.AdmissionNo, // Corrected typo
        Gender: this.Gender,
        Batch: this.Batch,
        semester: this.semester,
    }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    });
}

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign({
        _id: this._id,
        email: this.email,
        fullName: this.fullName,
    }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    });
}

export const User = mongoose.models.User || mongoose.model('User', userSchema);

