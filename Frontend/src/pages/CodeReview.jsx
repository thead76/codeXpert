import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Copy,
  ScanLine,
  Loader,
  CheckCircle,
  AlertTriangle,
  Lightbulb,
  X,
  ClipboardPaste,
} from "lucide-react";
import axios from "axios";

// --- Configuration ---
// --- Configuration ---

const API_BASE_URL = `${import.meta.env.VITE_API_URL}/api/v1/ai`;
const POLLING_INTERVAL = 3000;

const CodeReview = () => {
  const [code, setCode] = useState("");
  const [reviewScore, setReviewScore] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [improvedCode, setImprovedCode] = useState("");
  const [popupMessage, setPopupMessage] = useState("");
  const [popupType, setPopupType] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const pollingIntervalRef = useRef(null);
  const popupTimeoutRef = useRef(null); // Ref to hold the timeout for the popup

  // --- NEW: useEffect to automatically hide the popup ---
  useEffect(() => {
    // Clear any existing timeout when the component unmounts or the message changes
    return () => {
      if (popupTimeoutRef.current) {
        clearTimeout(popupTimeoutRef.current);
      }
    };
  }, []);

  const showPopup = (message, type) => {
    // Clear any existing timeout before setting a new one
    if (popupTimeoutRef.current) {
      clearTimeout(popupTimeoutRef.current);
    }
    setPopupMessage(message);
    setPopupType(type);
    // Set a new timeout to clear the message after 3 seconds
    popupTimeoutRef.current = setTimeout(() => {
      setPopupMessage("");
    }, 3000);
  };

  const stopPolling = () => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
  };

  const pollForStatus = (jobId) => {
    pollingIntervalRef.current = setInterval(async () => {
      try {
        const statusResponse = await axios.get(
          `${API_BASE_URL}/status/${jobId}`
        );
        const { status, result } = statusResponse.data;

        if (status === "complete") {
          stopPolling();
          setReviewScore(result.qualityScore);
          setSuggestions(result.improvementPoints);
          setImprovedCode(result.improvedCode);
          setIsLoading(false);
        } else if (status === "error") {
          stopPolling();
          showPopup(
            result.message || "An error occurred during analysis.",
            "error"
          );
          setIsLoading(false);
        }
      } catch (error) {
        stopPolling();
        console.error("Error polling for status:", error);
        showPopup(
          "Could not get analysis status. Please check the server.",
          "error"
        );
        setIsLoading(false);
      }
    }, POLLING_INTERVAL);
  };

  const reviewCode = async () => {
    if (!code.trim()) {
      showPopup("Please paste some code before review.", "error");
      return;
    }
    setIsLoading(true);
    setReviewScore(null);
    setSuggestions([]);
    setImprovedCode("");
    setPopupMessage("");
    stopPolling();

    try {
      const initialResponse = await axios.post(API_BASE_URL, { code });
      const { jobId } = initialResponse.data;
      if (jobId) {
        pollForStatus(jobId);
      } else {
        throw new Error("Did not receive a valid Job ID.");
      }
    } catch (error) {
      console.error("Error initiating code review:", error);
      showPopup(
        "Failed to start review. Check backend server and CORS.",
        "error"
      );
      setIsLoading(false);
    }
  };

  // --- NEW: Function to handle pasting from clipboard ---
  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setCode(text);
      showPopup("Code pasted from clipboard!", "success");
    } catch (error) {
      console.error("Failed to paste from clipboard:", error);
      showPopup(
        "Could not read from clipboard. Please paste manually.",
        "error"
      );
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    showPopup("Reviewed code copied to clipboard!", "success");
  };

  return (
    <div className="min-h-screen text-white pt-10 font-serif">
      <motion.div
        className="container mx-auto px-4 md:px-8 py-8"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -30 }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold font-orbitron">AI Code Reviewer</h1>
          <p className="text-gray-400 mt-2">
            Get instant feedback, suggestions, and improved code.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Panel */}
          <div className="bg-[#1a103d]/50 border border-pink-500/30 rounded-2xl p-6 flex flex-col shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-pink-400 font-orbitron">
                Your Code
              </h2>
              {/* --- NEW: Paste Button --- */}
              <button
                onClick={handlePaste}
                className="flex items-center gap-2 text-sm bg-white/10 text-white px-3 py-1 rounded-lg hover:bg-white/20 transition"
              >
                <ClipboardPaste size={16} />
                Paste
              </button>
            </div>
            <textarea
              className="flex-1 bg-[#0f0425] text-white rounded-xl p-4 font-mono resize-none outline-none focus:ring-2 focus:ring-pink-500 transition"
              placeholder="// Paste your code here..."
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
            <button
              onClick={reviewCode}
              disabled={isLoading}
              className="mt-4 flex items-center justify-center gap-2 w-full bg-gradient-to-r from-indigo-500 to-pink-500 py-3 rounded-lg font-semibold hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
            >
              {isLoading ? (
                <>
                  <Loader className="animate-spin" size={20} />
                  Analyzing...
                </>
              ) : (
                <>
                  <ScanLine size={20} />
                  Review Code
                </>
              )}
            </button>
          </div>

          {/* Output Panel */}
          <div className="bg-[#1a103d]/50 border border-cyan-500/30 rounded-2xl p-6 flex flex-col shadow-lg space-y-6">
            <div>
              <h3 className="font-semibold text-cyan-400 mb-2 font-orbitron">
                Code Quality Score
              </h3>
              <div className="w-full bg-[#2a1f52] rounded-full h-3">
                <motion.div
                  className="h-3 rounded-full bg-gradient-to-r from-green-400 to-cyan-500"
                  initial={{ width: "0%" }}
                  animate={{ width: `${reviewScore || 0}%` }}
                  transition={{ duration: 0.8 }}
                />
              </div>
              <p className="text-right text-sm text-gray-300 mt-1">
                {reviewScore !== null
                  ? `${reviewScore}%`
                  : "Awaiting review..."}
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-cyan-400 mb-2 font-orbitron">
                Suggestions
              </h3>
              <div className="max-h-32 overflow-y-auto pr-2">
                {suggestions.length > 0 ? (
                  <ul className="space-y-2">
                    {suggestions.map((s, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-sm">
                        <Lightbulb
                          size={16}
                          className="text-yellow-400 mt-0.5 flex-shrink-0"
                        />
                        <span>
                          {s.point} (Line: {s.line})
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 text-sm">No suggestions yet.</p>
                )}
              </div>
            </div>

            <div className="flex-1 flex flex-col min-h-[200px]">
              <h3 className="font-semibold text-cyan-400 mb-2 font-orbitron">
                Improved Code
              </h3>
              <div className="flex-1 bg-[#0f0425] rounded-xl p-4 overflow-auto relative">
                <pre className="text-green-400 font-mono whitespace-pre-wrap text-sm">
                  {improvedCode || "// Optimized code will appear here..."}
                </pre>
                {improvedCode && (
                  <button
                    onClick={() => copyToClipboard(improvedCode)}
                    className="absolute top-3 right-3 bg-white/10 text-white p-2 rounded-lg hover:bg-white/20 transition"
                  >
                    <Copy size={16} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {popupMessage && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed top-8 left-1/2 -translate-x-1/2 z-50"
            >
              <div
                className={`flex items-center gap-3 p-4 rounded-xl shadow-2xl border ${
                  popupType === "error"
                    ? "bg-red-500/10 border-red-500/50 text-red-300"
                    : "bg-green-500/10 border-green-500/50 text-green-300"
                }`}
              >
                {popupType === "error" ? (
                  <AlertTriangle size={20} />
                ) : (
                  <CheckCircle size={20} />
                )}
                <span className="font-semibold">{popupMessage}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default CodeReview;
