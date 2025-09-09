import { motion } from "framer-motion";
import heroImage from "../assets/hero.webp";
import ChatBot from "../components/ChatBot";

const Home = () => {
  return (
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
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
            AI Agent Platform for <br />
            <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent font-extrabold">
              Software Development
            </span>{" "}
            Teams
          </h1>
          <p className="text-gray-300 text-lg mb-6">
            Transform software development with codeXpert’s Agentic AI Platform...
          </p>

          <div className="flex flex-wrap gap-4">
            {/* Primary Button */}
            <button className="bg-gradient-to-r from-indigo-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold transition-transform duration-300 hover:scale-105 hover:bg-transparent hover:border-2 hover:border-pink-500">
              Create Your Free Account
            </button>

            {/* Outline Button */}
            <button className="border-2 border-pink-500 text-pink-500 px-6 py-3 rounded-full font-semibold transition-transform duration-300 hover:scale-105 hover:bg-pink-500 hover:text-white">
              Request a Demo
            </button>
          </div>
        </div>

        {/* Right Image */}
        <div className="flex-1 flex justify-center min-w-[300px]">
          <img
            src={heroImage}
            alt="Code preview"
            className="max-w-full rounded-xl"
          />
        </div>
      </div>

      {/* Middle Heading */}
      <div className="w-full mt-28 flex justify-center">
        <div className="text-white text-2xl md:text-2xl font-semibold bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-2 rounded-full inline-block">
          An AI that masters your codebase
        </div>
      </div>

      {/* Feature Section */}
      <section className="w-full max-w-6xl mt-20 px-4 text-white">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-2">
            Empower Your Team
          </h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Manage projects, collaborate effectively, and track team progress — all in one place.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-[#1a103d] p-8 rounded-xl text-center shadow-lg transition-transform duration-300 hover:-translate-y-2 hover:bg-gradient-to-r hover:from-indigo-500 hover:to-pink-500">
            👥
            <h3 className="text-xl font-semibold mt-4 mb-2">Create Teams</h3>
            <p className="text-gray-300">Form and organize project-specific teams with ease.</p>
          </div>

          <div className="bg-[#1a103d] p-8 rounded-xl text-center shadow-lg transition-transform duration-300 hover:-translate-y-2 hover:bg-gradient-to-r hover:from-indigo-500 hover:to-pink-500">
            🤝
            <h3 className="text-xl font-semibold mt-4 mb-2">Work Together</h3>
            <p className="text-gray-300">Collaborate with team members in real-time across tasks.</p>
          </div>

          <div className="bg-[#1a103d] p-8 rounded-xl text-center shadow-lg transition-transform duration-300 hover:-translate-y-2 hover:bg-gradient-to-r hover:from-indigo-500 hover:to-pink-500">
            🧑‍💼
            <h3 className="text-xl font-semibold mt-4 mb-2">Task Assignment</h3>
            <p className="text-gray-300">Team leaders can assign tasks and monitor progress instantly.</p>
          </div>

          <div className="bg-[#1a103d] p-8 rounded-xl text-center shadow-lg transition-transform duration-300 hover:-translate-y-2 hover:bg-gradient-to-r hover:from-indigo-500 hover:to-pink-500">
            📋
            <h3 className="text-xl font-semibold mt-4 mb-2">Track Progress</h3>
            <p className="text-gray-300">Employees view pending and completed tasks in one dashboard.</p>
          </div>

          <div className="bg-[#1a103d] p-8 rounded-xl text-center shadow-lg transition-transform duration-300 hover:-translate-y-2 hover:bg-gradient-to-r hover:from-indigo-500 hover:to-pink-500">
            📁
            <h3 className="text-xl font-semibold mt-4 mb-2">Project Insights</h3>
            <p className="text-gray-300">See who assigned what in each project and choose to accept or decline.</p>
          </div>

          <div className="bg-[#1a103d] p-8 rounded-xl text-center shadow-lg transition-transform duration-300 hover:-translate-y-2 hover:bg-gradient-to-r hover:from-indigo-500 hover:to-pink-500">
            🧩
            <h3 className="text-xl font-semibold mt-4 mb-2">Multi-Project Management</h3>
            <p className="text-gray-300">Leaders can handle multiple teams and projects efficiently.</p>
          </div>
        </div>
      </section>
      <ChatBot />
    </motion.div>
  );
};

export default Home;
