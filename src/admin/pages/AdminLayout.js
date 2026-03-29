import { useState } from "react";
import { NavLink, Outlet, useLocation, Navigate, useNavigate } from "react-router-dom";
import "../css/AdminLayout.css";
import AdminHeader from "../components/AdminHeader";

const menuItems = [
  { path: "/admin/dashboard",     label: "Dashboard",     icon: "🏠" },
  { path: "/admin/doctors",       label: "Doctors", icon: "⚕️" },  
  { path: "/admin/approvals",     label: "Approvals",     icon: "✅" },
  { path: "/admin/patients",      label: "Patients",      icon: "🧑‍🤝‍🧑" },
  { path: "/admin/appointments",  label: "Appointments",  icon: "📅" },
  { path: "/admin/notifications", label: "Notifications", icon: "🔔" },
];

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location  = useLocation();
  const navigate  = useNavigate();

  if (location.pathname === "/admin" || location.pathname === "/admin/") {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const activeItem = menuItems.find(m => location.pathname.startsWith(m.path));

  return (
    <div className="al-root">

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="al-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      {/* ── SIDEBAR ── */}
      <aside className={"al-sidebar" + (sidebarOpen ? " al-sidebar-open" : "")}>
        <div className="al-brand">
          <span className="al-brand-icon">⚕️</span>
          <span className="al-brand-name">MediTrack</span>
        </div>

        <nav className="al-nav">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => "al-nav-item" + (isActive ? " al-nav-active" : "")}
              onClick={() => setSidebarOpen(false)}
            >
              <span className="al-nav-icon">{item.icon}</span>
              <span className="al-nav-label">{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* ── MAIN AREA ── */}
      <div className="al-main">

        {/* Sticky header */}
        <AdminHeader
          pageTitle={activeItem?.label || "Admin"}
          onHamburger={() => setSidebarOpen(o => !o)}
        />

        {/* Routed page content */}
        <main className="al-content">
          <Outlet />
        </main>

      </div>
    </div>
  );
};

export default AdminLayout;
