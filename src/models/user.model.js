import mongoose , { Schema } from mongoose;
import bcrypt from 'bcryptjs';

const userSchema = new Schema({
    School:{
        type:String
    },
    Branch:{
        type:String,
        required:true,
    },

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
    },
    refreshToken: {
        type: String,
    },
    Gender:{
        enum : ["Male" , "Female" , "Other"],
        type:String,
        require:true
    },
    phoneNumber:{
        type:String,
        require:true
    },
    semester:{
        type:String,
        require:true
    },
    Batch:{
        type:Number,
        require:true
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
userSchema.methods.generateAccessToken = function(){
    return jwt.sign({
        _id : this._id,
        email : this.email,

        fullName : this.fullName,
    }, process.env.ACCESS_TOKEN_SECRET,{
        expiresIn : process.env.ACCESS_TOKEN_EXPIRY ,
    })
}
userSchema.methods.generateRefreshToken = function(){
    return jwt.sign({
        _id : this._id,
        
    }, process.env.REFRESH_TOKEN_SECRET,{
        expiresIn : process.env.REFRESH_TOKEN_EXPIRY ,
    })
}


export default mongoose.model('User' , userSchema)
