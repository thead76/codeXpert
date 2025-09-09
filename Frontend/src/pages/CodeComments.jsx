import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy } from "lucide-react";

const CodeComments = () => {
  const [code, setCode] = useState("");
  const [commentedCode, setCommentedCode] = useState("");
  const [popupMessage, setPopupMessage] = useState("");
  const [popupType, setPopupType] = useState(""); // "error" | "success"

  // Dummy function (replace with backend later)
  const generateComments = () => {
    if (!code.trim()) {
      setPopupType("error");
      setPopupMessage("Please paste some code before generating comments.");
      return;
    }

    // Mock Example
    setCommentedCode(
`// Function to greet the user
function greetUser(name) {
  // If no name is provided, greet as Guest
  if (!name) {
    console.log("Hello, Guest!");
  } else {
    // Otherwise, greet with their actual name
    console.log(\`Hello, \${name}!\`);
  }
}`
    );
  };

  const copyToClipboard = () => {
    if (!commentedCode) {
      setPopupType("error");
      setPopupMessage("No commented code to copy yet.");
      return;
    }
    navigator.clipboard.writeText(commentedCode);
    setPopupType("success");
    setPopupMessage("✅ Commented code copied to clipboard!");
  };

  return (
    <motion.div
      className="bg-[#0f0425] min-h-screen px-6 md:px-12 py-12 flex flex-col"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.6 }}
    >
      {/* Heading */}
      <h1 className="text-3xl font-bold text-white mb-6 text-center">
        💬 Code Comments
      </h1>

      <div className="flex flex-col md:flex-row gap-6 flex-1">
        {/* Left: Code Editor */}
        <div className="flex-1 flex flex-col bg-[#1a103d] rounded-2xl shadow-lg p-4">
          <h2 className="text-lg font-semibold text-pink-400 mb-2">Paste Your Code</h2>
          <textarea
            className="flex-1 bg-[#0f0425] text-white rounded-xl p-4 font-mono resize-none outline-none"
            placeholder="// Paste your code here..."
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <button
            onClick={generateComments}
            className="mt-4 bg-gradient-to-r from-indigo-500 to-pink-500 text-white px-6 py-2 rounded-full font-semibold transition-transform duration-300 hover:scale-105"
          >
            Generate Comments
          </button>
        </div>

        {/* Right: Commented Code */}
        <div className="flex-1 flex flex-col bg-[#1a103d] rounded-2xl shadow-lg p-4">
          <h2 className="text-lg font-semibold text-pink-400 mb-2">Commented Code</h2>
          <div className="flex-1 bg-[#0f0425] rounded-xl p-4 overflow-auto relative">
            <pre className="text-green-400 font-mono whitespace-pre-wrap">
              {commentedCode || "// Commented code will appear here..."}
            </pre>
            {commentedCode && (
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

      {/* Popup */}
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

export default CodeComments;
