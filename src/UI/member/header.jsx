
import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { HeartHandshake, Menu, X } from "lucide-react";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinkStyle = ({ isActive }) =>
    `transition-colors duration-200 ${
      isActive
        ? "font-bold text-[#438FC4]"
        : "font-medium text-slate-600 hover:text-[#438FC4]"
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/95 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#DDF0FC] text-[#438FC4]">
            <HeartHandshake size={25} />
          </span>
          <span className="text-xl font-extrabold tracking-tight">
            Kindora<span className="text-[#67A9D7]">.</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-10 md:flex">
          <NavLink to="/" end className={navLinkStyle}>
            Home
          </NavLink>

          <NavLink to="/campaigns" className={navLinkStyle}>
            Campaigns
          </NavLink>

          <NavLink to="/community" className={navLinkStyle}>
            Community
          </NavLink>

          <NavLink to="/aboutus" className={navLinkStyle}>
            About Us
          </NavLink>
        </div>

        {/* Login and Sign Up */}
        <div className="hidden items-center gap-4 md:flex">
          <NavLink to="/login" className={navLinkStyle}>
            Login
          </NavLink>

          <NavLink
            to="/register"
            className={({ isActive }) =>
              `rounded-xl px-5 py-3 font-semibold text-[#183B55] transition ${
                isActive
                  ? "bg-[#67A9D7]"
                  : "bg-[#8EC5E9] hover:bg-[#75B5E0]"
              }`
            }
          >
            Sign Up
          </NavLink>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="rounded-lg p-2 hover:bg-slate-100 md:hidden"
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Navigation */}
      {menuOpen && (
        <div className="space-y-1 border-t border-slate-100 bg-white px-5 py-4 md:hidden">
          {[
            ["Home", "/"],
            ["Campaigns", "/campaigns"],
            ["Community", "/community"],
            ["About Us", "/aboutus"],
            ["Login", "/login"],
            ["Sign Up", "/register"],
          ].map(([label, href]) => (
            <NavLink
              key={label}
              to={href}
              end={href === "/"}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `block rounded-lg px-3 py-3 transition ${
                  isActive
                    ? "bg-[#EAF5FC] font-bold text-[#438FC4]"
                    : "font-medium text-slate-600 hover:bg-[#EAF5FC] hover:text-[#438FC4]"
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </div>
      )}
    </header>
  );
}

export default Header;
