import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * RoleDropdown
 * Props:
 * - value: current value ("" | "leader" | "member")
 * - onChange: (value) => void
 *
 * Replace your select with:
 * <RoleDropdown value={form.role} onChange={(role) => setForm({...form, role})} />
 */

const ROLES = [
  { value: "", label: "Register as" },
  { value: "leader", label: "Team Leader" },
  { value: "member", label: "Member" },
];

export default function RoleDropdown({ value = "", onChange }) {
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(() => {
    const idx = ROLES.findIndex((r) => r.value === value);
    return idx >= 0 ? idx : 0;
  });
  const rootRef = useRef(null);

  useEffect(() => {
    const handleOutside = (e) => {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  // keep highlight synced with value changes
  useEffect(() => {
    const idx = ROLES.findIndex((r) => r.value === value);
    setHighlight(idx >= 0 ? idx : 0);
  }, [value]);

  const onKeyDown = (e) => {
    if (!open) {
      if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        setOpen(true);
      }
      return;
    }

    if (e.key === "Escape") {
      setOpen(false);
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlight((h) => Math.min(h + 1, ROLES.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight((h) => Math.max(h - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const sel = ROLES[highlight];
      if (sel) {
        onChange(sel.value);
        setOpen(false);
      }
    }
  };

  return (
    <div ref={rootRef} className="relative w-full">
      {/* Button that looks like your inputs */}
      <button
        type="button"
        onClick={() => setOpen((s) => !s)}
        onKeyDown={onKeyDown}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="w-full flex items-center gap-3 bg-[#2a1f52] px-4 py-3 rounded-lg border border-pink-400/10
                   hover:border-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
      >
        {/* user icon (inline svg) */}
        <svg
          className="w-5 h-5 text-pink-400 shrink-0"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
        >
          <path
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
          />
          <circle
            cx="12"
            cy="7"
            r="4"
            stroke="currentColor"
            strokeWidth="1.6"
          />
        </svg>

        <span
          className={`flex-1 text-left ${
            value ? "text-gray-200" : "text-gray-400"
          }`}
        >
          {ROLES.find((r) => r.value === value)?.label || "Register as"}
        </span>

        {/* chevron */}
        <svg
          className={`w-4 h-4 text-pink-400 transform transition-transform ${
            open ? "rotate-180" : ""
          }`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
        >
          <path
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 9l6 6 6-6"
          />
        </svg>
      </button>

      {/* dropdown panel */}
      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            role="listbox"
            aria-activedescendant={`role-option-${highlight}`}
            className="absolute z-50 mt-2 w-full bg-gradient-to-b from-[#24143d]/80 to-[#1a103d] backdrop-blur-sm border border-pink-500/15
                       rounded-xl shadow-2xl p-2 max-h-48 overflow-auto focus:outline-none"
          >
            {ROLES.map((r, idx) => {
              const isSelected = value === r.value && r.value !== "";
              const isPlaceholder = r.value === "";
              return (
                <li key={r.value || "placeholder"}>
                  <button
                    id={`role-option-${idx}`}
                    type="button"
                    onMouseEnter={() => setHighlight(idx)}
                    onClick={() => {
                      onChange(r.value);
                      setOpen(false);
                    }}
                    className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg transition
                              ${
                                idx === highlight
                                  ? "bg-pink-500/10"
                                  : "hover:bg-white/5"
                              }
                              ${
                                isSelected
                                  ? "text-pink-300 font-semibold"
                                  : "text-gray-200"
                              }`}
                  >
                    <span className={`${isPlaceholder ? "text-gray-400" : ""}`}>
                      {r.label}
                    </span>

                    {/* selected check */}
                    {isSelected && (
                      <svg
                        className="w-5 h-5 text-pink-400"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                      >
                        <path
                          stroke="currentColor"
                          strokeWidth="2.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </button>
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
