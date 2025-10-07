import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import StatsCard from "../components/StatsCard";
import PriorityPieChart from "../components/PriorityPieChart";
import MonthlyTasksChart from "../components/MonthlyTasksChart";
import TaskHistoryTable from "../components/TaskHistoryTable";
import MemberPerformanceChart from "../components/MemberPerformanceChart"; // <-- Naya component import karein
import {
  Loader,
  BarChart2,
  PieChart,
  History,
  CheckCircle,
  Calendar,
  Users,
} from "lucide-react";
import { motion } from "framer-motion";
import DatePicker from "react-datepicker";
import {
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
} from "date-fns";

const Report = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [leaderStats, setLeaderStats] = useState(null); // Leader stats ke liye naya state
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState("This Month");
  const [startDate, setStartDate] = useState(startOfMonth(new Date()));
  const [endDate, setEndDate] = useState(endOfMonth(new Date()));

  useEffect(() => {
    const fetchAllStats = async () => {
      if (!startDate || !endDate) return;
      setLoading(true);
      try {
        const params = {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        };

        // Hamesha user ke personal stats fetch karein
        const userStatsPromise = axios.get("/reports/my-stats", { params });

        // Agar user leader hai, toh leader stats bhi fetch karein
        const leaderStatsPromise =
          user.role === "leader"
            ? axios.get("/reports/leader-stats", { params })
            : Promise.resolve(null);

        const [userStatsRes, leaderStatsRes] = await Promise.all([
          userStatsPromise,
          leaderStatsPromise,
        ]);

        setStats(userStatsRes.data);
        if (leaderStatsRes) {
          setLeaderStats(leaderStatsRes.data);
        }
      } catch (error) {
        console.error("Failed to fetch report data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAllStats();
  }, [startDate, endDate, user.role]);

  const handleFilterChange = (type) => {
    /* ... (Koi badlaav nahi) ... */
  };
  const FilterButton = ({ label }) => {
    /* ... (Koi badlaav nahi) ... */
  };

  if (loading && !stats) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader className="animate-spin" size={48} />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 text-white">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold font-orbitron">Work Report</h1>
        <p className="text-gray-400 mt-2">
          Analyze your performance and contributions.
        </p>
      </motion.div>

      {/* --- Filter Bar --- */}
      <motion.div /* ... */>{/* ... (Filter UI) ... */}</motion.div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader className="animate-spin" size={48} />
        </div>
      ) : (
        <>
          {/* --- LEADER-SPECIFIC SECTION --- */}
          {user.role === "leader" && leaderStats && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-2xl font-bold font-orbitron mt-8 mb-4 border-b-2 border-pink-500 pb-2">
                Leader's Overview
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <StatsCard
                  icon={<CheckCircle size={28} className="text-green-400" />}
                  title="Total Tasks Reviewed"
                  value={leaderStats.totalTasksReviewed}
                />
                <div className="bg-[#1a103d]/50 p-6 rounded-2xl border border-cyan-500/30">
                  <h3 className="font-bold font-orbitron text-xl mb-4 flex items-center gap-2">
                    <Users /> Member Performance
                  </h3>
                  <MemberPerformanceChart
                    data={leaderStats.memberPerformance}
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* --- PERSONAL STATS SECTION --- */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-2xl font-bold font-orbitron mt-8 mb-4 border-b-2 border-cyan-500 pb-2">
              My Personal Stats
            </h2>
            {!stats || stats.totalTasksCompleted === 0 ? (
              <div className="text-center py-16 bg-white/5 rounded-xl">
                <p className="text-gray-400">
                  No personal tasks completed in this period.
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <StatsCard
                    icon={<CheckCircle size={28} />}
                    title="My Completed Tasks"
                    value={stats.totalTasksCompleted}
                  />
                  <StatsCard
                    icon={<PieChart size={28} />}
                    title="My High Priority Tasks"
                    value={stats.priorityBreakdown.High}
                  />
                  <StatsCard
                    icon={<BarChart2 size={28} />}
                    title="My Medium Priority Tasks"
                    value={stats.priorityBreakdown.Medium}
                  />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mt-8">
                  <div className="lg:col-span-2 space-y-6">
                    <div className="bg-[#1a103d]/50 p-6 rounded-2xl border border-pink-500/30">
                      <h3 className="font-bold font-orbitron text-xl mb-4">
                        My Tasks by Priority
                      </h3>
                      <PriorityPieChart data={stats.priorityBreakdown} />
                    </div>
                  </div>
                  <div className="lg:col-span-3 bg-[#1a103d]/50 p-6 rounded-2xl border border-cyan-500/30">
                    <h3 className="font-bold font-orbitron text-2xl mb-4">
                      <History /> My Completed Tasks History
                    </h3>
                    <TaskHistoryTable tasks={stats.completedTasksHistory} />
                  </div>
                </div>
              </>
            )}
          </motion.div>
        </>
      )}
    </div>
  );
};

export default Report;
