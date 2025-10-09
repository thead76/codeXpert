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

/**
 * Generates a reply for the chatbot based on keywords.
 * This function does NOT use the Gemini API to ensure fast replies for common questions.
 */
export async function getChatbotReply(message) {
    const lowerCaseMessage = message.toLowerCase();

    // Keyword-based response logic for instant answers
    const knowledgeBase = {
        // Greetings
        "hello": "Hello there! How can I help you with CodeXpert today?",
        "hi": "Hi! I'm the CodeXpert assistant. Ask me anything about our platform.",
        "good morning": "Good morning! I hope you have a productive day. What can I help you with?",
        "good afternoon": "Good afternoon! How can I assist you?",
        "good evening": "Good evening! Let me know if you have any questions about CodeXpert.",

        // General Info
        "codexpert": "CodeXpert is an AI-powered platform designed to help developers and teams improve code quality, streamline workflows, and enhance productivity.",
        "features": "We offer a range of features including AI-powered code analysis, bug detection, automated code commenting, team and task management, performance reports, and a notice board.",
        "pricing": "We offer several pricing plans to fit your needs. You can find detailed information on our pricing page.",
        "support": "You can reach our support team by emailing support@codexpert.com or through the contact form on our website.",
        "documentation": "Our official documentation is available at [codexpert.com/docs](https://codexpert.com/docs). You'll find guides and tutorials there.",
        "account": "You can manage your account, including billing and profile settings, from your user dashboard.",
        "start": "To get started, simply sign up for an account, and you can start using our features right away. Check out the dashboard for all the available tools.",
        "trial": "Yes, we offer a 14-day free trial for all new users. You can explore all the features of CodeXpert during the trial period.",

        // Feature Specific
        "login": "You can log in to your CodeXpert account by clicking the 'Login' button on the top right of the homepage. If you're having trouble, you can use the 'Forgot Password' link to reset your password.",
        "create team": "To create a team, go to your dashboard and click on the 'My Team' section. From there, you'll see an option to 'Create a New Team'. You can then invite members to join.",
        "assign task": "As a team admin or manager, you can assign tasks from the 'Team Dashboard'. Select a team, go to the 'Tasks' tab, and click 'Assign Task'. You can then set the task details, priority, and assign it to a team member.",
        "reports": "The 'Reports' section in your dashboard provides detailed analytics on team and individual performance. You can view charts on task completion rates, priority distribution, and more.",
        "analyze reports": "To analyze reports, navigate to the 'Reports' page. You can filter the data by date range, team member, and task status to gain insights into your team's productivity and identify areas for improvement.",
        "post notice": "To post a notice for your team, go to the 'Notice Board' section. Click on 'Post a Notice', write your message, and it will be visible to all members of your team.",
        "tools": "Our AI tools, like the Bug Finder and Code Commenter, can be accessed from the main dashboard. Simply select the tool you want to use, input your code, and let our AI assist you."
    };

    for (const keyword in knowledgeBase) {
        if (lowerCaseMessage.includes(keyword)) {
            return knowledgeBase[keyword];
        }
    }

    // Default response if no keywords match
    return "I can only answer questions related to CodeXpert. Please try asking about our features, pricing, or how to get started.";
}