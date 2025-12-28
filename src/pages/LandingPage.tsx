import React from "react";

import "./LandingPage.css";
import HeroSection from "~/components/HeroSection";

type Props = {
  onOpenAuth: (mode?: "login" | "signup") => void;
};

const LandingPage: React.FC<Props> = ({ onOpenAuth }) => {
  return (
    <div className="landing-page">
      <HeroSection onSignInClick={() => onOpenAuth("signup")} showSignInButton={false} />
      <section className="value-prop">
        <h2>Your Health Companion</h2>
        <p>Track symptoms, manage consultations, and get meaningful progress reports over time.</p>
        <div className="cta-row">
          <button className="primary" onClick={() => onOpenAuth("signup")}>
            Try It Out
          </button>
          <button className="secondary" onClick={() => onOpenAuth("login")}>
            Sign In
          </button>
        </div>
      </section>

      <section className="demo">
        <h3>Demo / Key Features</h3>
        <div className="demo-cards">
          <div className="card">
            <h4>Track Symptoms</h4>
            <p>Create and update symptom entries with history.</p>
          </div>
          <div className="card">
            <h4>Consultation Log</h4>
            <p>Record medical visits and follow-up actions.</p>
          </div>
          <div className="card">
            <h4>Reports</h4>
            <p>View trends and charts over time.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
