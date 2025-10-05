import React from "react";
import { motion } from "framer-motion";

const StatsCard = ({ icon, title, value, unit, color }) => {
  const colorClasses = {
    green: "from-green-500/20 to-green-500/5",
    yellow: "from-yellow-500/20 to-yellow-500/5",
    cyan: "from-cyan-500/20 to-cyan-500/5",
  };

  const iconColorClasses = {
    green: "text-green-400",
    yellow: "text-yellow-400",
    cyan: "text-cyan-400",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`bg-gradient-to-br ${colorClasses[color]} border border-white/10 rounded-2xl p-6 flex items-center gap-6`}
    >
      <div className={`p-3 rounded-full bg-white/5 ${iconColorClasses[color]}`}>
        {icon}
      </div>
      <div>
        <p className="text-gray-400 text-sm">{title}</p>
        <p className="text-3xl font-bold font-orbitron">
          {value}
          <span className="text-xl text-gray-400">{unit}</span>
        </p>
      </div>
    </motion.div>
  );
};

export default StatsCard;
