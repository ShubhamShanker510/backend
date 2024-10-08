//require('dotenv').config({path: './env})
import dotenv from "dotenv";
import connectDB from "./db/index.js";

dotenv.config({
    path:'./env'
})

connectDB()
.then(()=>{
    app.on("error",(error)=>{
        console.log("Errror", error);
        throw error;
    })

    app.listen(process.env.PORT || 8000,()=>{
        console.log(`Server is running at port: ${process.env.PORT}`)
    })
})
.catch((err)=>{
    console.log("MONGO db connection failed !!! ",err)
})

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