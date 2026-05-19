import jwt from 'jsonwebtoken';
import { ENV } from '../lib/env.js';
import User from '../models/User.js';

export const socketAuthMiddleware = async (socket, next) => {
    try {
        // const token = socket.handshake.auth?.token;
        const token = socket.handshake.headers.cookie
        ?.split('; ')
        .find(c => c.trim().startsWith('jwt='))
        ?.split('=')[1];

        console.log(token)

        if (!token) {
            console.log("Socket connection rejected: No token provided")
            return next(new Error('Authentication error: No token provided'));
        }

        const decoded = jwt.verify(token, ENV.JWT_SECRET);
        if (!decoded) {
            console.log("Socket connection rejected: Invalid token")
            return next(new Error('Authentication error: Invalid token'));
        }

        const user = await User.findById(decoded.userId).select('-password');
        if (!user) {
            console.log("Socket connection rejected: User not found")
            return next(new Error('Authentication error: User not found'));
        }

        socket.user = user; // Attach user info to socket object
        socket.userId = user._id.toString(); // Attach user ID to socket object

        console.log(`Socket authenticated for this user: ${user.fullname} (${user._id})`);
        next();


    } catch (error) {
        console.error("Socket authentication error:", error);
        next(new Error('Unauthorized - Authentication failed'));
    }
}