import { Link } from "react-router-dom";
import "../App.css";

interface Props {
  user: { name: string } | null;
  onSignIn: () => void;
  onSignOut: () => void;
}

const TopNavBar = ({ user, onSignIn, onSignOut }: Props) => {
  return (
    <header className="top-navbar">
      <div className="top-left">
        <Link to="/" className="home-button">
          Home
        </Link>
      </div>
      <div className="top-right">
        {user && <span>Hi, {user.name}</span>}
        <button onClick={user ? onSignOut : onSignIn} className={user ? "sign-out-button" : "sign-in-button"}>
          {user ? "Sign Out" : "Sign In"}
        </button>
      </div>
    </header>
  );
};

export default TopNavBar;
