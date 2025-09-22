import { FaBandage, FaHeartPulse, FaStethoscope } from "react-icons/fa6";
import { FiMenu } from "react-icons/fi";

import "./HeroSection.css";

interface HeroSectionProps {
  onOpenNav?: () => void;
}

const HeroSection = ({ onOpenNav }: HeroSectionProps) => {
  return (
    <section className="hero-section">
      <button className="nav-toggle-tab" onClick={onOpenNav} title="Open Navigation">
        <FiMenu />
      </button>
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
