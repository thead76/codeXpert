import express from 'express';
import { isAuthenticated, isLeader } from '../middleware/auth.middleware.js';
import {
  assignTask,         // <-- Renamed from createTask to assignTask
  getTasksForTeam,
  updateTaskStatus,
  respondToTask,      // <-- Import the new function
} from '../controllers/task.controller.js';

const router = express.Router();

// All task routes require the user to be authenticated
router.use(isAuthenticated);

// Route for a leader to assign a new task
router.route('/')
  .post(isLeader, assignTask);

// Route to get all tasks for a specific team
router.route('/team/:teamId')
  .get(getTasksForTeam);

// Route for a user to update the status of a task (e.g., 'To Do' -> 'In Progress')
router.route('/:taskId/status')
  .put(updateTaskStatus);

// --- NEW ROUTE ---
// Route for a user to respond to a task assignment (accept/decline)
router.route('/:taskId/respond')
  .put(respondToTask);

export default router;