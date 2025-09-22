import { useState } from "react";
import ApiStatusBanner from "./ApiStatusBanner";
import HeroSection from "./HeroSection";
import SideNavBar from "./SideNavBar";

interface LayoutProps {
  children: React.ReactNode;
}
const Layout = ({ children }: LayoutProps) => {
  const [isNavOpen, setIsNavOpen] = useState(false);

  return (
    <>
      <ApiStatusBanner />
      <div className="layout">
        <SideNavBar isOpen={isNavOpen} onClose={() => setIsNavOpen(false)} />
        <main className="page-content">
          <HeroSection onOpenNav={() => setIsNavOpen(true)} />
          {children}
        </main>

        {/* Backdrop when nav is open */}
        {isNavOpen && <div className="nav-backdrop" onClick={() => setIsNavOpen(false)} />}
      </div>
    </>
  );
};

export default Layout;
