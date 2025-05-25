import SideNavBar from "./SideNavBar";
import TopNavBar from "./TopNavBar";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="layout">
      <TopNavBar />
      <div className="layout-body">
        <SideNavBar />
        <main className="page-content">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
