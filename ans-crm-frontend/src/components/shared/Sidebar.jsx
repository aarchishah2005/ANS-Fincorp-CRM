import { NavLink } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import useUIStore from "../../store/useUIStore";
import "./Sidebar.css";

const adminLinks = [
  { to: "/admin/dashboard", label: "Dashboard", icon: "📊" },
  { to: "/admin/leads", label: "All Leads", icon: "📋" },
  { to: "/admin/team", label: "Sales Team", icon: "👥" },
  { to: "/admin/reports", label: "Reports", icon: "📈" },
];

const salesLinks = [
  { to: "/sales/dashboard", label: "Dashboard", icon: "📊" },
  { to: "/sales/leads", label: "My Leads", icon: "📋" },
  { to: "/sales/leads/new", label: "Add Lead", icon: "➕" },
];

const Sidebar = () => {
  const { user } = useAuth();
  const { sidebarOpen } = useUIStore();
  const links = user?.role === "admin" ? adminLinks : salesLinks;

  return (
    <aside className={`sidebar ${sidebarOpen ? "sidebar--open" : "sidebar--closed"}`}>
      <nav className="sidebar__nav">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `sidebar__link ${isActive ? "sidebar__link--active" : ""}`
            }
          >
            <span className="sidebar__icon">{link.icon}</span>
            {sidebarOpen && <span className="sidebar__label">{link.label}</span>}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
