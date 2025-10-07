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

const COLORS = {
  High: "#f87171", // red-400
  Medium: "#fbbf24", // amber-400
  Low: "#4ade80", // green-400
};

const PriorityPieChart = ({ data }) => {
  const chartData = [
    { name: "High Priority", value: data.High },
    { name: "Medium Priority", value: data.Medium },
    { name: "Low Priority", value: data.Low },
  ].filter((entry) => entry.value > 0);

  if (chartData.length === 0) {
    return (
      <p className="text-gray-400 text-center mt-8">
        No completed tasks with priority data.
      </p>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={250}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          nameKey="name"
          label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
        >
          {chartData.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={COLORS[entry.name.split(" ")[0]]}
            />
          ))}
        </Pie>
        {/* --- YAHAN BADLAAV KIYA GAYA HAI --- */}
        <Tooltip content={<CustomTooltip />} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default PriorityPieChart;
