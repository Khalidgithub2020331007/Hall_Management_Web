import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUsers,
  FaUtensils,
  FaBuilding,
  FaSignOutAlt,
  FaUserCog,
  FaClipboardList,
  FaStore,
  FaUserGraduate,
  FaTimes,
  FaShapes
} from "react-icons/fa";
import { BiSolidFoodMenu } from "react-icons/bi";
import { PiNotepadFill } from "react-icons/pi";
import { GiBookPile } from "react-icons/gi";
import { FaHandshakeSimple, FaMagnifyingGlassChart } from "react-icons/fa6";



import SidebarItem from "./SidebarItem";

const getLinksForRole = (role) => {
  const baseLinks = [{ to: "", icon: FaTachometerAlt, text: "Dashboard Home" }];
  switch (role) {
    case "admin":
      return [
        ...baseLinks,
        { to: "manage-users", icon: FaUserCog, text: "Manage Users" },
        { to: "manage-halls", icon: FaBuilding, text: "Manage Halls" },
        { to: "manage-services", icon: FaStore, text: "Manage Services" },
      ];
    case "official_staff":
      return [
        ...baseLinks,
        {
          to: "manage-students",
          icon: FaUserGraduate,
          text: "Manage Students",
        },
        { to: "manage-notices", icon: FaClipboardList, text: "Manage Notices" },
        { to: "manage-complaints", icon: GiBookPile, text: "Manage Complaints" },
        { to: "meetings", icon: FaHandshakeSimple, text: "Meetings" },
        { to: "hall-applicants", icon: FaUsers, text: "Hall Applicants" },
      ];
    case "student":
      return [
        ...baseLinks,
        { to: "menu", icon: FaUtensils, text: "Menu" },
        { to: "notices", icon: PiNotepadFill, text: "Notices" },
        { to: "complaints", icon: BiSolidFoodMenu, text: "Complaints" },
        { to: "lost-found-items", icon: FaShapes, text: "Lost/Found items" },
        // { to: "my-profile", icon: FaUsers, text: "My Profile" },
        // { to: "meal-order", icon: FaUtensils, text: "Meal Order" },
      ];
    case "service_provider":
      return [
        ...baseLinks,
        { to: "manage-menu", icon: FaUtensils, text: "Manage Menu/Items" },
        { to: "reviews", icon: FaMagnifyingGlassChart, text: "Reviews" },
        { to: "notices", icon: PiNotepadFill, text: "Notices" },
      ];
    default:
      return [{ to: "", icon: FaTachometerAlt, text: "Dashboard" }];
  }
};

const Sidebar = ({ isOpen, userRole, toggleSidebar }) => {
  const navLinks = getLinksForRole(userRole);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <aside
      className={`
        fixed inset-y-0 left-0 z-30
        ${
          isOpen
            ? "translate-x-0 w-64"
            : "-translate-x-full lg:translate-x-0 w-64 lg:w-20"
        }
        bg-primary text-primary-content
        flex flex-col
        transition-all duration-300 ease-in-out
        shadow-xl
        
        `}
    >
      {/* Header */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-primary-focus">
        <div className="flex items-center">
          <FaBuilding className="text-2xl text-primary-content" />
          <span
            className={`ml-3 font-semibold text-xl ${!isOpen && "lg:hidden"}`}
          >
            SUST Halls
          </span>
        </div>
        <button
          onClick={toggleSidebar}
          className="lg:hidden text-primary-content hover:text-white"
        >
          <FaTimes className="w-6 h-6" />
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 mt-4 px-2 space-y-1 overflow-y-auto">
        {navLinks.map((link) => (
          <SidebarItem
            key={link.to + link.text}
            to={link.to}
            icon={link.icon}
            text={link.text}
            isCollapsed={!isOpen}
            onClick={
              window.innerWidth < 768 && isOpen ? toggleSidebar : undefined
            }
          />
        ))}
      </nav>

      {/* Logout Button */}
      <div className="mt-auto p-2 border-t border-primary-focus">
        <button
          onClick={handleLogout}
          className="flex items-center p-2 rounded-md w-full text-primary-content hover:bg-error hover:text-error-content transition-colors duration-200"
          title={!isOpen ? "Logout" : ""}
        >
          <FaSignOutAlt
            className={`w-6 h-6 ${!isOpen ? "mx-auto" : "mr-3"} flex-shrink-0`}
          />
          <span
            className={`${
              !isOpen ? "hidden lg:hidden" : "block"
            } text-sm font-medium truncate`}
          >
            Logout
          </span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
