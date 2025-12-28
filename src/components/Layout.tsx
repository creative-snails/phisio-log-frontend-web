import { useState } from "react";
import ApiStatusBanner from "./ApiStatusBanner";
import AppHeader from "./AppHeader";
import SideNavBar from "./SideNavBar";

interface LayoutProps {
  children: React.ReactNode;
  onOpenAuth?: (mode?: "login" | "signup") => void;
}
const Layout = ({ children, onOpenAuth }: LayoutProps) => {
  const [isNavOpen, setIsNavOpen] = useState(false);

  return (
    <>
      <ApiStatusBanner />
      <div className="layout">
        <SideNavBar isOpen={isNavOpen} onClose={() => setIsNavOpen(false)} />
        <main className="page-content">
          <AppHeader onOpenNav={() => setIsNavOpen(true)} onOpenAuth={onOpenAuth} />
          {children}
        </main>

        {/* Backdrop when nav is open */}
        {isNavOpen && <div className="nav-backdrop" onClick={() => setIsNavOpen(false)} />}
      </div>
    </>
  );
};

export default Layout;
