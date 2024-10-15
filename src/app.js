import express from 'express'
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app=express()

//configure cors
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

//setting limit for json so that site dosen't crash
app.use(express.json({limit: "16kb"}))

//taking data from url
app.use(express.urlencoded({extended:true, limit:"16kb"}))

//need to use image,pdf etc
app.use(express.static("public"))

//for using and setup of cookies of user to perform CRUD operations
app.use(cookieParser())



export default app;