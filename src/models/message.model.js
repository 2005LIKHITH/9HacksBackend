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
        enum:["rejected","pending","accepted"],
        default:false
    },
    Destination:{
        type:String,
        required:true
    }
}, { timestamps: true })

export default mongoose.model('Message' , messageSchema)