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
app.use("/uploads", express.static("uploads"))
app.use(express.static("public"))
app.use(cookieParser())




//iimport usser route

import userRouter from "./routes/user.routes.js"
 // routes declaration

 app.use("/api/v1/users",userRouter)


 import achievementRouter from "./routes/achievement.routes.js"
 app.use("/api/v1/achievements",achievementRouter)
 import jobOpportunityRouter from "./routes/jobOpportunity.routes.js"
 app.use("/api/v1/jobopportunity",jobOpportunityRouter)
 import jobApplicatonRouter from "./routes/jobApplication.routes.js"
 app.use("/api/v1/jobapplication",jobApplicatonRouter)
 import newsRouter from "./routes/news.routes.js"
 app.use("/api/v1/news",newsRouter)
 import eventsRouter from "./routes/events.routes.js"
 app.use("/api/v1/events",eventsRouter)
 import campaignRouter from "./routes/campaign.routes.js"
 app.use("/api/v1/campaign",campaignRouter)
 import donationrouter from "./routes/donations.routes.js"
 app.use("/api/v1/donation",donationrouter)
 import reunionRouter from "./routes/reunion.routes.js"
 app.use("/api/v1/reunion",reunionRouter)
 import givebackrouter from "./routes/giveback.routes.js"
 app.use("/api/v1/giveback",givebackrouter)
export default app