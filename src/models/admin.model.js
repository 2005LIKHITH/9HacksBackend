import mongoose , {Schema} from "mongoose"
import jwt from 'jsonwebtoken';


const adminSchema = new Schema({
    username:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    refreshToken:{
        type:String,
        // required:true
    }
})
// adminSchema.methods.isPasswordCorrect = async function (password){
//     //console.log(password);
//     return await bcrypt.compare(password , this.password)
// }
adminSchema.methods.generateAccessToken = function(){
    return jwt.sign({
        _id : this._id,
        username : this.username
        
    }, process.env.ACCESS_TOKEN_SECRET,{
        expiresIn : process.env.ACCESS_TOKEN_EXPIRY ,
    })
}
adminSchema.methods.generateRefreshToken = function(){
    return jwt.sign({
        _id : this._id,

        
    }, process.env.REFRESH_TOKEN_SECRET,{
        expiresIn : process.env.REFRESH_TOKEN_EXPIRY ,
    })
}


export const Admin =  mongoose.model('Admin' , adminSchema)