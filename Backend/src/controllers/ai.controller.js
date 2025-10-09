import * as aiService from '../services/ai.service.js';

/**
 * Controller to start a new code analysis job.
 */
export async function initiateAnalysis(req, res) {
  const { code } = req.body;

  if (!code || typeof code !== 'string') {
    return res.status(400).json({ message: 'Code must be a non-empty string.' });
  }

  // Start the analysis and get the job ID
  const jobId = aiService.startAnalysis(code);

  // Immediately respond with 202 Accepted and the job ID
  res.status(202).json({
    message: 'Analysis started. Use the jobId to check the status.',
    jobId: jobId
  });
}

/**
 * Controller to get the status and result of an analysis job.
 */
export async function getAnalysisStatus(req, res) {
  const { jobId } = req.params;
  const analysis = aiService.getAnalysis(jobId);

  if (!analysis) {
    return res.status(404).json({ message: 'Analysis job not found.' });
  }

  res.status(200).json(analysis);
}
/**
 * Controller to add comments to a given code snippet.
 */
export async function addCodeComments(req, res) {
  const { code } = req.body;

  if (!code || typeof code !== 'string') {
    return res.status(400).json({ message: 'Code must be a non-empty string.' });
  }

  try {
    const commentedCode = await aiService.generateCodeComments(code);
    res.status(200).json({ commentedCode });
  } catch (error) {
    console.error('Error adding comments:', error);
    res.status(500).json({ message: 'Failed to add comments to the code.' });
  }
}

export async function findBugs(req, res) {
  const { code } = req.body;

  if (!code || typeof code !== 'string') {
    return res.status(400).json({ message: 'Code must be a non-empty string.' });
  }

  try {
    const bugData = await aiService.generateBugReport(code);
    res.status(200).json(bugData); // { mistakes: [...], fixedCode: "..." }
  } catch (error) {
    console.error('Error finding bugs:', error);
    res.status(500).json({ message: 'Failed to analyze bugs in the code.' });
  }
}

/**
 * Controller for the chatbot.
 */
export async function chat(req, res) {
    const { message } = req.body;

    if (!message || typeof message !== 'string') {
        return res.status(400).json({ message: 'Message must be a non-empty string.' });
    }

    try {
        const reply = await aiService.getChatbotReply(message);
        res.status(200).json({ reply });
    } catch (error) {
        console.error('Error in chatbot controller:', error);
        res.status(500).json({ message: 'Failed to get a response from the chatbot.' });
    }
}