import { useState } from "react";
import { NavLink } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";
import AuthModal from "./AuthModal";

const NavbarMain = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  // New state to control whether the modal opens for 'login' or 'signup'
  const [authType, setAuthType] = useState("login");

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  // New function to handle opening the login modal
  const handleLoginClick = () => {
    setAuthType("login");
    setAuthOpen(true);
    closeMenu(); // Also close the hamburger menu
  };

  // New function to handle opening the signup modal
  const handleSignupClick = () => {
    setAuthType("signup");
    setAuthOpen(true);
    closeMenu(); // Also close the hamburger menu
  };

  return (
    <>
      <header
        className="flex justify-between items-center px-8 py-4 sticky top-0 z-50 w-full text-white backdrop-blur-sm bg-[#0f0425]/10 font-orbitron"
        style={{ fontFamily: "Orbitron, sans-serif" }}
      >
        {/* Logo */}
        <div className="text-xl md:text-2xl font-medium tracking-wider uppercase">
          codeXpert
        </div>

        {/* Hamburger (mobile) */}
        <div className="flex md:hidden cursor-pointer" onClick={toggleMenu}>
          {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </div>

        {/* Nav Links */}
        <nav
          className={`${
            menuOpen
              ? "flex flex-col items-center gap-4 py-4 absolute top-full left-0 right-0 bg-[#0f0425] md:hidden"
              : "hidden md:flex items-center gap-8"
          }`}
        >
          <NavLink
            to="/"
            onClick={closeMenu}
            className={({ isActive }) =>
              `uppercase text-sm tracking-wide transition-colors ${
                isActive
                  ? "text-cyan-400 border-b-2 border-cyan-400"
                  : "text-white hover:text-gray-300"
              }`
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/code-review"
            onClick={closeMenu}
            className={({ isActive }) =>
              `uppercase text-sm tracking-wide transition-colors ${
                isActive
                  ? "text-cyan-400 border-b-2 border-cyan-400"
                  : "text-white hover:text-gray-300"
              }`
            }
          >
            Code Review
          </NavLink>

          <NavLink
            to="/code-comments"
            onClick={closeMenu}
            className={({ isActive }) =>
              `uppercase text-sm tracking-wide transition-colors ${
                isActive
                  ? "text-cyan-400 border-b-2 border-cyan-400"
                  : "text-white hover:text-gray-300"
              }`
            }
          >
            Code Comments
          </NavLink>

          <NavLink
            to="/bug-finder"
            onClick={closeMenu}
            className={({ isActive }) =>
              `uppercase text-sm tracking-wide transition-colors ${
                isActive
                  ? "text-cyan-400 border-b-2 border-cyan-400"
                  : "text-white hover:text-gray-300"
              }`
            }
          >
            Bug Finder
          </NavLink>

          {/* Using the new functions with separate buttons */}
          <div className="flex items-center gap-4">
            <button
              onClick={handleLoginClick}
              className="bg-white text-[#0f0425] px-4 py-2 rounded font-semibold text-sm hover:bg-gray-300 transition"
            >
              Login/Sign Up
            </button>
          </div>
        </nav>
      </header>
      {/* Auth Modal now receives a 'type' prop */}
      <AuthModal
        type={authType}
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
      />
    </>
  );
};

export default NavbarMain;
