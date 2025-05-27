import { Link } from "react-router-dom";

import "./Home.css";

const Home = () => (
  <div className="content-wrapper">
    <h2>Welcome to Phisiolog</h2>

    <section>
      <p>
        <strong>Phisiolog</strong> is a health management app designed to help you track, understand, and improve your
        well-being over time.
      </p>
    </section>

    <section>
      <article>
        <h3>What You Can Do</h3>
        <ul>
          <li>📝 Manage and add your health records</li>
          <li>🧍 Visualize your health using the Body Map</li>
          <li>📊 Track progress and view insightful reports</li>
        </ul>
      </article>
    </section>

    <section>
      <p>
        Whether you're monitoring your fitness, managing a chronic condition, or just staying informed, Phisiolog gives
        you the tools to take control of your health journey.
      </p>
    </section>

    <section>
      <p>
        <em>Join us today and start your journey toward better health and well-being.</em>
      </p>
    </section>

    <Link to="/health-record" className="nav-link">
      View Health Records
    </Link>
  </div>
);

export default Home;
