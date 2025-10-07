import express from 'express';
import { isAuthenticated, isLeader } from '../middleware/auth.middleware.js';
import {
  assignTask,
  respondToTask,
  updateTaskStatus,
  reviewTask,
  getMyTasks,
  getTeamTasks,
} from '../controllers/task.controller.js';

const router = express.Router();
router.use(isAuthenticated);

router.route('/').post(isLeader, assignTask);
router.route('/my-tasks').get(getMyTasks);
router.route('/team-tasks').get(isLeader, getTeamTasks);
router.route('/:taskId/respond').put(respondToTask);
router.route('/:taskId/status').put(updateTaskStatus);
router.route('/:taskId/review').put(isLeader, reviewTask);

export default router;