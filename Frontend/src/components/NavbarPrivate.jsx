import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";
import { LogOut, Code, MessageSquare, Bug, Wrench } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import UserProfileModal from "./UserProfileModal";
import ConfirmationModal from "./ConfirmationModal";

const NavbarPrivate = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  const handleProfileClick = () => {
    closeMenu();
    setIsProfileModalOpen(true);
  };

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

  return (
    <>
      <header
        className="flex justify-between items-center px-8 py-4 sticky top-0 z-50 w-full text-white backdrop-blur-sm bg-[#0f0425]/10 font-orbitron"
        style={{ fontFamily: "Orbitron, sans-serif" }}
      >
        {/* Logo */}
        <NavLink
          to="/dashboard"
          className="text-xl md:text-2xl font-medium tracking-wider uppercase"
        >
          codeXpert
        </NavLink>

        {/* Hamburger (mobile) */}
        <div className="flex md:hidden cursor-pointer" onClick={toggleMenu}>
          {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </div>

        {/* Nav Links */}
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

          {/* --- FIXED: Tools Dropdown --- */}
          {/* By adding padding to the bottom of the group, we create a hoverable area */}
          <div className="group relative pb-4 -mb-4">
            <button
              className={`flex items-center gap-1 ${navLinkClass({
                isActive: false,
              })}`}
            >
              <Wrench size={16} />
              Tools
            </button>
            {/* The margin-top is removed so there's no gap */}
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

          {/* Group Profile and Logout buttons together */}
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            {/* Profile Button */}
            <button
              onClick={handleProfileClick}
              className="bg-white text-[#0f0425] px-4 py-2 rounded font-semibold text-sm hover:bg-gray-300 transition"
            >
              {user?.name || "Profile"}
            </button>

            {/* Logout Button */}
            <button
              onClick={() => setIsLogoutModalOpen(true)}
              className="bg-red-600 text-white p-2 rounded-full font-semibold text-sm hover:bg-red-700 transition"
              title="Logout"
            >
              <LogOut size={18} />
            </button>
          </div>
        </nav>
      </header>

      {/* Profile Modal */}
      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />

      {/* Logout Confirmation Modal */}
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
