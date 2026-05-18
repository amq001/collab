import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.route.js';
import messageRoutes from './routes/message.route.js';
import { connectDB } from './lib/db.js';
import { ENV } from './lib/env.js';
import cors from 'cors';

// Initialize Express app
const app = express();
const __dirname = path.resolve();
const PORT = ENV.PORT || 3000;

// Middleware
app.use(express.json({limit: '5mb'})); // To handle JSON payloads, especially for image data
app.use(cors({
    origin: ENV.CLIENT_URL,
    credentials: true
}));
app.use(cookieParser());
app.use("/api/auth",authRoutes)
app.use("/api/messages",messageRoutes)

// make ready for deployment
if(ENV.NODE_ENV === 'production'){
    app.use(express.static(path.join(__dirname,"../frontend/dist")))

    app.get("*",(_,res)=>{
        res.sendFile(path.join(__dirname,"../frontend/dist/index.html"))
    })
}

// Start the server
app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
    connectDB();
})