import React from "react";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0f0425] p-3 rounded-lg border border-pink-500/50 shadow-lg">
        <p className="text-sm text-cyan-400 font-semibold">{`${payload[0].name}`}</p>
        <p className="text-white mt-1">{`Tasks Completed: ${payload[0].value}`}</p>
      </div>
    );
  }

  return null;
};

export default CustomTooltip;
