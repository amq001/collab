import express from 'express';
import { getAllContacts, getChatPartners, getMessagesByUserId, sendMessage } from '../controllers/message.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';
import { arcjetMiddleware } from '../middleware/arcjet.middleware.js';

const router = express.Router();

// Apply Arcjet middleware to all routes in this router first, then apply protectRoute middleware to ensure all routes are protected and also monitored by Arcjet
router.use(arcjetMiddleware, protectRoute) // Apply protectRoute middleware to all routes in this router

router.get('/contacts', getAllContacts )
router.get('/chats', getChatPartners )
router.get('/:id', getMessagesByUserId )
router.post('/send/:id', sendMessage )

export default router;