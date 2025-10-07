import express from 'express';
import { 
    getNotifications, 
    markNotificationAsRead,
    markAllNotificationsAsRead // <-- Import the new function
} from '../controllers/team.controller.js'; // Adjust path if you moved controllers
import { isAuthenticated } from '../middleware/auth.middleware.js';

const router = express.Router();

// All notification routes require a logged-in user
router.use(isAuthenticated);

// Get all unread notifications for the user
router.route('/').get(getNotifications);

// --- NEW ROUTE ---
// Mark all of the user's notifications as read
router.route('/mark-all-read').put(markAllNotificationsAsRead);

// Mark a single notification as read
router.route('/:notificationId/read').put(markNotificationAsRead);

export default router;