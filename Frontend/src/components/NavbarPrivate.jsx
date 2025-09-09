import { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import { Bell } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const NavbarPrivate = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  const toggleMenu = () => setMenuOpen((s) => !s);
  const closeMenu = () => setMenuOpen(false);

  const navItems = ["My Teams", "Tasks", "Projects", "Report"]; // labels only

  const UsernameButton = (
    <button
      onClick={() => {
        closeMenu();
        logout();
      }}
      className="ml-2 rounded-xl px-3 py-2 bg-gradient-to-br from-pink-500/10 to-indigo-500/10 border border-white/10 font-semibold text-sm hover:bg-white/10"
      title="Click to logout"
    >
      {user?.email || "User"}
    </button>
  );

  return (
    <header
      className="flex justify-between items-center px-8 py-4 sticky top-0 z-50 w-full text-white backdrop-blur-sm bg-[#0f0425]/90 font-orbitron"
      style={{ fontFamily: "Orbitron, sans-serif" }}
    >
      {/* Logo */}
      <div className="text-xl md:text-2xl font-bold tracking-wider uppercase">
        codeXpert
      </div>

      {/* Hamburger (mobile) */}
      <div className="flex md:hidden cursor-pointer" onClick={toggleMenu}>
        {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </div>

      {/* Menu */}
      <nav
        className={`${
          menuOpen
            ? "flex flex-col items-center gap-4 py-4 absolute top-full left-0 right-0 bg-[#0f0425] md:hidden"
            : "hidden md:flex items-center gap-8"
        }`}
      >
        {navItems.map((label) => (
          <span
            key={label}
            className="uppercase text-sm tracking-wide text-gray-300 cursor-not-allowed select-none"
          >
            {label}
          </span>
        ))}

        {/* Notifications */}
        <button
          onClick={closeMenu}
          className="relative rounded-full p-2 bg-[#1a103d] border border-white/10 hover:scale-105 transition"
          title="Notifications"
        >
          <Bell size={18} />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-pink-500 rounded-full" />
        </button>

        {/* Username = logout */}
        {UsernameButton}
      </nav>
    </header>
  );
};

export default NavbarPrivate;
