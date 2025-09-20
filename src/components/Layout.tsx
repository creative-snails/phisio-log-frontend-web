import HeroSection from "./HeroSection";
import SideNavBar from "./SideNavBar";

interface LayoutProps {
  children: React.ReactNode;
}
const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="layout">
      <SideNavBar />
      <main className="page-content">
        <HeroSection />
        {children}
      </main>
    </div>
  );
};

export default Layout;
