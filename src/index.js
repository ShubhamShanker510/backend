//require('dotenv').config({path: './env})
import dotenv from "dotenv";
import connectDB from "./db/index.js";

dotenv.config({
    path:'./env'
})

connectDB();

// import express from 'express'

// (async()=>{
//     try{
//         await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`)
//         app.on("error",(error)=>{
//             console.log("ERR: ",error)
//             throw error
//         })

//         app.listen(process.env.PORT,()=>{
//             console.log(`Server is running on ${process.env.PORT} `)
//         })
        
//     }catch(error){
//         console.error("ERROR: ",error)
//     }
// })()