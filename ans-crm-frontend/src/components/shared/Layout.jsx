import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Toast from "./Toast";
import ConfirmModal from "./ConfirmModal";
import "./Layout.css";

const Layout = ({ children }) => {
  return (
    <div className="layout">
      <Navbar />
      <div className="layout__body">
        <Sidebar />
        <main className="layout__main">{children}</main>
      </div>
      <Toast />
      <ConfirmModal />
    </div>
  );
};

export default Layout;
