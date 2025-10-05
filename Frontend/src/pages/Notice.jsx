import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { PlusCircle, Loader, Megaphone, Bell, Users, Code } from "lucide-react";
import NoticeCard from "../components/NoticeCard";
import PostNoticeModal from "../components/PostNoticeModal";

// --- DUMMY DATA ---
const dummyNotices = [
  {
    _id: "notice1",
    title: "Project Phoenix Kick-off Meeting",
    author: "Aditya Kumar",
    date: "2025-10-05T10:00:00Z",
    priority: "High",
    category: "Project Phoenix",
    content:
      "All members of Project Phoenix are required to attend the kick-off meeting this Friday at 11:00 AM. We will discuss the project timeline, key deliverables, and individual responsibilities. Please come prepared with your initial thoughts.",
  },
  {
    _id: "notice2",
    title: "New CI/CD Pipeline Deployed",
    author: "Riya Singh",
    date: "2025-10-04T15:30:00Z",
    priority: "Medium",
    category: "Updates",
    content:
      "The new CI/CD pipeline for the main repository has been successfully deployed. Please ensure all new commits are pushed to feature branches to trigger the automated build and test process. Report any issues to the DevOps channel.",
  },
  {
    _id: "notice3",
    title: "General Code of Conduct Reminder",
    author: "Admin",
    date: "2025-10-01T09:00:00Z",
    priority: "Low",
    category: "General",
    content:
      "This is a general reminder to maintain a professional and respectful environment in all team communications. Please review the company's code of conduct document available on the intranet.",
  },
];
// --- END DUMMY DATA ---

const Notice = () => {
  const { user } = useAuth();
  const [notices, setNotices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showPostModal, setShowPostModal] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All");

  useEffect(() => {
    setTimeout(() => {
      setNotices(dummyNotices);
      setIsLoading(false);
    }, 500);
  }, []);

  const filteredNotices = notices.filter(
    (notice) => activeFilter === "All" || notice.category === activeFilter
  );

  const FilterItem = ({ icon, label, count }) => (
    <button
      onClick={() => setActiveFilter(label)}
      className={`w-full flex justify-between items-center px-4 py-3 rounded-lg text-left transition ${
        activeFilter === label
          ? "bg-pink-500/20 text-white"
          : "hover:bg-white/5"
      }`}
    >
      <div className="flex items-center gap-3">
        {icon}
        <span className="font-semibold">{label}</span>
      </div>
      <span className="bg-[#2a1f52] text-xs font-bold px-2 py-1 rounded-full">
        {count}
      </span>
    </button>
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96 text-white">
        <Loader className="animate-spin mr-3" size={32} />
        Loading notices...
      </div>
    );
  }

  return (
    <div
      className="container mx-auto px-4 md:px-8 py-8 text-white"
      style={{ fontFamily: "Orbitron, sans-serif" }}
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-bold font-orbitron">Notice Board</h1>
          <p className="text-gray-400 mt-1">
            Stay updated with the latest announcements and team news.
          </p>
        </div>
        {user?.role === "leader" && (
          <button
            onClick={() => setShowPostModal(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-indigo-500 py-3 px-6 rounded-lg font-semibold hover:scale-105 transition-transform shadow-lg shadow-pink-500/20"
          >
            <PlusCircle size={20} />
            Post a New Notice
          </button>
        )}
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Sidebar - Filters */}
        <aside className="lg:col-span-1 bg-[#1a103d]/50 border border-pink-500/30 rounded-2xl p-4 self-start">
          <h2 className="font-bold text-lg mb-4 px-2">Categories</h2>
          <div className="space-y-2">
            <FilterItem
              icon={<Megaphone size={20} className="text-cyan-400" />}
              label="All"
              count={notices.length}
            />
            <FilterItem
              icon={<Bell size={20} className="text-yellow-400" />}
              label="General"
              count={notices.filter((n) => n.category === "General").length}
            />
            <FilterItem
              icon={<Users size={20} className="text-green-400" />}
              label="Updates"
              count={notices.filter((n) => n.category === "Updates").length}
            />
            <FilterItem
              icon={<Code size={20} className="text-pink-400" />}
              label="Project Phoenix"
              count={
                notices.filter((n) => n.category === "Project Phoenix").length
              }
            />
          </div>
        </aside>

        {/* Right Content - Notice Feed */}
        <main className="lg:col-span-3">
          <div className="space-y-6">
            {filteredNotices.length > 0 ? (
              filteredNotices.map((notice) => (
                <NoticeCard key={notice._id} notice={notice} />
              ))
            ) : (
              <div className="text-center py-24 text-gray-500">
                <Megaphone size={48} className="mx-auto mb-4" />
                <p>No notices found in this category.</p>
              </div>
            )}
          </div>
        </main>
      </div>

      <PostNoticeModal
        isOpen={showPostModal}
        onClose={() => setShowPostModal(false)}
        onNoticePosted={(newNotice) => setNotices([newNotice, ...notices])}
      />
    </div>
  );
};

export default Notice;
