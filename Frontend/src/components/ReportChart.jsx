import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// --- DUMMY DATA FOR CHARTS ---
const data = {
  daily: [{ name: "Today", tasks: 8, efficiency: 92 }],
  weekly: [
    { name: "Mon", tasks: 10 },
    { name: "Tue", tasks: 7 },
    { name: "Wed", tasks: 9 },
    { name: "Thu", tasks: 12 },
    { name: "Fri", tasks: 7 },
  ],
  monthly: [
    { name: "Week 1", tasks: 40 },
    { name: "Week 2", tasks: 55 },
    { name: "Week 3", tasks: 38 },
    { name: "Week 4", tasks: 47 },
  ],
  yearly: [
    { name: "Jan", tasks: 150 },
    { name: "Feb", tasks: 180 },
    { name: "Mar", tasks: 210 },
    { name: "Apr", tasks: 190 },
    { name: "May", tasks: 220 },
    { name: "Jun", tasks: 250 },
  ],
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1a103d]/80 backdrop-blur-sm border border-pink-500/50 p-3 rounded-lg text-white">
        <p className="font-semibold">{label}</p>
        <p className="text-cyan-400">{`Tasks: ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

const ReportChart = ({ filter, userRole }) => {
  const chartData = data[filter];
  // --- FIX: State to ensure client-side rendering ---
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // This effect runs only on the client, after the component has mounted.
    setIsClient(true);
  }, []);

  // --- FIX: Prevent rendering until the component is mounted on the client ---
  if (!isClient) {
    // Render nothing on the server or during the initial hydration.
    return null;
  }

  return (
    <div style={{ width: "100%", height: 300 }}>
      <ResponsiveContainer>
        <BarChart
          data={chartData}
          margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(255, 255, 255, 0.1)"
          />
          <XAxis dataKey="name" stroke="#888" />
          <YAxis stroke="#888" />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ fill: "rgba(219, 39, 119, 0.1)" }}
          />
          <Bar dataKey="tasks" fill="url(#colorUv)" />
          <defs>
            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#db2777" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.8} />
            </linearGradient>
          </defs>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ReportChart;
