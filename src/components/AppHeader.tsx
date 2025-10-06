import { FiMenu } from "react-icons/fi";

interface AppHeaderProps {
  onOpenNav?: () => void;
}

const AppHeader = ({ onOpenNav }: AppHeaderProps) => {
  return (
    <header className="app-header">
      <button className="nav-toggle-tab" onClick={onOpenNav} title="Open Navigation">
        <FiMenu />
      </button>
      <h1 className="app-title"></h1>
    </header>
  );
};

export default AppHeader;
