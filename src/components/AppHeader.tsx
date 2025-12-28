import { FiMenu } from "react-icons/fi";
import { useAuth } from "./AuthContext";

interface AppHeaderProps {
  onOpenNav?: () => void;
  onOpenAuth?: (mode?: "login" | "signup") => void;
}

const AppHeader = ({ onOpenNav, onOpenAuth }: AppHeaderProps) => {
  const { user, logout } = useAuth();

  return (
    <header className="app-header">
      {onOpenNav && (
        <button className="nav-toggle-tab" onClick={onOpenNav} title="Open Navigation">
          <FiMenu />
        </button>
      )}
      <h1 className="app-title"></h1>

      {!user && onOpenAuth && (
        <button className="sign-in-button" onClick={() => onOpenAuth("login")}>
          Sign In
        </button>
      )}

      {user && (
        <button className="sign-in-button" onClick={logout}>
          Sign Out
        </button>
      )}
    </header>
  );
};

export default AppHeader;
