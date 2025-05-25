import { useState } from "react";
import { Link } from "react-router-dom";

import "~/App.css";

const TopNavBar = () => {
  const [user, setUser] = useState<{ name: string } | null>(null);

  const handleSignIn = () => setUser({ name: "Emmet" });
  const handleSignOut = () => setUser(null);

  return (
    <header className="top-navbar">
      <div className="top-left">
        <Link to="/" className="home-button">
          Home
        </Link>
      </div>
      <div className="top-right">
        {user && <span>Hi, {user.name}</span>}
        <button onClick={user ? handleSignOut : handleSignIn} className={user ? "sign-out-button" : "sign-in-button"}>
          {user ? "Sign Out" : "Sign In"}
        </button>
      </div>
    </header>
  );
};

export default TopNavBar;
