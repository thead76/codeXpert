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
  Bell,
  CheckCircle,
  XCircle,
  KeyRound,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import UserProfileModal from "./UserProfileModal";
import LogoutModal from "./LogoutModal";
import UpdatePasswordModal from "./UpdatePasswordModal";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import toast from "react-hot-toast";

const NavbarPrivate = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [isToolsMenuOpen, setIsToolsMenuOpen] = useState(false);

  const dropdownRef = useRef(null);
  const notificationRef = useRef(null);
  const toolsMenuRef = useRef(null);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  const fetchNotifications = async () => {
    try {
      const { data } = await axios.get("/notifications");
      setNotifications(data);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isNotificationOpen) {
      fetchNotifications();
    }
  }, [isNotificationOpen]);

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
      if (
        toolsMenuRef.current &&
        !toolsMenuRef.current.contains(event.target)
      ) {
        setIsToolsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogoutConfirm = () => {
    logout();
    navigate("/", { replace: true });
    setIsLogoutModalOpen(false);
  };

  const handleInvitationResponse = async (invitationId, status) => {
    const promise = axios.put(`/teams/invitations/${invitationId}`, { status });

    toast.promise(promise, {
      loading: "Responding to invitation...",
      success: () => {
        fetchNotifications();
        return `Invitation ${status}!`;
      },
      error: "Failed to respond.",
    });
  };

  const handleTaskResponse = async (taskId, status) => {
    const promise = axios.put(`/tasks/${taskId}/respond`, { status });

    toast.promise(promise, {
      loading: "Responding to task...",
      success: () => {
        fetchNotifications();
        return `Task ${status}!`;
      },
      error: "Failed to respond to task.",
    });
  };

  const handleMarkAllAsRead = () => {
    if (notifications.length === 0) return;
    const promise = axios.put("/notifications/mark-all-read");
    toast.promise(promise, {
      loading: "Clearing notifications...",
      success: () => {
        setNotifications([]);
        return "All notifications cleared!";
      },
      error: "Failed to clear notifications.",
    });
  };

  const navLinkClass = ({ isActive }) =>
    `uppercase text-sm tracking-wide transition-colors ${
      isActive
        ? "text-cyan-400 border-b-2 border-cyan-400"
        : "text-white hover:text-gray-300"
    }`;

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

          <div
            className="relative pb-4 -mb-4 w-full md:w-auto"
            ref={toolsMenuRef}
          >
            <button
              onClick={() => setIsToolsMenuOpen(!isToolsMenuOpen)}
              className={`flex items-center justify-center w-full gap-1 ${navLinkClass(
                {
                  isActive: false,
                }
              )}`}
            >
              <Wrench size={16} /> Tools
            </button>
            <AnimatePresence>
              {isToolsMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="w-full mt-2 pl-6 md:pl-0 md:mt-3 md:absolute md:top-full md:left-1/2 md:-translate-x-1/2 md:w-48 bg-[#1a103d] border border-pink-500/50 rounded-lg shadow-lg"
                >
                  <NavLink
                    to="/code-review"
                    onClick={() => {
                      closeMenu();
                      setIsToolsMenuOpen(false);
                    }}
                    className="flex w-full items-center gap-3 px-4 py-3 text-sm text-white hover:bg-pink-500/20"
                  >
                    <Code size={16} /> Code Review
                  </NavLink>
                  <NavLink
                    to="/code-comments"
                    onClick={() => {
                      closeMenu();
                      setIsToolsMenuOpen(false);
                    }}
                    className="flex w-full items-center gap-3 px-4 py-3 text-sm text-white hover:bg-pink-500/20"
                  >
                    <MessageSquare size={16} /> Code Comments
                  </NavLink>
                  <NavLink
                    to="/bug-finder"
                    onClick={() => {
                      closeMenu();
                      setIsToolsMenuOpen(false);
                    }}
                    className="flex w-full items-center gap-3 px-4 py-3 text-sm text-white hover:bg-pink-500/20"
                  >
                    <Bug size={16} /> Bug Finder
                  </NavLink>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="relative" ref={notificationRef}>
            <button
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
              className="relative text-white p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors"
            >
              <Bell size={18} />
              {notifications.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-pink-500 rounded-full border-2 border-[#0f0425]"></span>
              )}
            </button>
            <AnimatePresence>
              {isNotificationOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="w-[90%] max-w-sm mt-2 md:absolute md:top-full md:right-0 md:mt-3 md:w-80 bg-[#1a103d] border border-pink-500/50 rounded-lg shadow-2xl z-50"
                  style={{ fontFamily: "Georgia, serif" }}
                >
                  <div className="p-2">
                    <div className="px-3 py-2 flex justify-between items-center border-b border-white/10">
                      <p className="font-semibold text-white">
                        Notifications ({notifications.length})
                      </p>
                      <button
                        onClick={handleMarkAllAsRead}
                        className="text-xs text-cyan-400 hover:underline disabled:text-gray-500"
                        disabled={notifications.length === 0}
                      >
                        Mark all as read
                      </button>
                    </div>
                    <div className="mt-1 max-h-80 overflow-y-auto">
                      {notifications.length > 0 ? (
                        notifications.map((notif) => (
                          <div
                            key={notif._id}
                            className="flex flex-col gap-2 p-3 text-sm text-gray-200 hover:bg-pink-500/20 rounded-md"
                          >
                            <p>{notif.message}</p>
                            {notif.teamInvitation && (
                              <div className="flex items-center gap-2 mt-2">
                                <button
                                  onClick={() =>
                                    handleInvitationResponse(
                                      notif.teamInvitation._id,
                                      "accepted"
                                    )
                                  }
                                  className="flex-1 bg-green-500/20 text-green-300 hover:bg-green-500/40 text-xs py-1.5 rounded flex items-center justify-center gap-1"
                                >
                                  <CheckCircle size={14} /> Accept
                                </button>
                                <button
                                  onClick={() =>
                                    handleInvitationResponse(
                                      notif.teamInvitation._id,
                                      "declined"
                                    )
                                  }
                                  className="flex-1 bg-red-500/20 text-red-300 hover:bg-red-500/40 text-xs py-1.5 rounded flex items-center justify-center gap-1"
                                >
                                  <XCircle size={14} /> Decline
                                </button>
                              </div>
                            )}
                            {notif.task && notif.task.status === "Pending" && (
                              <div className="flex items-center gap-2 mt-2">
                                <button
                                  onClick={() =>
                                    handleTaskResponse(
                                      notif.task._id,
                                      "accepted"
                                    )
                                  }
                                  className="flex-1 bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/40 text-xs py-1.5 rounded flex items-center justify-center gap-1"
                                >
                                  <CheckCircle size={14} /> Accept Task
                                </button>
                                <button
                                  onClick={() =>
                                    handleTaskResponse(
                                      notif.task._id,
                                      "declined"
                                    )
                                  }
                                  className="flex-1 bg-red-500/20 text-red-300 hover:bg-red-500/40 text-xs py-1.5 rounded flex items-center justify-center gap-1"
                                >
                                  <XCircle size={14} /> Decline Task
                                </button>
                              </div>
                            )}
                            <p className="text-xs text-gray-400 mt-1">
                              {new Date(notif.createdAt).toLocaleString()}
                            </p>
                          </div>
                        ))
                      ) : (
                        <p className="p-4 text-gray-400 text-center">
                          No new notifications
                        </p>
                      )}
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
      <UpdatePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
      />
      <LogoutModal
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
