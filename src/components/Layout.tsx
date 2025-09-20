import { useState } from "react";
import { FiMenu } from "react-icons/fi";
import HeroSection from "./HeroSection";
import SideNavBar from "./SideNavBar";

interface LayoutProps {
  children: React.ReactNode;
}
const Layout = ({ children }: LayoutProps) => {
  const [isNavOpen, setIsNavOpen] = useState(false);

  return (
    <div className="layout">
      <SideNavBar isOpen={isNavOpen} onClose={() => setIsNavOpen(false)} />
      <main className="page-content">
        <HeroSection />
        {children}
      </main>

      {/* Navigation Toggle Tab */}
      <button className="nav-toggle-tab" onClick={() => setIsNavOpen(true)} title="Open Navigation">
        <FiMenu />
      </button>

      {/* Backdrop when nav is open */}
      {isNavOpen && <div className="nav-backdrop" onClick={() => setIsNavOpen(false)} />}
    </div>
  );
};

export default Layout;
