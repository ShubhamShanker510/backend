import mongoose from "mongoose";
import jwt from "jsonwebtoken"; // bearer token(like a key who has the key he/she can access data)
import bcrypt from 'bcrypt'

const userSchema=new mongoose.Schema({

    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true // just to make it searchable
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    fullname: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    avatar: {
        type: String, // cloudinary url
        required: true,
    },
    coverImage:{
        type: String,
    },
    watchHistory: [
        {
            type:mongoose.Schema.Types.ObjectId,
            ref: "Video"
        }
    ],
    password: {
        type: String,
        required: [true, "Password is required"]
    },
    refreshToken: {
        type: String,
    }

},{
    timestamps: true
})

//going to encrypt password before saving to database
// always avoid call back function as thier is no refrence of 'this'
userSchema.pre("save", async function(next){
    if(!this.isModified("password")) return next();

    this.password=await bcrypt.hash(this.password, 10)
    next()
})

//custom methodd for checking password
userSchema.methods.isPasswordCorrect= async function(password){
   return await bcrypt.compare(password, this.password)
}

//cutom method for generating token
userSchema.methods.generateAccessToken=function(){
   return jwt.sign({
        _id: this._id,
        email: this.email,
        username: this.username,
        fullname: this.fullname
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn:process.env.ACCESS_TOKEN_EXPIRY
    }
)
}

//cutom method for generating token
userSchema.methods.generateRefreshToken=function(){
    return jwt.sign({
        _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn:process.env.REFRESH_TOKEN_EXPIRY
    }
)
}

export const User=mongoose.model("User",userSchema)