import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
// --- FIX: Added 'Users' and 'Star' to the import list ---
import {
  Loader,
  BarChart2,
  Calendar,
  CheckCircle,
  Zap,
  Users,
  Star,
} from "lucide-react";
import StatsCard from "../components/StatsCard";
import ReportChart from "../components/ReportChart";
import DatePicker from "react-datepicker";

// --- DUMMY DATA ---
const dummyLeaderData = {
  daily: { tasksCompleted: 8, efficiency: 92, membersActive: 5 },
  weekly: { tasksCompleted: 45, efficiency: 88, membersActive: 6 },
  monthly: { tasksCompleted: 180, efficiency: 90, membersActive: 6 },
  yearly: { tasksCompleted: 2100, efficiency: 85, membersActive: 6 },
};

const dummyMemberData = {
  daily: { tasksCompleted: 2, progress: 100, rank: 3 },
  weekly: { tasksCompleted: 10, progress: 95, rank: 2 },
  monthly: { tasksCompleted: 42, progress: 98, rank: 1 },
  yearly: { tasksCompleted: 500, progress: 97, rank: 1 },
};
// --- END DUMMY DATA ---

const Report = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState("weekly"); // 'daily', 'weekly', 'monthly', 'yearly'
  const [startDate, setStartDate] = useState(new Date());
  const [stats, setStats] = useState({});

  useEffect(() => {
    // Simulate fetching data
    setTimeout(() => {
      if (user) {
        setStats(
          user.role === "leader"
            ? dummyLeaderData[filter]
            : dummyMemberData[filter]
        );
        setIsLoading(false);
      }
    }, 500);
  }, [user, filter]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96 text-white">
        <Loader className="animate-spin mr-3" size={32} />
        Loading reports...
      </div>
    );
  }

  const FilterButton = ({ period, label }) => (
    <button
      onClick={() => setFilter(period)}
      className={`px-4 py-2 rounded-lg font-semibold transition ${
        filter === period
          ? "bg-gradient-to-r from-pink-500 to-indigo-500 text-white"
          : "bg-[#2a1f52] hover:bg-[#3a2f62]"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div
      className="container mx-auto px-4 md:px-8 py-8 text-white"
      style={{ fontFamily: "Orbitron, sans-serif" }}
    >
      {/* Header and Filters */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-bold font-orbitron">
            Performance Report
          </h1>
          <p className="text-gray-400 mt-1">
            {user?.role === "leader"
              ? "Track your team's productivity and efficiency."
              : "Review your personal task completion and progress."}
          </p>
        </div>
        <div className="flex items-center gap-2 bg-[#1a103d]/80 border border-pink-500/30 p-2 rounded-xl">
          <FilterButton period="daily" label="Day" />
          <FilterButton period="weekly" label="Week" />
          <FilterButton period="monthly" label="Month" />
          <FilterButton period="yearly" label="Year" />
          <div className="relative">
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              customInput={
                <button className="p-2 bg-[#2a1f52] hover:bg-[#3a2f62] rounded-lg">
                  <Calendar size={20} />
                </button>
              }
            />
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {user?.role === "leader" ? (
          <>
            <StatsCard
              icon={<CheckCircle size={28} />}
              title="Tasks Completed"
              value={stats.tasksCompleted}
              unit=""
              color="green"
            />
            <StatsCard
              icon={<Zap size={28} />}
              title="Team Efficiency"
              value={stats.efficiency}
              unit="%"
              color="yellow"
            />
            <StatsCard
              icon={<Users size={28} />}
              title="Active Members"
              value={stats.membersActive}
              unit=""
              color="cyan"
            />
          </>
        ) : (
          <>
            <StatsCard
              icon={<CheckCircle size={28} />}
              title="Tasks Completed"
              value={stats.tasksCompleted}
              unit=""
              color="green"
            />
            <StatsCard
              icon={<BarChart2 size={28} />}
              title="Progress Rate"
              value={stats.progress}
              unit="%"
              color="yellow"
            />
            <StatsCard
              icon={<Star size={28} />}
              title="Team Rank"
              value={`#${stats.rank}`}
              unit=""
              color="cyan"
            />
          </>
        )}
      </div>

      {/* Main Chart */}
      <div className="bg-[#1a103d]/80 backdrop-blur-sm border border-pink-500/30 rounded-2xl p-6 shadow-lg">
        <h2 className="text-2xl font-bold font-orbitron mb-4">
          {user?.role === "leader" ? "Team Performance" : "My Performance"}
        </h2>
        <ReportChart filter={filter} userRole={user?.role} />
      </div>
    </div>
  );
};

export default Report;
