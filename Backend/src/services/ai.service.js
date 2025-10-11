import { GoogleGenerativeAI } from '@google/generative-ai';
import crypto from 'crypto';

// --- DIRECT FIX ---
// We are temporarily hard-coding the API key here to bypass any .env file issues.
// This is for debugging only and not recommended for production.
const API_KEY = process.env.GEMINI_API_KEY;
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


export async function getChatbotReply(message) {
    const lowerCaseMessage = message.toLowerCase();

    const knowledgeBase = {
        // --- Greetings & Small Talk ---
        "thank you": "You're welcome! Is there anything else I can help you with?",
        "thanks": "You're welcome! Let me know if you need anything else.",
        "who are you": "I am the CodeXpert AI assistant, here to help you with any questions about our platform.",
        "hello": "Hello there! How can I help you with CodeXpert today?",
        "hi": "Hi! I'm the CodeXpert assistant. Ask me anything about our platform.",
        "hey": "Hey! How can I assist you?",
        "good morning": "Good morning! I hope you have a productive day. What can I help you with?",
        "good afternoon": "Good afternoon! How can I assist you?",
        "good evening": "Good evening! Let me know if you have any questions about CodeXpert.",
        "how are you": "I'm just a bot, but I'm ready to help! What's on your mind?",

        // --- Core Platform Information ---
        "what is codexpert": "CodeXpert is an AI-powered platform designed for developers and teams to improve code quality, streamline workflows, and enhance productivity through a suite of intelligent tools.",
        "about codexpert": "CodeXpert is an AI-powered platform designed for developers and teams to improve code quality, streamline workflows, and enhance productivity through a suite of intelligent tools.",
        "codexpert": "CodeXpert is an AI-powered platform designed for developers and teams to improve code quality, streamline workflows, and enhance productivity.",

        // --- Getting Started & Onboarding ---
        "how do i get started": "To get started, simply sign up for an account, and you can start using our features right away. Your dashboard will be the central hub for all tools and team activities.",
        "start": "To get started, simply sign up for an account, and you can start using our features right away. Check out the dashboard for all the available tools.",
        "trial": "Yes, we offer a 14-day free trial for all new users. You can explore all the features of CodeXpert during the trial period without any commitment.",
        "demo": "Currently, we don't offer live demos, but our 14-day free trial gives you full access to explore everything CodeXpert has to offer.",
        
        // --- Features Explained ---
        "features": "We offer AI-powered code analysis, a bug finder, an automated code commenter, team and task management, performance reports, and a team notice board.",
        "what can you do": "I can help you understand our features, guide you on how to use the platform, and answer questions about account management, pricing, and troubleshooting.",
        "capabilities": "Our platform's capabilities include static code analysis, bug detection, automated documentation, task assignment and tracking, and team performance analytics.",

        // --- AI Tools (In-Depth) ---
        "code analysis": "Our AI Code Analysis tool reviews your code for quality, complexity, and adherence to best practices. It provides a quality score from 0-100 and suggests specific improvements.",
        "bug finder": "The Bug Finder scans your code for potential bugs, logical errors, and edge-case issues. It provides a list of mistakes and the fully corrected code.",
        "code commenter": "The Code Commenter automatically adds meaningful, inline comments to your code to explain complex parts, making it easier to read and maintain.",
        "what languages are supported": "Our AI tools currently support a wide range of popular languages including JavaScript, Python, Java, C++, TypeScript, and more. We are always expanding our language support.",
        "is my code secure": "Absolutely. Your code is processed securely and is never stored on our servers after the analysis is complete. We use encrypted connections and prioritize your data privacy.",
        "how does the ai work": "Our AI is powered by advanced large language models (LLMs) specifically fine-tuned for code-related tasks like analysis, debugging, and documentation.",
        "tools": "Our AI tools, like the Bug Finder and Code Commenter, can be accessed from the main dashboard. Simply select the tool you want to use, input your code, and let our AI assist you.",

        // --- Team & Task Management ---
        "invite members": "To invite a member, go to the 'My Team' section, select your team, and click on 'Invite Member'. You'll need their email address to send an invitation.",
        "member roles": "Teams have different roles like Admin, Manager, and Member. Admins have full control, Managers can assign tasks and manage projects, and Members can work on assigned tasks.",
        "create team": "To create a team, go to your dashboard and click on the 'My Team' section. From there, you'll see an option to 'Create a New Team'. You can then invite members to join.",
        "assign task": "As a team admin or manager, you can assign tasks from the 'Team Dashboard'. Select a team, go to the 'Tasks' tab, and click 'Assign Task'. You can then set the task details, priority, and assign it to a team member.",
        "task status": "You can update the status of a task (e.g., 'To-Do', 'In Progress', 'Done') from the task details page in your team's dashboard.",
        "deadline": "Deadlines for tasks can be set when you create or edit a task. Team members will see the due date on their task list.",
        "reports": "The 'Reports' section in your dashboard provides detailed analytics on team and individual performance. You can view charts on task completion rates, priority distribution, and more.",
        "notice": "To post a notice for your team, go to the 'Notice Board' section. Click on 'Post a Notice', write your message, and it will be visible to all members of your team.",

        // --- Account, Pricing & Billing ---
        "pricing": "We offer several pricing plans, including a Free tier for individuals, a Pro plan for power users, and a Team plan for collaborative projects. You can find detailed information on our pricing page.",
        "plans": "We have Free, Pro, and Team plans. Each plan offers a different level of access to our features and tools. Check the pricing page for a full comparison.",
        "upgrade": "You can upgrade your plan at any time from the 'Billing' section in your account settings. The change will be effective immediately.",
        "cancel subscription": "You can cancel your subscription from the 'Billing' section in your account settings. Your access will continue until the end of the current billing period.",
        "payment methods": "We accept all major credit cards, including Visa, MasterCard, and American Express. All payments are processed securely.",
        "account": "You can manage your account, including your profile, password, and billing settings, from your user dashboard.",
        
        // --- Troubleshooting & Support ---
        "login problem": "If you're having trouble logging in, please try resetting your password using the 'Forgot Password' link on the login page. If the problem persists, contact our support team.",
        "support": "You can reach our support team by emailing support@codexpert.online or through the contact form on our website. We're happy to help!",
        "contact": "For support, email us at support@codexpert.online. For business inquiries, please use our contact form.",
        "not working": "I'm sorry to hear you're having trouble. Could you please describe the issue in more detail? You can also contact our support team for direct assistance.",
        
    };

    // --- YEH HAI FIX ---

    // 1. Saare keywords ki ek list banayein
    const keywords = Object.keys(knowledgeBase);

    // 2. Keywords ko lambai ke hisaab se sort karein (sabse lamba pehle)
    const sortedKeywords = keywords.sort((a, b) => b.length - a.length);

    // 3. Ab sorted list par loop karein
    for (const keyword of sortedKeywords) {
        if (lowerCaseMessage.includes(keyword)) {
            // Jaise hi pehla match mile, woh sabse specific match hoga
            return knowledgeBase[keyword];
        }
    }

    // Default response agar koi bhi keyword match na ho
    return "I can only answer questions related to CodeXpert. Please try asking about our features, pricing, or how to get started.";
}