import mongoose , { Schema } from "mongoose";
import bcrypt from 'bcryptjs';


const adminSchema = new Schema({
    email:{
        unique:true,
        required:true,
        type:String,
        lowrecase:true
    },
    password:{
        type:String,
        required:true
    }

})
adminSchema.pre('save' , async function(next){
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password , 10)
    next()
})
adminSchema.methods.isPasswordCorrect = async function (password){
    //console.log(password);
    return await bcrypt.compare(password , this.password)
}

export default mongoose.model('Admin' , adminSchema)