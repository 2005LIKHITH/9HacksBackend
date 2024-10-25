import mongoose, { Schema } from "mongoose";

const messageSchema = new Schema({
    message: {
        type: String,
        required: true,
        minlength: 1, // Optionally, set a minimum length
        maxlength: 500 // Optionally, set a maximum length
    },
    sender: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    outTime: {
        type: Date, // Changed to Date for better handling
        required: true
    },
    isAccepted: {
        type: String,
        enum: ["rejected", "pending", "accepted"],
        default: "pending"
    },
    Destination: {
        type: String,
        required: true
    }
}, { timestamps: true });

export const Message = mongoose.models.Message || mongoose.model('Message', messageSchema);
