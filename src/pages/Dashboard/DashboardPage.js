import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import './DashboardPage.css';

const DashboardPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  // Close the mobile sidebar whenever the route changes
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="dashboard-layout">
      {/* --- SIDEBAR --- */}
      {/* The 'open' class will be controlled by our state */}
      <aside className={`dashboard-sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <nav>
          <NavLink to="/dashboard/bookings">
            <i className="fas fa-gopuram"></i> My Pooja Bookings
          </NavLink>
          <NavLink to="/dashboard/orders">
            <i className="fas fa-box"></i> My Store Orders
          </NavLink>
          <NavLink to="/dashboard/courses">
            <i className="fas fa-book-open"></i> My Courses
          </NavLink>
          <NavLink to="/dashboard/profile">
            <i className="fas fa-user"></i> My Profile
          </NavLink>
        </nav>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="dashboard-content">
        {/* --- MOBILE-ONLY MENU BUTTON --- */}
        <button className="sidebar-toggle-btn" onClick={toggleSidebar}>
          <i className="fas fa-bars"></i> Menu
        </button>

        <Outlet />
      </main>
    </div>
  );
};

export default DashboardPage;