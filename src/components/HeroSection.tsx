import { FaBandage, FaHeartPulse, FaStethoscope } from "react-icons/fa6";

import "./HeroSection.css";

const HeroSection = () => {
  return (
    <section className="hero-section">
      <button className="sign-in-button">Sign In</button>
      <div className="hero-header">
        <h1 className="hero-title">Your Health Companion</h1>
      </div>

      <p className="hero-subtitle">Track, understand, and improve your well-being over time.</p>
      <p className="hero-subtitle"></p>

      <div className="hero-decoration">
        <div className="floating-icon icon-1">
          <FaHeartPulse />
        </div>
        <div className="floating-icon icon-2">
          <FaStethoscope />
        </div>
        <div className="floating-icon icon-3">
          <FaBandage />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
