import { FiBarChart, FiHome, FiPlus, FiX } from "react-icons/fi";
import { NavLink } from "react-router-dom";

import "~/App.css";

interface SideNavBarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const SideNavBar = ({ isOpen = false, onClose }: SideNavBarProps) => {
  return (
    <nav className={`side-nav ${isOpen ? "open" : ""}`}>
      <div className="sidebar-header">
        <div className="sidebar-brand">PhisioLog</div>
        {onClose && (
          <button className="nav-close-btn" onClick={onClose} title="Close Navigation">
            <FiX />
          </button>
        )}
      </div>
      <ul className="nav-list">
        <li>
          <NavLink to="/" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
            <FiHome className="nav-icon" />
            Home
          </NavLink>
        </li>
        <li>
          <NavLink to="/health-record" end className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
            <FiPlus className="nav-icon" />
            Add Health Record
          </NavLink>
        </li>
        <li>
          <NavLink to="/reports" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
            <FiBarChart className="nav-icon" />
            Tracking & Reporting
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default SideNavBar;
