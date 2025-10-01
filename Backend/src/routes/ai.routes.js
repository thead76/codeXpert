import express from 'express';
import * as aiController from '../controllers/ai.controller.js';

const router = express.Router();

// Route to initiate the code analysis
// POST /api/v1/analyze
router.post('/', aiController.initiateAnalysis);
// Route to add comments to the code
// POST /api/v1/analyze/comment
router.post('/comment', aiController.addCodeComments);


// Route to check the status and get the result of the analysis
// GET /api/v1/analyze/status/:jobId
router.get('/status/:jobId', aiController.getAnalysisStatus);

export default router;