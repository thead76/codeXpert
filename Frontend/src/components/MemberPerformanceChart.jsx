import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import CustomTooltip from "./CustomTooltip"; // <-- Naya component import karein

const generateRandomColor = () =>
  `#${Math.floor(Math.random() * 16777215)
    .toString(16)
    .padStart(6, "0")}`;

const MemberPerformanceChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <p className="text-gray-400 text-center mt-8">
        No reviewed tasks to display performance.
      </p>
    );
  }

  const COLORS = data.map(() => generateRandomColor());

  return (
    <ResponsiveContainer width="100%" height={250}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="tasks"
          nameKey="name"
          label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        {/* --- YAHAN BADLAAV KIYA GAYA HAI --- */}
        <Tooltip content={<CustomTooltip />} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default MemberPerformanceChart;
