import { NavLink } from "react-router-dom";

import "~/App.css";

const SideNavBar = () => {
  return (
    <nav className="side-nav">
      <ul className="nav-list">
        <li>
          <NavLink to="/health-record" className="nav-link">
            {/* need to be replaced later */}
            Health Record Editor
          </NavLink>
        </li>
        <li>
          <NavLink to="/health-record/form" className="nav-link">
            Health Record Form
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
