import { NavLink } from "react-router-dom";

import "~/App.css";

const SideNavBar = () => {
  return (
    <nav className="side-nav">
      <div className="sidebar-brand">PhisioLog</div>
      <ul className="nav-list">
        <li>
          <NavLink to="/" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
            Home
          </NavLink>
        </li>
        <li>
          <NavLink to="/health-record" end className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
            Add Health Record
          </NavLink>
        </li>
        <li>
          <NavLink to="/reports" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
            Tracking & Reporting
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default SideNavBar;
