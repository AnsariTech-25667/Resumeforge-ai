/*
    Resume Builder — API Server
    Created and maintained by Maaz Ansari
    Contact: maazansari25667@gmail.com
*/

import express from "express";
import cors from "cors";
import { config } from "./config.js";
import connectDB from "./configs/db.js";
import userRouter from "./routes/userRoutes.js";
import resumeRouter from "./routes/resumeRoutes.js";
import aiRouter from "./routes/aiRoutes.js";

const app = express();
const PORT = config.PORT;

// Database connection
await connectDB()

app.use(express.json())
app.use(cors())

app.get('/', (req, res)=> res.send("Server is live..."))
app.use('/api/users', userRouter)
app.use('/api/resumes', resumeRouter)
app.use('/api/ai', aiRouter)

app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
    
});