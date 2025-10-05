import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, User, Shield } from "lucide-react";

const RoleDropdown = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const roles = [
    { value: "member", label: "Member", icon: <User size={16} /> },
    { value: "leader", label: "Leader", icon: <Shield size={16} /> },
  ];

  const selectedRole = roles.find((r) => r.value === value) || roles[0];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center gap-3 bg-[#2a1f52] px-4 py-3 rounded-lg text-left"
      >
        <div className="flex items-center gap-3">
          <span className="text-pink-400">{selectedRole.icon}</span>
          <span>{selectedRole.label}</span>
        </div>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }}>
          <ChevronDown size={20} />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute bottom-full mb-2 w-full bg-[#1a103d] border border-pink-500/50 rounded-lg shadow-lg z-10 p-2"
          >
            {roles.map((role) => (
              <button
                key={role.value}
                type="button"
                onClick={() => {
                  onChange(role.value);
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-3 px-3 py-2 text-left rounded-md hover:bg-pink-500/20"
              >
                <span className="text-pink-400">{role.icon}</span>
                <span>{role.label}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RoleDropdown;
