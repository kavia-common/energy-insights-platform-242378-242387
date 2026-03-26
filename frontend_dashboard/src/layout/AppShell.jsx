import React, { useMemo } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { navItems } from "../app/nav";

/**
 * Dashboard layout wrapper:
 * - Sidebar navigation
 * - Sticky topbar (search + actions)
 * - Main content area with Outlet
 */
export default function AppShell() {
  const location = useLocation();

  const pageTitle = useMemo(() => {
    const match = navItems.find((i) => i.to === location.pathname);
    return match?.label ?? "Dashboard";
  }, [location.pathname]);

  return (
    <div className="app-shell">
      <div className="shell-grid">
        <aside className="sidebar" aria-label="Primary">
          <div className="sidebar-inner">
            <div className="brand" aria-label="Energy Insights Platform">
              <div className="brand-badge" aria-hidden="true" />
              <div className="brand-title">
                <strong>Energy Insights</strong>
                <span>Ocean Professional</span>
              </div>
            </div>

            <nav className="sidebar-nav" aria-label="Navigation">
              <div className="nav-section-label">Overview</div>

              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === "/"}
                  className="nav-item"
                >
                  <span className="nav-icon" aria-hidden="true">
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </nav>

            <div className="sidebar-footer">
              <div className="sidebar-footer-title">Tip</div>
              <div className="sidebar-footer-subtitle">
                Use <span className="kbd">/</span> to jump to search (coming
                next).
              </div>
            </div>
          </div>
        </aside>

        <div className="main-col">
          <header className="topbar" role="banner">
            <div className="topbar-left">
              <div className="page-title" aria-label="Current page">
                {pageTitle}
              </div>

              <div className="search" role="search">
                <span aria-hidden="true">⌕</span>
                <input
                  type="search"
                  placeholder="Search accounts, meters, alerts…"
                  aria-label="Search"
                />
              </div>
            </div>

            <div className="topbar-actions" aria-label="Actions">
              <button className="icon-btn" type="button" aria-label="Notifications">
                ⦿
              </button>
              <button className="icon-btn" type="button" aria-label="Profile">
                ☺
              </button>
              <button className="primary-btn" type="button">
                Create report
              </button>
            </div>
          </header>

          <main className="content" role="main">
            <div className="content-inner">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
