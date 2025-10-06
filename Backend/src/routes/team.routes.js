import express from 'express';
import {
  createTeam,
  getUserTeams,
  getTeamById,
  updateTeam,
  deleteTeam,
  inviteMember,
  removeMember,
  respondToInvitation,
} from '../controllers/team.controller.js';
import { isAuthenticated, isLeader } from '../middleware/auth.middleware.js';

const router = express.Router();

// Sabhi routes ke liye authentication zaroori hai
router.use(isAuthenticated);

// Nayi team banana aur user ki saari teams get karna
router.route('/')
  .post(isLeader, createTeam)
  .get(getUserTeams);

// Naye member ko invite karna
router.route('/:teamId/invite')
  .post(isLeader, inviteMember);

// Member ko team se remove karna
router.route('/:teamId/members/:memberId')
  .delete(isLeader, removeMember);

// Invitation ko accept/decline karna
router.route('/invitations/:invitationId')
  .put(respondToInvitation);

// Ek team ko get, update, ya delete karna
router.route('/:teamId')
  .get(getTeamById)
  .put(isLeader, updateTeam)
  .delete(isLeader, deleteTeam);

export default router;