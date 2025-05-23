import TopNavBar from "./TopNavBar";
import SideNavBar from "./SideNavBar";

interface Props {
  user: { name: string } | null;
  onSignIn: () => void;
  onSignOut: () => void;
  children: React.ReactNode;
}

const Layout = ({ user, onSignIn, onSignOut, children }: Props) => {
  return (
    <div className="layout">
      <TopNavBar user={user} onSignIn={onSignIn} onSignOut={onSignOut} />
      <div className="layout-body">
        <SideNavBar />
        <main className="page-content">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
