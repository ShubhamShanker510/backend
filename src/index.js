// require('dotenv').config({path: './env'})
import dotenv from 'dotenv'
import connectDB from './db/index.js';

dotenv.config({
    path: './env'
})

connectDB()








// import express from 'express';
// const app=express()

// ;(async ()=>{
//     try {
//        await mongoose.connect(`${process.env.MONGO_URL}/${DB_NAME}`)
//        app.on("errror", ()=>{
//         console.log("ERRR: ", error);
//         throw error
//        })
//        app.listen(process.env.PORT,()=>{
//         console.log(`App is listning on ${process.env.PORT}`)
//        })
        
//     } catch (error) {
//         console.error("ERROR: ",error);
//         throw error
//     }
// })()