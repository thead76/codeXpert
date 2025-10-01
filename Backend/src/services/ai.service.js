import { GoogleGenerativeAI } from '@google/generative-ai';
import crypto from 'crypto';

// --- DIRECT FIX ---
// We are temporarily hard-coding the API key here to bypass any .env file issues.
// This is for debugging only and not recommended for production.
const API_KEY = "AIzaSyBz-NewM6qAQtg-CCAiDvWZM-TqhFigR9Y";

// Initialize the Gemini client directly with the key.
const genAI = new GoogleGenerativeAI(API_KEY);

// This is a simple in-memory store for our jobs.
const jobs = new Map();

/**
 * Creates the detailed prompt for the Gemini model.
 */
function createPrompt(code) {
  return `
    You are an expert code reviewer AI named 'CodeXpert'.
    Your response MUST be a single, valid JSON object and nothing else.
    The JSON object must have this exact structure:
    {
      "qualityScore": <An integer score from 0 to 100>,
      "improvementPoints": [
        { "line": <number>, "point": "<string>" }
      ],
      "improvedCode": "<The full, refactored code as a single string. Newlines must be escaped as \\n.>"
    }
    Analyze this code:
    \`\`\`
    ${code}
    \`\`\`
  `;
}

/**
 * Starts the code analysis process in the background.
 */
export function startAnalysis(codeToAnalyze) {
  const jobId = crypto.randomBytes(16).toString('hex');
  jobs.set(jobId, { status: 'pending', result: null });

  (async () => {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-pro-latest' });
      const prompt = createPrompt(codeToAnalyze);
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      let text = response.text().replace(/```json/g, '').replace(/```/g, '').trim();

      const analysisResult = JSON.parse(text);
      jobs.set(jobId, { status: 'complete', result: analysisResult });
      
    } catch (error) {
      // Log the full error to see what Gemini is actually complaining about
      console.error(`--- DETAILED ERROR for job ${jobId} ---`, error);
      jobs.set(jobId, { status: 'error', result: { message: 'Failed to analyze the code.' } });
    }
  })();

  return jobId;
}

/**
 * Retrieves the status and result of an analysis job.
 */
export function getAnalysis(jobId) {
  if (!jobs.has(jobId)) {
    return null;
  }
  return jobs.get(jobId);
}

/**
 * Generates code with comments using Gemini AI
 */
export async function generateCodeComments(code) {
  const prompt = `
    You are an expert code reviewer named 'CodeXpert'.
    Your task is to return the code with meaningful inline comments explaining
    each important part of the code. Do NOT change the logic.
    Respond ONLY with the code, including the comments, no additional text.
    
    Original code:
    \`\`\`
    ${code}
    \`\`\`
  `;

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro-latest' });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();

    // --- CLEANUP ---
    // Remove Markdown code fences like ```java, ```python, ``` etc.
    text = text.replace(/```[a-z]*\n?/gi, '').replace(/```$/g, '').trim();

    return text; // Clean code with inline comments
  } catch (error) {
    console.error('Gemini API error in generateCodeComments:', error);
    throw error;
  }
}


/**
 * Uses Gemini AI to find bugs AND return corrected code
 */
export async function generateBugReport(code) {
  const prompt = `
    You are an expert code reviewer named 'CodeXpert'.
    Analyze the following code for any potential bugs, logical errors, or edge-case issues.
    Respond ONLY in JSON with this structure:
    {
      "mistakes": [
        "Description of mistake 1",
        "Description of mistake 2"
      ],
      "fixedCode": "The full corrected code as a single string. Newlines must be escaped as \\n."
    }

    Original code:
    \`\`\`
    ${code}
    \`\`\`
  `;

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro-latest' });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = await response.text();

    // --- CLEANUP ---
    text = text.replace(/```[a-z]*\n?/gi, '').replace(/```$/g, '').trim();

    // Parse JSON safely
    const data = JSON.parse(text);
    return data; // { mistakes: [...], fixedCode: "..." }
  } catch (error) {
    console.error('Gemini API error in generateBugReport:', error);
    throw error;
  }
}
