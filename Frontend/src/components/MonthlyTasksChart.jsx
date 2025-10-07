import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const MonthlyTasksChart = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={data}
        margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
        <XAxis dataKey="name" stroke="#9ca3af" />
        <YAxis allowDecimals={false} stroke="#9ca3af" />
        <Tooltip
          cursor={{ fill: "#ffffff10" }}
          contentStyle={{
            background: "#1a103d",
            border: "1px solid #a21caf",
            borderRadius: "0.5rem",
          }}
        />
        <Legend />
        <Bar dataKey="tasks" fill="#22d3ee" name="Tasks Completed" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default MonthlyTasksChart;
