import "./HeroSection.css";

const HeroSection = () => {
  return (
    <section className="hero-section">
      <button className="sign-in-button">Sign In</button>
      <div className="hero-header">
        <h1 className="hero-title">PhisioLog</h1>
      </div>

      <p className="hero-subtitle">
        <span>Your personal health management companion.</span>
        <br />
        <span>Track, understand, and improve your well-being over time.</span>.
      </p>
      <p className="hero-subtitle"></p>

      <div className="hero-actions">
        <button className="action-button sage">
          <span>🌱</span>
          <span>Track your wellness journey</span>
        </button>
        <button className="action-button peach">
          <span>📊</span>
          <span>Visualize your progress</span>
        </button>
        <button className="action-button lavender">
          <span>💚</span>
          <span>Nurture your health</span>
        </button>
      </div>

      <div className="hero-decoration">
        <div className="floating-shape shape-1"></div>
        <div className="floating-shape shape-2"></div>
        <div className="floating-shape shape-3"></div>
      </div>
    </section>
  );
};

export default HeroSection;
