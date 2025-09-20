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
            Health Record Editor
          </NavLink>
        </li>
        <li>
          <NavLink to="/health-record/form" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
            Health Record Form
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
