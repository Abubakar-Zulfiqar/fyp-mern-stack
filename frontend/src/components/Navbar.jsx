import React, { useState } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const closeDropdown = () => {
    setDropdownOpen(false);
  };

  return (
    <nav className="bg-indigo-600 text-white p-4 flex justify-between items-center">
      <Link to="/">
        <img
          src="/stress-track.jpg"
          alt="app-logo"
          className="w-10 md:w-15 lg:w-20 rounded-2xl"
        />
      </Link>
      <div className="relative">
        <div className="flex gap-4">
          <Link to="/test-page">
            <h1 className="text-xl font-bold hover:text-amber-400">Test</h1>
          </Link>
          <Link to="/history">
            <h1 className="text-xl font-bold hover:text-amber-400">History</h1>
          </Link>
          <button
            onClick={toggleDropdown}
            className="relative flex items-center space-x-2 focus:outline-none"
          >
            <span className="text-xl font-bold hover:text-amber-400">
              Profile
            </span>
          </button>
        </div>

        {dropdownOpen && (
          <div
            className="absolute right-0 mt-2 bg-white text-black rounded shadow-lg"
            onMouseLeave={closeDropdown}
          >
            <Link
              to="/profile"
              className="block px-4 py-2 hover:bg-gray-100 w-full text-left"
            >
              Profile
            </Link>
            <button
              onClick={handleLogout}
              className="block px-4 py-2 hover:bg-gray-100 w-full text-left"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
