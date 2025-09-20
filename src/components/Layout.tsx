import ApiStatusBanner from "./ApiStatusBanner";
import SideNavBar from "./SideNavBar";
import TopNavBar from "./TopNavBar";

interface LayoutProps {
  children: React.ReactNode;
}
const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="layout">
      <ApiStatusBanner />
      <TopNavBar />
      <div className="layout-body">
        <SideNavBar />
        <main className="page-content">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
