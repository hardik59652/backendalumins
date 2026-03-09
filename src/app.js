import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

app.use("/uploads", express.static("uploads"));
// app.use(cors({
//     origin:process.env.CORS_ORIGIN,
//     credentials:true,
// }))
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
  }))
app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true,limit:"16kb"}))
app.use(express.static("public"))
app.use(cookieParser())




//iimport usser route

import userRouter from "./routes/user.routes.js"
 // routes declaration

 app.use("/api/v1/users",userRouter)
export default app