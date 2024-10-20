import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from '../utils/ApiError.js'
import {User} from '../models/user.model.js'
import {uploadOnCloudinary} from '../utils/cloudinary.js'
import {ApiResponse} from '../utils/ApiResponse.js'
import jwt from "jsonwebtoken"
import mongoose from "mongoose"

//making mehtod for getting token
const generateAccessandRefreshTokens = async(userId)=>{
    try{
        const user=await User.findById(userId);
        const accessToken=user.generateAccessToken()
        const refreshToken=user.generateRefreshToken()

        user.refreshToken=refreshToken
        await user.save({validateBeforeSave: false})

        return {accessToken,refreshToken}


    }catch(error){
        throw new ApiError(500, "Something went wrong while generating refresh and access token")
    }
} 


const registerUser=asyncHandler(async(req,res)=>{
    // get user details from frontend
    const{username, email, fullname, password}=req.body
    console.log("email: ",email)


    // validation - not empty
    if(
        [fullname,email,username,password].some((field)=>field?.trim()==="")
    ){
        throw new ApiError(400,"All fields are required")
    }

    // check if user already exists: username, email
    const existedUser=await User.findOne({
        $or: [{username},{email}]
    })

    if(existedUser){
        throw new ApiError(409,"User already exist")
    }

    // check for images, check for avatar
    const avatarLocalPath=req.files?.avatar[0]?.path
    // const coverImageLocalPath=req.files?.coverImage[0]?.path

    let coverImageLocalPath;
    //updating multiple files thats why using .files not .file like in updatefile
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length>0){
        coverImageLocalPath=req.files.coverImage[0].path
    }

    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar file is required")
    }
    
    // upload them to cloudinary, avatar
    const avatar=await uploadOnCloudinary(avatarLocalPath)
    const coverImage=await uploadOnCloudinary(coverImageLocalPath)

    if(!avatar){
        throw new ApiError(400,"Avatar file is required")
    }


    // create user object - create entery in db
    const user=await User.create({
        fullname,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })

    
    
    
    //remove password and feresh token field from response
    
    const createdUser=await User.findById(user._id).select(
        "-password -refreshToken"
    )

    // check for user creation
    if(!createdUser){
        throw new ApiError(500, "Something went wrong while registring user")
    }

    // return response
    return res.status(201).json(
        new ApiResponse(200,createdUser, "User registered successfully")
    )

    

})

const loginUser=asyncHandler(async(req,res)=>{
    // req body-> data
    const {email,username,password}=req.body

    //username or email
    if(!username && !email){
        throw new ApiError(400,"username or email is required")
    }

    //find the user
    const user=await User.findOne({
         $or: [{username},{email}]
        })
        res.json(user)
    
        if(!user){
            throw new ApiError(404,"User does not exist")
        }

    //password check
    const isPasswordValid=await user.isPasswordCorrect(password)

    if(!isPasswordValid){
        throw new ApiError(401,"Invalid user credentials")
    }

    //access and refresh token
    const {accessToken, refreshToken}=await generateAccessandRefreshTokens(user._id)

    const loggedInUser=User.findById(user._id).select("-password -refreshToken")




    // send cookies
    const options={
        httpOnly: true,
        secure: true
    }

    return res.status(200).cookie("accessToken", accessToken, options).cookie("refreshToken",refreshToken,options).json(
        new ApiResponse(
            200,
            {
                //might be user trying to save  accesstoken and refreshtoken in local storage or in mobile application that;s why we are also passing accessToken and refreshToken,ITs optional not mandatory
                user: loggedInUser, accessToken, refreshToken
            },
            "User logges In Successfully"
        )
    )


    
})

const logoutUser=asyncHandler(async(req,res)=>{
    // clear cookies and refresh token
    //first create auth middleware to access token
    await User.findByIdAndUpdate(
        req.user._id,{
            $set:{
                refreshToken: undefined
            }
        },{
            new: true
        })

        const options={
            httpOnly: true,
            secure: true
        }

        return res.status(200).clearCookie("accessToken",options).clearCookie("refreshToken", options).json(
            new ApiResponse(200,{},"User logged Out")
        )
})


//comparing token so that when access token got expired it automatically create new token
const refreshAccessToken= asyncHandler(async(req,res)=>{

   const incomingRefreshToken= req.cookies.refreshToken || req.body.refreshToken

   if(!incomingRefreshToken){
    throw new ApiError(401,"Unauthorized request")
   }

   try {
    const decodedToken=jwt.verify(
     incomingRefreshToken,
     process.env.REFRESH_TOKEN_SECRET
    )
 
    const user=await User.findById(decodedToken?._id)
 
    if(!user){
     throw new ApiError(401,"Invalid refresh token")
    }
 
    if(incomingRefreshToken !== user?.refreshToken){
     throw new ApiError(401,"Refresh Token is expired or use")
    }
 
    const options={
     httpOnly: true,
     secure: true
    }
 
    const {accessToken,newrefreshToken}=await generateAccessandRefreshTokens(user._id)
 
    return res.status(200).cookie("accessToken",accessToken,options).cookie("refreshToken",newrefreshToken,options).json(
     new ApiResponse(
         200,
         {accessToken,refreshToken: newrefreshToken},
         "Access token refreshed"
 
     )
    )
   } catch (error) {
     throw new ApiError(401, error?.message || "Invalid refresh token")
   }
   
})

//updating password
const changeCurrentPassword=asyncHandler(async(req,res)=>{
    const {oldPassword,newPassword}=req.body

    const user=await User.findById(req.user?._id)
    const isPasswordCorrect=await user.isPasswordCorrect(oldPassword)

    if(!isPasswordCorrect){
        throw new ApiError(400,"Invalid old Password")
    }

    user.password=newPassword
    await user.save({validateBeforeSave: false})

    return res.status(200).json(
        new ApiResponse(200, {}, "Password Changed Succesfully")
    )
})

//getting current user
const getCurrentUser=asyncHandler(async(req,res)=>{
    return res.status(200).json(new ApiResponse(200,req.user,"current user fetched succesfully"))
})

//update account details
//make sure when u want to update files nade a different controller for it
const updateAccountDetails=asyncHandler(async(req,res)=>{
    const {fullname,email}=req.body

    if(!fullname || !email){
        throw new ApiError(400, "All fields are required")
    }

    const user=User.findByIdAndUpdate(
        req.user?._id,
        {
            //method use to set updated name and email
            $set:{
                fullname,
                email
            }
        },
        {new: true}
    ).select("-password")

    res.status(200).json(
        new ApiResponse(200, user, "Account detaild update successfully")
    )
})

const updateUserAvatar=asyncHandler(async(req,res)=>{
    const avatarLocalPath=req.file?.path

    if(!avatarLocalPath){
        throw new ApiError(400,"Avatar file is missing")
    }

    const avatar=await uploadOnCloudinary(avatarLocalPath)

    if(!avatar.url){
        throw new ApiError(400,"Error while uploading on avatar")
    }

    const user=await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                avatar: avatar.url
            }
        },
        {new: true}
    ).select("-password")

    return res.status(200).json(
        new ApiResponse(200, user,"Cover image updated successfully")
    )
})

const updateUserCoverImage=asyncHandler(async(req,res)=>{
    const coverImageLocalPath=req.file?.path

    if(!coverImageLocalPath){
        throw new ApiError(400,"Cover Image file is missing")
    }

    const coverImage=await uploadOnCloudinary(coverImageLocalPath)

    if(!coverImage.url){
        throw new ApiError(400,"Error while uploading on avatar")
    }

    const user=await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                coverImage : coverImage.url
            }
        },
        {new: true}
    ).select("-password")

    return res.status(200).json(
        new ApiResponse(200, user,"Cover image updated successfully")
    )
})

const getUserChannelProfile=asyncHandler(async(req,res)=>{
    //getting channel url
    const {username}=req.params

    if(!username?.trim()){
        throw new ApiError(400, "username is missing")
    }

    const channel=await User.aggregate([
        {
            $match: {
                username: username?.toLowerCase()
            }
        },{
            $lookup:{
                from:"subscriptions", //as when creating model the model name saved in lowercase and also in plural form
                localField:"_id",
                foreignField:"channel",
                as: "subscribers"
            }

        },
        {
            $lookup: {
                from:"subscriptions", //as when creating model the model name saved in lowercase and also in plural form
                localField:"_id",
                foreignField:"subscriber",
                as: "subscribedTo"
            }
        },{
            $addFields:{
                subscribersCount:{
                    $size: "$subscribers"
                },
                channelSubscribedToCount:{
                    $size: "$subscribedTo"
                },
                isSubscribed:{
                    $cond:{
                        if:{$in: [req.user?._id,"$subscribers.subscriber"]},
                        then: true,
                        else: false
                    }
                }
            }
        },{
            $project:{
                fullName: 1,
                username: 1,
                subscribersCount: 1,
                channelSubscribedToCount: 1,
                isSubscribed: 1,
                avatar: 1,
                coverImage: 1,
                email: 1
            }
        }
    ])
    console.log(channel)

    if(!channel?.length){
        throw new ApiError(404, "channel does nt exists")
    }

    return res.status(200).json(
        new ApiResponse(200, channel[0], "User channel fetched successfully")
    )
})

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar,
    updateUserCoverImage,
    getUserChannelProfile
}