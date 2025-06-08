import React from "react";
import { NavLink } from "react-router-dom";

const SidebarItem = ({ to, icon: Icon, text, isCollapsed, onClick }) => {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center p-2 rounded-md w-full transition-colors duration-200 group
        ${
          isActive
            ? "bg-primary-focus text-primary-content font-medium"
            : "text-primary-content hover:bg-primary-focus/50"
        }`
      }
      title={isCollapsed ? text : ""}
      end={to === ""}
    >
      <Icon
        className={`w-5 h-5 ${
          isCollapsed ? "mx-auto" : "mr-3"
        } flex-shrink-0 group-hover:scale-110 transition-transform`}
      />
      <span
        className={`${
          isCollapsed ? "hidden lg:hidden" : "block"
        } text-sm font-medium truncate`}
      >
        {text}
      </span>
    </NavLink>
  );
};

export default SidebarItem;
