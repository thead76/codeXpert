import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Send, X } from "lucide-react";

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      from: "bot",
      text: "Hi! I'm your AI assistant. How can I help you? Feel free to ask a question or select one below.",
    },
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const faqs = [
    {
      question: "What is CodeXpert?",
      answer:
        "CodeXpert is a platform designed to help developers improve their coding skills by providing AI-powered tools for code analysis, bug detection, and more.",
    },
    {
      question: "How do I get started?",
      answer:
        "To get started, simply sign up for an account, and you can start using our features right away. Check out the dashboard for all the available tools.",
    },
    {
      question: "How do I create a team?",
      answer:
        "To create a team, go to your dashboard and click on the 'My Team' section. From there, you'll see an option to 'Create a New Team'. You can then invite members to join.",
    },
    {
      question: "How do I assign a task?",
      answer:
        "As a team admin or manager, you can assign tasks from the 'Team Dashboard'. Select a team, go to the 'Tasks' tab, and click 'Assign Task'.",
    },
  ];

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { from: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    // Artificial delay to simulate thinking
    setTimeout(async () => {
      // First, check if the input matches a predefined FAQ for an instant answer
      const faq = faqs.find(
        (f) => f.question.toLowerCase() === input.toLowerCase()
      );
      if (faq) {
        setMessages((prev) => [...prev, { from: "bot", text: faq.answer }]);
        return;
      }

      // If not an FAQ, call the backend
      try {
        const response = await fetch("/api/v1/ai/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: input }),
        });
        const data = await response.json();
        setMessages((prev) => [...prev, { from: "bot", text: data.reply }]);
      } catch (error) {
        setMessages((prev) => [
          ...prev,
          {
            from: "bot",
            text: "Sorry, I'm having trouble connecting. Please try again later.",
          },
        ]);
      }
    }, 800);
  };

  return (
    <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50">
      {!isOpen && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="bg-gradient-to-r from-pink-500 to-indigo-500 text-white p-4 rounded-full shadow-lg hover:scale-110 transition-transform"
          onClick={() => setIsOpen(true)}
        >
          <Bot size={28} />
        </motion.button>
      )}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="chatbox"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="w-[90vw] h-[75vh] md:w-96 md:h-[600px] bg-[#0f0425] text-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border-2 border-indigo-500/50"
          >
            <div className="bg-gradient-to-r from-indigo-500 to-pink-500 px-4 py-3 flex justify-between items-center">
              <h2 className="font-bold text-lg">CodeXpert Assistant</h2>
              <button
                className="hover:scale-110 transition-transform p-1 rounded-full hover:bg-white/10"
                onClick={() => setIsOpen(false)}
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex items-end gap-2 ${
                    msg.from === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {msg.from === "bot" && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-pink-500 to-indigo-500 flex items-center justify-center flex-shrink-0">
                      <Bot size={20} />
                    </div>
                  )}
                  <div
                    className={`p-3 rounded-2xl max-w-xs md:max-w-md break-words ${
                      msg.from === "user"
                        ? "bg-pink-500 text-white rounded-br-none"
                        : "bg-[#1a103d] text-gray-200 rounded-bl-none"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t border-indigo-500/30">
              <div className="flex flex-wrap gap-2 mb-3">
                {faqs.map((faq, idx) => (
                  <button
                    key={idx}
                    onClick={() => setInput(faq.question)}
                    className="text-xs bg-[#1a103d] text-gray-300 rounded-full px-3 py-1.5 hover:bg-pink-500 hover:text-white transition-colors border border-indigo-500/50"
                  >
                    {faq.question}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ask a question..."
                  className="flex-1 px-4 py-2 rounded-full bg-[#1a103d] text-white outline-none focus:ring-2 focus:ring-pink-500 border border-indigo-500/50"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                />
                <button
                  onClick={sendMessage}
                  className="bg-gradient-to-r from-pink-500 to-indigo-500 w-10 h-10 flex items-center justify-center rounded-full hover:scale-105 transition-transform"
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatBot;
