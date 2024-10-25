import mongoose , { Schema } from mongoose;
import bcrypt from 'bcryptjs';

const userSchema = new Schema({
    AdmissionNo:{
        type:String,
        required:true,
        unique:true,
        index:true
    },
    email:{
        type:String,
        lowercase:true,
        unique:true,
        required:true
    },
    fullName:{
        type:String,
        required:true
    },
    section:{
        type:String,
        required:true,
        index:true
    },
    password:{
        type:String,
        required:true
    }

})
userSchema.pre('save' , async function(next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password , 10)
    next()
})

userSchema.methods.isPasswordCorrect = async function (password){
    //console.log(password);
    return await bcrypt.compare(password , this.password)
}



export default mongoose.model('User' , userSchema)
