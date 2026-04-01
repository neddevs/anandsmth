import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import './AdminDashboardPage.css';

const AdminDashboardPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  // Close the mobile sidebar on route change
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="admin-dashboard-layout">
      {/* --- SIDEBAR --- */}
      <aside className={`admin-dashboard-sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="admin-sidebar-header">
          <h3>Admin Panel</h3>
        </div>
        <nav>
          <NavLink to="/admin/dashboard" end>
            <i className="fas fa-tachometer-alt"></i> Overview
          </NavLink>
          <NavLink to="/admin/bookings">
            <i className="fas fa-calendar-check"></i> Manage Bookings
          </NavLink>
          <NavLink to="/admin/catalogues">
            <i className="fas fa-folder-open"></i> Catalogues
          </NavLink>
          <NavLink to="/admin/courses">
            <i className="fas fa-book-open"></i> Manage Courses
          </NavLink>
          <NavLink to="/admin/products">
            <i className="fas fa-store"></i> Manage Products
          </NavLink>
          <NavLink to="/admin/orders">
            <i className="fas fa-box"></i> Manage Orders
          </NavLink>
        </nav>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="admin-dashboard-content">
        {/* --- MOBILE-ONLY MENU BUTTON --- */}
        <button className="sidebar-toggle-btn admin-toggle-btn" onClick={toggleSidebar}>
          <i className="fas fa-bars"></i> Admin Menu
        </button>

        <Outlet />
      </main>
    </div>
  );
};

export default AdminDashboardPage;