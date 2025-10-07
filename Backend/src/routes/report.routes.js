import express from 'express';
import { isAuthenticated, isLeader } from '../middleware/auth.middleware.js';
import { getUserStats, getLeaderStats } from '../controllers/report.controller.js';

const router = express.Router();

router.use(isAuthenticated);

// Yeh route sabke liye hai (member aur leader)
router.route('/my-stats').get(getUserStats);

// --- YEH NAYA ROUTE HAI ---
// Yeh route sirf leaders ke liye hai
router.route('/leader-stats').get(isLeader, getLeaderStats);

export default router;