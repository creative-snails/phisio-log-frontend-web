import { NavLink } from "react-router-dom";

import "~/App.css";

const SideNavBar = () => {
  return (
    <nav className="side-nav">
      <ul className="nav-list">
        <li>
          <NavLink to="/health-record" className="nav-link">
            Health Record
          </NavLink>
        </li>
        <li>
          <NavLink to="/health-record/new" className="nav-link">
            Add Record
          </NavLink>
        </li>
        <li>
          <NavLink to="/body-map" className="nav-link">
            Body Map
          </NavLink>
        </li>
        <li>
          <NavLink to="/reports" className="nav-link">
            Tracking & Reporting
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default SideNavBar;
