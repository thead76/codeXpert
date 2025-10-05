import React, { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";
import {
  LogOut,
  Code,
  MessageSquare,
  Bug,
  Wrench,
  User,
  Settings,
  Bell,
  CheckCircle,
  PlusCircle,
  KeyRound,
} from "lucide-react"; // KeyRound icon import karein
import { useAuth } from "../context/AuthContext";
import UserProfileModal from "./UserProfileModal";
import ConfirmationModal from "./ConfirmationModal";
import UpdatePasswordModal from "./UpdatePasswordModal"; // Naya password modal import karein
import { motion, AnimatePresence } from "framer-motion";

const NavbarPrivate = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false); // Password modal ke liye naya state
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const dropdownRef = useRef(null);
  const notificationRef = useRef(null);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setIsNotificationOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogoutConfirm = () => {
    logout();
    navigate("/", { replace: true });
    setIsLogoutModalOpen(false);
  };

  const navLinkClass = ({ isActive }) =>
    `uppercase text-sm tracking-wide transition-colors ${
      isActive
        ? "text-cyan-400 border-b-2 border-cyan-400"
        : "text-white hover:text-gray-300"
    }`;

  const notifications = [
    {
      icon: <PlusCircle size={16} className="text-green-400" />,
      text: "Rohan accepted your team invitation.",
      time: "5m ago",
    },
    {
      icon: <CheckCircle size={16} className="text-cyan-400" />,
      text: "New task 'Deploy to Staging' assigned.",
      time: "1h ago",
    },
    {
      icon: <User size={16} className="text-yellow-400" />,
      text: "Your profile was updated.",
      time: "1d ago",
    },
  ];

  return (
    <>
      <header
        className="flex justify-between items-center px-8 py-4 sticky top-0 z-50 w-full text-white backdrop-blur-sm bg-[#0f0425]/10 font-orbitron"
        style={{ fontFamily: "Orbitron, sans-serif" }}
      >
        <NavLink
          to="/dashboard"
          className="text-xl md:text-2xl font-medium tracking-wider uppercase"
        >
          codeXpert
        </NavLink>

        <div className="flex md:hidden cursor-pointer" onClick={toggleMenu}>
          {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </div>

        <nav
          className={`${
            menuOpen
              ? "flex flex-col items-center gap-4 py-4 absolute top-full left-0 right-0 bg-[#0f0425]"
              : "hidden"
          } md:flex md:items-center gap-8`}
        >
          <NavLink to="/my-team" onClick={closeMenu} className={navLinkClass}>
            My Team
          </NavLink>
          <NavLink
            to="/assigned-tasks"
            onClick={closeMenu}
            className={navLinkClass}
          >
            Assigned Tasks
          </NavLink>
          <NavLink to="/report" onClick={closeMenu} className={navLinkClass}>
            Report
          </NavLink>
          <NavLink to="/notice" onClick={closeMenu} className={navLinkClass}>
            Notice
          </NavLink>

          <div className="group relative pb-4 -mb-4">
            <button
              className={`flex items-center gap-1 ${navLinkClass({
                isActive: false,
              })}`}
            >
              <Wrench size={16} /> Tools
            </button>
            <div className="absolute top-full left-1/2 -translate-x-1/2 w-48 bg-[#1a103d] border border-pink-500/50 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto">
              <NavLink
                to="/code-review"
                onClick={closeMenu}
                className="flex w-full items-center gap-3 px-4 py-3 text-sm text-white hover:bg-pink-500/20"
              >
                <Code size={16} /> Code Review
              </NavLink>
              <NavLink
                to="/code-comments"
                onClick={closeMenu}
                className="flex w-full items-center gap-3 px-4 py-3 text-sm text-white hover:bg-pink-500/20"
              >
                <MessageSquare size={16} /> Code Comments
              </NavLink>
              <NavLink
                to="/bug-finder"
                onClick={closeMenu}
                className="flex w-full items-center gap-3 px-4 py-3 text-sm text-white hover:bg-pink-500/20"
              >
                <Bug size={16} /> Bug Finder
              </NavLink>
            </div>
          </div>

          <div className="relative" ref={notificationRef}>
            <button
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
              className="relative text-white p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors"
            >
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-pink-500 rounded-full border-2 border-[#0f0425]"></span>
            </button>

            <AnimatePresence>
              {isNotificationOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full right-0 mt-3 w-80 bg-[#1a103d] border border-pink-500/50 rounded-lg shadow-2xl z-50"
                >
                  <div className="p-2">
                    <div className="px-3 py-2 flex justify-between items-center border-b border-white/10">
                      <p className="font-semibold text-white">Notifications</p>
                      <button className="text-xs text-cyan-400 hover:underline">
                        Mark all as read
                      </button>
                    </div>
                    <div className="mt-1 max-h-80 overflow-y-auto">
                      {notifications.map((notif, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-3 px-3 py-3 text-sm text-gray-200 hover:bg-pink-500/20 rounded-md"
                        >
                          {notif.icon}
                          <div className="flex-1">
                            <p>{notif.text}</p>
                            <p className="text-xs text-gray-400 mt-1">
                              {notif.time}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="bg-white text-[#0f0425] px-4 py-2 rounded-full font-semibold text-sm flex items-center gap-2 transition-transform duration-300 hover:scale-105"
            >
              <User size={16} />
              {user?.name || "Profile"}
            </button>

            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full right-0 mt-3 w-56 bg-[#1a103d] border border-pink-500/50 rounded-lg shadow-2xl z-50"
                >
                  <div className="p-2">
                    <div className="px-3 py-2 border-b border-white/10">
                      <p className="font-semibold text-white">{user?.name}</p>
                      <p className="text-xs text-gray-400">{user?.email}</p>
                    </div>
                    <div className="mt-1">
                      <button
                        onClick={() => {
                          setIsProfileModalOpen(true);
                          setIsDropdownOpen(false);
                          closeMenu();
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-200 hover:bg-pink-500/20 rounded-md"
                      >
                        <User size={16} />
                        <span>Edit Profile</span>
                      </button>
                      {/* --- BADLAV YAHAN HAI --- */}
                      <button
                        onClick={() => {
                          setIsPasswordModalOpen(true);
                          setIsDropdownOpen(false);
                          closeMenu();
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-200 hover:bg-pink-500/20 rounded-md"
                      >
                        <KeyRound size={16} />
                        <span>Update Password</span>
                      </button>
                    </div>
                    <div className="mt-1 border-t border-white/10 pt-1">
                      <button
                        onClick={() => {
                          setIsLogoutModalOpen(true);
                          setIsDropdownOpen(false);
                          closeMenu();
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-400 hover:bg-red-500/20 rounded-md"
                      >
                        <LogOut size={16} />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </nav>
      </header>

      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />
      {/* --- NAYA MODAL YAHAN ADD KIYA GAYA HAI --- */}
      <UpdatePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
      />
      <ConfirmationModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogoutConfirm}
        title="Confirm Logout"
        message="Are you sure you want to log out?"
      />
    </>
  );
};

export default NavbarPrivate;
