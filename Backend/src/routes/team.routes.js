import express from 'express';
import { createTeam, getUserTeams } from '../controllers/team.controller.js';
import { isAuthenticated, isLeader } from '../middleware/auth.middleware.js';

const router = express.Router();

// Apply isAuthenticated to all routes in this file
router.use(isAuthenticated);

router.route('/')
  .post(isLeader, createTeam) // Only leaders can create teams
  .get(getUserTeams);

export default router;