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
        <div className="floating-shape shape-1"></div>
        <div className="floating-shape shape-2"></div>
        <div className="floating-shape shape-3"></div>
      </div>
    </section>
  );
};

export default HeroSection;
