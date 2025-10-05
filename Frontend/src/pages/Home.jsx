import React, { useState } from "react";
import { motion } from "framer-motion";
import { Navigate } from "react-router-dom"; // Import Navigate for redirection
import { useAuth } from "../context/AuthContext"; // Import useAuth to check login status
import heroImage from "../assets/hero.webp";
import ChatBot from "../components/ChatBot";
import AuthModal from "../components/AuthModal";
import {
  Users,
  Handshake,
  ClipboardCheck,
  BarChart,
  FileCode,
  FolderGit2,
  UserPlus,
  LogIn,
} from "lucide-react";

const Home = () => {
  const { token, loading } = useAuth(); // Get the user's token and loading state
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authType, setAuthType] = useState("login");

  const openModal = (type) => {
    setAuthType(type);
    setIsAuthModalOpen(true);
  };

  const FeatureCard = ({ icon, title, children }) => (
    <div className="bg-[#1a103d] p-8 rounded-2xl text-center shadow-lg transition-transform duration-300 hover:-translate-y-2 group">
      <div className="relative inline-block">
        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-pink-500 rounded-lg blur opacity-25 group-hover:opacity-100 transition duration-300"></div>
        <div className="relative bg-[#0f0425] p-4 rounded-lg">{icon}</div>
      </div>
      <h3 className="text-xl font-bold mt-6 mb-2 font-orbitron">{title}</h3>
      <p className="text-gray-400">{children}</p>
    </div>
  );

  // --- FIX: Logic to handle redirection ---
  // While the auth status is being checked, show nothing to prevent flicker
  if (loading) {
    return null;
  }

  // If a token exists (user is logged in), redirect to the /my-team page
  if (token) {
    return <Navigate to="/my-team" replace />;
  }
  // --- END FIX ---

  // If there is no token (user is logged out), show the regular Home page
  return (
    <div style={{ fontFamily: "Orbitron, sans-serif" }}>
      <motion.div
        className="bg-[#0f0425] min-h-screen px-6 md:px-12 py-16 flex flex-col items-center"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -30 }}
        transition={{ duration: 0.6 }}
      >
        {/* Hero Section */}
        <div className="flex flex-wrap gap-12 justify-between max-w-6xl w-full">
          {/* Left Text */}
          <div className="flex-1 text-white min-w-[300px]">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4 font-orbitron">
              AI Agent Platform for <br />
              <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent font-extrabold">
                Software Development
              </span>{" "}
              Teams
            </h1>
            <p className="text-gray-300 text-lg mb-6">
              Transform software development with codeXpert’s Agentic AI
              Platform...
            </p>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => openModal("signup")}
                className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold transition-transform duration-300 hover:scale-105"
              >
                <UserPlus size={18} />
                Create Free Account
              </button>
              <button
                onClick={() => openModal("login")}
                className="flex items-center gap-2 border-2 border-pink-500 text-pink-500 px-6 py-3 rounded-full font-semibold transition-transform duration-300 hover:scale-105 hover:bg-pink-500 hover:text-white"
              >
                <LogIn size={18} />
                Login
              </button>
            </div>
          </div>
          {/* Right Image */}
          <div className="flex-1 flex justify-center min-w-[300px]">
            <motion.img
              src={heroImage}
              alt="Code preview"
              className="max-w-full rounded-xl shadow-2xl shadow-indigo-500/20"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Middle Heading */}
        <div className="w-full mt-28 flex justify-center">
          <div className="text-white text-2xl md:text-2xl font-semibold bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-2 rounded-full inline-block font-orbitron">
            An AI that masters your codebase
          </div>
        </div>

        {/* Feature Section */}
        <section className="w-full max-w-6xl mt-20 px-4 text-white">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-2 font-orbitron">
              Empower Your Team
            </h2>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Manage projects, collaborate effectively, and track team progress
              — all in one place.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Users size={28} className="text-cyan-400" />}
              title="Create Teams"
            >
              Form and organize project-specific teams with ease.
            </FeatureCard>
            <FeatureCard
              icon={<Handshake size={28} className="text-green-400" />}
              title="Work Together"
            >
              Collaborate with team members in real-time across tasks.
            </FeatureCard>
            <FeatureCard
              icon={<ClipboardCheck size={28} className="text-yellow-400" />}
              title="Task Assignment"
            >
              Team leaders can assign tasks and monitor progress instantly.
            </FeatureCard>
            <FeatureCard
              icon={<BarChart size={28} className="text-purple-400" />}
              title="Track Progress"
            >
              Employees view pending and completed tasks in one dashboard.
            </FeatureCard>
            <FeatureCard
              icon={<FileCode size={28} className="text-orange-400" />}
              title="Project Insights"
            >
              See who assigned what and choose to accept or decline.
            </FeatureCard>
            <FeatureCard
              icon={<FolderGit2 size={28} className="text-red-400" />}
              title="Multi-Project Management"
            >
              Leaders can handle multiple teams and projects efficiently.
            </FeatureCard>
          </div>
        </section>
        <ChatBot />
      </motion.div>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        type={authType}
      />
    </div>
  );
};

export default Home;
