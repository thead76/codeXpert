import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy } from "lucide-react";
import axios from "axios";

// --- Configuration for the backend API ---
// Make sure this port matches your backend server's port
const API_BASE_URL = "http://localhost:8888/api/v1/analyze";
const POLLING_INTERVAL = 3000; // Check status every 3 seconds

const CodeReview = () => {
  const [code, setCode] = useState("");
  const [reviewScore, setReviewScore] = useState(0);
  const [suggestions, setSuggestions] = useState([]);
  const [improvedCode, setImprovedCode] = useState("");
  const [popupMessage, setPopupMessage] = useState("");
  const [popupType, setPopupType] = useState(""); // "error" | "success"
  const [isLoading, setIsLoading] = useState(false);

  // useRef is used to store the interval ID so we can clear it
  const pollingIntervalRef = useRef(null);

  /**
   * Clears any active polling interval.
   */
  const stopPolling = () => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
  };

  /**
   * Polls the backend for the analysis status using the jobId.
   * @param {string} jobId - The ID of the analysis job to check.
   */
  const pollForStatus = (jobId) => {
    pollingIntervalRef.current = setInterval(async () => {
      try {
        const statusResponse = await axios.get(
          `${API_BASE_URL}/status/${jobId}`
        );
        const { status, result } = statusResponse.data;

        if (status === "complete") {
          stopPolling();
          // Map backend response fields to frontend state variables
          setReviewScore(result.qualityScore);
          setSuggestions(result.improvementPoints);
          setImprovedCode(result.improvedCode);
          setIsLoading(false);
        } else if (status === "error") {
          stopPolling();
          setPopupType("error");
          setPopupMessage(
            result.message || "An error occurred during analysis."
          );
          setIsLoading(false);
        }
        // If status is "pending", do nothing and let the interval run again.
      } catch (error) {
        stopPolling();
        console.error("Error polling for status:", error);
        setPopupType("error");
        setPopupMessage(
          "Could not get analysis status. Please check the server."
        );
        setIsLoading(false);
      }
    }, POLLING_INTERVAL);
  };

  /**
   * Main function to initiate the code review process.
   */
  const reviewCode = async () => {
    if (!code.trim()) {
      setPopupType("error");
      setPopupMessage("Please paste some code before review.");
      return;
    }

    setIsLoading(true);
    setReviewScore(0);
    setSuggestions([]);
    setImprovedCode("");
    setPopupMessage("");
    stopPolling(); // Stop any previous polling

    try {
      // Step 1: Start the analysis and get a job ID.
      const initialResponse = await axios.post(API_BASE_URL, { code });
      const { jobId } = initialResponse.data;

      if (jobId) {
        // Step 2: Start polling for the result using the job ID.
        pollForStatus(jobId);
      } else {
        throw new Error("Did not receive a valid Job ID.");
      }
    } catch (error) {
      console.error("Error initiating code review:", error);
      setPopupType("error");
      setPopupMessage(
        "Failed to start review. Please check if the backend server is running and CORS is enabled."
      );
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!improvedCode) {
      setPopupType("error");
      setPopupMessage("No code to copy yet.");
      return;
    }
    navigator.clipboard.writeText(improvedCode);
    setPopupType("success");
    setPopupMessage("✅ Reviewed code copied to clipboard!");
  };

  // --- JSX (Styling) is completely unchanged from your original code ---
  return (
    <motion.div
      className="bg-[#0f0425] min-h-screen px-6 md:px-12 py-12 flex flex-col"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.6 }}
    >
      <h1 className="text-3xl font-bold text-white mb-6 text-center">
        📝 AI Code Reviewer
      </h1>

      <div className="flex flex-col md:flex-row gap-6 flex-1">
        <div className="flex-1 flex flex-col bg-[#1a103d] rounded-2xl shadow-lg p-4">
          <h2 className="text-lg font-semibold text-pink-400 mb-2">
            Paste Your Code
          </h2>
          <textarea
            className="flex-1 bg-[#0f0425] text-white rounded-xl p-4 font-mono resize-none outline-none"
            placeholder="// Paste your code here..."
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <button
            onClick={reviewCode}
            disabled={isLoading}
            className="mt-4 bg-gradient-to-r from-indigo-500 to-pink-500 text-white px-6 py-2 rounded-full font-semibold transition-transform duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Analyzing..." : "Review Code"}
          </button>
        </div>

        <div className="flex-1 flex flex-col bg-[#1a103d] rounded-2xl shadow-lg p-4">
          <h2 className="text-lg font-semibold text-pink-400 mb-4">
            Review Summary
          </h2>
          <div className="mb-4">
            <h3 className="text-white font-medium mb-2">Code Quality Score:</h3>
            <div className="w-full bg-gray-700 rounded-full h-4">
              <div
                className="h-4 rounded-full bg-gradient-to-r from-green-400 to-green-600 transition-all"
                style={{ width: `${reviewScore}%` }}
              ></div>
            </div>
            <p className="text-gray-300 mt-2">
              {reviewScore ? `${reviewScore}%` : "Not reviewed yet."}
            </p>
          </div>
          <div className="mb-4">
            <h3 className="text-white font-medium mb-2">
              Suggestions for Improvement:
            </h3>
            {suggestions.length > 0 ? (
              <ul className="list-disc list-inside text-yellow-300 space-y-1">
                {suggestions.map((s, idx) => (
                  <li key={idx}>
                    {s.point} (Line: {s.line})
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-400">No suggestions yet.</p>
            )}
          </div>
          <div className="flex-1 bg-[#0f0425] rounded-xl p-4 overflow-auto relative">
            <pre className="text-green-400 font-mono whitespace-pre-wrap">
              {improvedCode || "// Improved code will appear here..."}
            </pre>
            {improvedCode && (
              <button
                onClick={copyToClipboard}
                className="absolute top-2 right-2 bg-pink-500 text-white px-3 py-1 rounded-lg flex items-center gap-2 text-sm hover:bg-pink-600"
              >
                <Copy size={16} /> Copy
              </button>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {popupMessage && (
          <motion.div
            key="popup"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
            onClick={() => setPopupMessage("")}
          >
            <div
              className={`p-6 rounded-2xl shadow-2xl max-w-md w-[92%] text-center border ${
                popupType === "error"
                  ? "bg-[#1a103d] border-pink-500 text-white"
                  : "bg-green-900 border-green-400 text-white"
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              <h2
                className={`text-2xl font-bold mb-3 ${
                  popupType === "error" ? "text-pink-400" : "text-green-300"
                }`}
              >
                {popupType === "error" ? "🚫 Oops!" : "✅ Success!"}
              </h2>
              <p className="text-gray-300 mb-6">{popupMessage}</p>
              <button
                onClick={() => setPopupMessage("")}
                className={`px-6 py-2 rounded-lg font-semibold hover:scale-105 transition-transform ${
                  popupType === "error"
                    ? "bg-gradient-to-r from-pink-500 to-indigo-500"
                    : "bg-gradient-to-r from-green-500 to-emerald-500"
                }`}
              >
                Got it 👍
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default CodeReview;
