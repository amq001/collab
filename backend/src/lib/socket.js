import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import { ENV } from './env.js';
import { socketAuthMiddleware } from '../middleware/socket.auth.middleware.js';

const app = express();
const server = http.createServer(app);
const io = new Server(server,{
    cors:{
        origin: ENV.CLIENT_URL,
        credentials: true
    }
});

io.use(socketAuthMiddleware)

// This is for storing online users
const userSocketsMap = {}; // {userId: socketId}

io.on('connection',(socket)=>{
    console.log(`A user connected: ${socket.user.fullname}`);

    const userId = socket.userId;
    userSocketsMap[userId] = socket.id; // Store the mapping of userId to socketId

    // io.emit() is used to send event to all connected clients
    io.emit('getOnlineUsers', Object.keys(userSocketsMap)); // Broadcast the list of online users to all clients

    socket.on('disconnect',()=>{
        console.log(`A user disconnected: ${socket.user.fullname}`);
        delete userSocketsMap[userId];
        io.emit('getOnlineUsers', Object.keys(userSocketsMap)); // Broadcast the updated list of online users to all clients
    })
})

export { server, io , app };