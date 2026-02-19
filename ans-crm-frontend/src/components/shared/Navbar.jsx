import useAuth from "../../hooks/useAuth";
import useUIStore from "../../store/useUIStore";
import { logout } from "../../api/auth";
import "./Navbar.css";

const Navbar = () => {
  const { user, logoutUser } = useAuth();
  const { toggleSidebar } = useUIStore();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (_) {}
    logoutUser();
  };

  return (
    <header className="navbar">
      <button className="navbar__menu-btn" onClick={toggleSidebar}>
        ☰
      </button>

      <div className="navbar__brand">
        <span className="navbar__brand-text">ANS CRM</span>
        <span className="navbar__brand-dot">●</span>
      </div>

      <div className="navbar__right">
        <div className="navbar__user">
          <div className="navbar__avatar">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="navbar__user-info">
            <span className="navbar__user-name">{user?.name}</span>
            <span className={`navbar__role navbar__role--${user?.role}`}>
              {user?.role}
            </span>
          </div>
        </div>
        <button className="navbar__logout" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </header>
  );
};

export default Navbar;
