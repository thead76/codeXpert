import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Copy,
  Loader,
  CheckCircle,
  AlertTriangle,
  X,
  ClipboardPaste,
  Bug,
} from "lucide-react";
import axios from "axios";

// --- Configuration ---
// const API_BASE_URL = "http://localhost:8888/api/v1/ai/bugs";
// --- Configuration ---
const API_BASE_URL = `${import.meta.env.VITE_API_URL}/ai/bugs`;


const BugFinder = () => {
  const [code, setCode] = useState("");
  const [fixedCode, setFixedCode] = useState("");
  const [mistakes, setMistakes] = useState([]);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupType, setPopupType] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const popupTimeoutRef = useRef(null);

  // Automatically hide the popup after 3 seconds
  useEffect(() => {
    return () => {
      if (popupTimeoutRef.current) {
        clearTimeout(popupTimeoutRef.current);
      }
    };
  }, []);

  const showPopup = (message, type) => {
    if (popupTimeoutRef.current) {
      clearTimeout(popupTimeoutRef.current);
    }
    setPopupMessage(message);
    setPopupType(type);
    popupTimeoutRef.current = setTimeout(() => {
      setPopupMessage("");
    }, 3000);
  };

  // Analyze code for bugs by calling the backend API
  const analyzeCode = async () => {
    if (!code.trim()) {
      showPopup("Please paste some code before analyzing.", "error");
      return;
    }

    setIsLoading(true);
    setMistakes([]);
    setFixedCode("");
    setPopupMessage("");

    try {
      const response = await axios.post(API_BASE_URL, { code });
      setMistakes(response.data.mistakes || []);
      setFixedCode(response.data.fixedCode || "");
    } catch (error) {
      console.error(error);
      showPopup(
        error.response?.data?.message || "Something went wrong.",
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Paste code from clipboard
  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setCode(text);
      showPopup("Code pasted from clipboard!", "success");
    } catch (error) {
      console.error("Failed to paste from clipboard:", error);
      showPopup("Could not read from clipboard.", "error");
    }
  };

  // Copy the fixed code to the clipboard
  const copyToClipboard = () => {
    if (!fixedCode) {
      showPopup("No fixed code to copy yet.", "error");
      return;
    }
    navigator.clipboard.writeText(fixedCode);
    showPopup("Fixed code copied to clipboard!", "success");
  };

  return (
    <div className="min-h-screen text-white pt-10 "  >
      <motion.div
        className="container mx-auto px-4 md:px-8 py-8"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -30 }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold font-orbitron">AI Bug Finder</h1>
          <p className="text-gray-400 mt-2">
            Find and fix bugs in your code with the power of AI.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Panel */}
          <div className="bg-[#1a103d]/50 border border-pink-500/30 rounded-2xl p-6 flex flex-col shadow-lg h-[70vh]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-pink-400 font-orbitron">
                Your Code
              </h2>
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
              placeholder="// Paste your code with potential bugs here..."
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
            <button
              onClick={analyzeCode}
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
                  <Bug size={20} />
                  Analyze Code
                </>
              )}
            </button>
          </div>

          {/* Output Panel */}
          <div className="bg-[#1a103d]/50 border border-cyan-500/30 rounded-2xl p-6 flex flex-col shadow-lg h-[70vh] space-y-6">
            <div>
              <h3 className="font-semibold text-cyan-400 mb-2 font-orbitron">
                Detected Issues
              </h3>
              <div className="max-h-40 overflow-y-auto pr-2">
                {mistakes.length > 0 ? (
                  <ul className="space-y-2">
                    {mistakes.map((err, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-sm">
                        <AlertTriangle
                          size={16}
                          className="text-red-400 mt-0.5 flex-shrink-0"
                        />
                        <span>{err}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 text-sm">
                    No issues detected yet.
                  </p>
                )}
              </div>
            </div>

            <div className="flex-1 flex flex-col min-h-[200px]">
              <h3 className="font-semibold text-cyan-400 mb-2 font-orbitron">
                Corrected Code
              </h3>
              <div className="flex-1 bg-[#0f0425] rounded-xl p-4 overflow-auto relative">
                <pre className="text-green-400 font-mono whitespace-pre-wrap text-sm">
                  {fixedCode || "// Corrected code will appear here..."}
                </pre>
                {fixedCode && (
                  <button
                    onClick={copyToClipboard}
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

export default BugFinder;
