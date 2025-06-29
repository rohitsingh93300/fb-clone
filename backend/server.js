import express from "express"
import dotenv from "dotenv"
import connectDB from "./database/db.js"
import cookieParser from "cookie-parser"
import authRoute from "./routes/auth.route.js"
import postRoute from "./routes/post.route.js"
import commentRoute from "./routes/comment.route.js"
import storyRoute from "./routes/story.route.js"
import cors from "cors"
import path from "path"



dotenv.config()
const app = express()
const PORT = process.env.PORT || 3000

// default middleware
app.use(express.json());
app.use(cookieParser())

app.use(cors({
    origin: "https://fb-clone-726q.onrender.com",
    credentials:true
}))

const _dirname = path.resolve()

//api route
app.use("/api/v1/auth",authRoute)
app.use("/api/v1/post",postRoute)
app.use("/api/v1/comment",commentRoute)
app.use("/api/v1/story",storyRoute)

app.use(express.static(path.join(_dirname, "/frontend/dist")));
 app.get(/^\/(?!api).*/,(_, res)=>{
   res.sendFile(path.resolve(_dirname, "frontend", "dist", "index.html"))
 });

app.listen(PORT,()=>{
    console.log(`server listen at port ${PORT}`);
    connectDB()
    
})