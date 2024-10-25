import mongoose , { Schema } from "mongoose";

const messageSchema = new Schema({
    message: {
        type: String,
        required: true
    },
    sender: {
        type: Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    outTime:{
        type: String,
        required:true
    },
    isAccepted:{
        type:Boolean,
        default:false
    }
}, { timestamps: true })

export default mongoose.model('Message' , messageSchema)