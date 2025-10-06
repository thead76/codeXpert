import express from 'express';
import { getNotifications, markNotificationAsRead } from '../controllers/team.controller.js';
import { isAuthenticated } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(isAuthenticated);

router.route('/').get(getNotifications);
router.route('/:notificationId/read').put(markNotificationAsRead);

export default router;