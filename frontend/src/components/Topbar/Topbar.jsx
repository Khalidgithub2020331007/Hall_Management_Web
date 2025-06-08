import React from "react";
import { FaBars, FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Topbar = ({ toggleSidebar, userName, userHallName }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <header className="h-16 bg-base-100 border-b border-base-200 flex items-center justify-between px-4 md:px-6 shadow-sm z-10">
      <div className="flex items-center">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-md text-base-content hover:bg-base-200 focus:outline-none"
          aria-label="Toggle sidebar"
        >
          <FaBars className="w-5 h-5" />
        </button>
        <span className="font-medium ">{userHallName}</span>
      </div>

      <div className="flex items-center space-x-3 md:space-x-4">
        <div className="avatar placeholder hidden sm:flex">
          <div className="bg-primary text-primary-content rounded-full w-8 h-8 flex items-center justify-center">
            <span className="text-xs font-medium">
              {userName ? userName.charAt(0).toUpperCase() : "U"}
            </span>
          </div>
        </div>

        <span className="font-medium text-sm md:text-base hidden sm:block text-base-content">
          {userName || "User"}
        </span>

        <button
          onClick={handleLogout}
          className="flex items-center p-2 text-sm text-base-content hover:text-error hover:bg-error/10 rounded-md transition-colors"
          title="Logout"
        >
          <FaSignOutAlt className="w-4 h-4 mr-1 sm:mr-2" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
};

export default Topbar;
