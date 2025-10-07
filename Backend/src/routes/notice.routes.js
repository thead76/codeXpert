import express from 'express';
import { isAuthenticated, isLeader } from '../middleware/auth.middleware.js';
import { createNotice, getNotices, deleteNotice } from '../controllers/notice.controller.js';

const router = express.Router();

router.use(isAuthenticated);

router.route('/')
    .post(isLeader, createNotice) // Sirf leader notice bana sakta hai
    .get(getNotices); // Sabhi members notice dekh sakte hain

router.route('/:noticeId')
    .delete(isLeader, deleteNotice); // Sirf leader notice delete kar sakta hai

export default router;