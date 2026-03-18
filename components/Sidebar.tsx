// components/Sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const NAV_SECTIONS = [
  {
    label: "General",
    items: [
      { label: "Home",      href: "/",          icon: "⌂" },
      { label: "Dashboard", href: "/dashboard", icon: "▦" },
      { label: "Items",     href: "/Items",     icon: "≡" },
    ],
  },
  {
    label: "Manage",
    items: [
      { label: "Settings",  href: "/settings",  icon: "⚙" },
      { label: "Users",     href: "/users",     icon: "◎" },
      { label: "Reports",   href: "/reports",   icon: "↗" },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Geist+Mono:wght@400;500&family=Geist:wght@400;500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --sidebar-bg: #111114;
          --sidebar-border: rgba(255,255,255,0.06);
          --sidebar-width: 220px;
          --sidebar-collapsed-width: 60px;
          --text-muted: rgba(255,255,255,0.38);
          --text-base: rgba(255,255,255,0.65);
          --text-active: #f5f5f5;
          --accent: #4ade80;
          --hover-bg: rgba(255,255,255,0.05);
          --active-bg: rgba(74,222,128,0.1);
          --transition: 0.2s cubic-bezier(0.4,0,0.2,1);
        }

        body {
          font-family: 'Geist', sans-serif;
          background: #0d0d10;
          color: #e0e0e0;
        }

        .app-shell {
          display: flex;
          min-height: 100vh;
        }

        .app-main {
          flex: 1;
          padding: 2rem;
          overflow-y: auto;
        }

        /* ── Sidebar ── */
        .sidebar {
          position: sticky;
          top: 0;
          height: 100vh;
          width: var(--sidebar-width);
          min-width: var(--sidebar-width);
          background: var(--sidebar-bg);
          border-right: 1px solid var(--sidebar-border);
          display: flex;
          flex-direction: column;
          transition: width var(--transition), min-width var(--transition);
          overflow: hidden;
          z-index: 50;
        }

        .sidebar.collapsed {
          width: var(--sidebar-collapsed-width);
          min-width: var(--sidebar-collapsed-width);
        }

        /* Logo */
        .sidebar__logo {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          padding: 1.1rem 1rem;
          border-bottom: 1px solid var(--sidebar-border);
          text-decoration: none;
          overflow: hidden;
          white-space: nowrap;
        }

        .sidebar__logo-icon {
          width: 28px;
          height: 28px;
          min-width: 28px;
          background: var(--accent);
          border-radius: 7px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Geist Mono', monospace;
          font-size: 0.7rem;
          font-weight: 500;
          color: #0d0d10;
          letter-spacing: -0.03em;
        }

        .sidebar__logo-text {
          font-size: 0.92rem;
          font-weight: 600;
          color: var(--text-active);
          letter-spacing: -0.02em;
          opacity: 1;
          transition: opacity var(--transition);
        }

        .collapsed .sidebar__logo-text { opacity: 0; pointer-events: none; }

        /* Nav */
        .sidebar__nav {
          flex: 1;
          overflow-y: auto;
          overflow-x: hidden;
          padding: 0.75rem 0;
          scrollbar-width: none;
        }
        .sidebar__nav::-webkit-scrollbar { display: none; }

        .sidebar__section { margin-bottom: 0.25rem; }

        .sidebar__section-label {
          font-size: 0.62rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--text-muted);
          padding: 0.5rem 1rem 0.25rem;
          white-space: nowrap;
          overflow: hidden;
          opacity: 1;
          transition: opacity var(--transition);
        }

        .collapsed .sidebar__section-label { opacity: 0; }

        .sidebar__items { list-style: none; }

        .sidebar__link {
          display: flex;
          align-items: center;
          gap: 0.7rem;
          padding: 0.5rem 1rem;
          text-decoration: none;
          color: var(--text-base);
          font-size: 0.84rem;
          font-weight: 500;
          border-radius: 0;
          transition: color 0.15s, background 0.15s;
          white-space: nowrap;
          overflow: hidden;
          position: relative;
          margin: 1px 0.5rem;
          border-radius: 7px;
        }

        .sidebar__link:hover {
          background: var(--hover-bg);
          color: var(--text-active);
        }

        .sidebar__link--active {
          background: var(--active-bg);
          color: var(--accent);
        }

        .sidebar__link--active::before {
          content: '';
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 3px;
          height: 60%;
          background: var(--accent);
          border-radius: 0 3px 3px 0;
        }

        .sidebar__icon {
          font-size: 1rem;
          min-width: 20px;
          text-align: center;
          line-height: 1;
        }

        .sidebar__link-label {
          opacity: 1;
          transition: opacity var(--transition);
        }

        .collapsed .sidebar__link-label { opacity: 0; }

        /* Collapse button */
        .sidebar__footer {
          padding: 0.75rem 0.5rem;
          border-top: 1px solid var(--sidebar-border);
        }

        .sidebar__collapse-btn {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 0.7rem;
          padding: 0.5rem 0.6rem;
          background: none;
          border: none;
          cursor: pointer;
          color: var(--text-muted);
          font-size: 0.82rem;
          font-family: 'Geist', sans-serif;
          border-radius: 7px;
          transition: color 0.15s, background 0.15s;
          white-space: nowrap;
          overflow: hidden;
        }

        .sidebar__collapse-btn:hover {
          color: var(--text-active);
          background: var(--hover-bg);
        }

        .sidebar__collapse-icon {
          min-width: 20px;
          text-align: center;
          font-size: 0.9rem;
          transition: transform var(--transition);
        }

        .collapsed .sidebar__collapse-icon { transform: rotate(180deg); }

        .sidebar__collapse-label {
          opacity: 1;
          transition: opacity var(--transition);
        }

        .collapsed .sidebar__collapse-label { opacity: 0; }

        /* Mobile overlay */
        .sidebar__overlay {
          display: none;
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.6);
          z-index: 49;
        }

        /* Mobile toggle */
        .sidebar__mobile-toggle {
          display: none;
          position: fixed;
          top: 1rem;
          left: 1rem;
          z-index: 60;
          background: var(--sidebar-bg);
          border: 1px solid var(--sidebar-border);
          color: var(--text-active);
          width: 38px;
          height: 38px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 1rem;
          align-items: center;
          justify-content: center;
        }

        /* Tooltip for collapsed icons */
        .sidebar__link {
          position: relative;
        }

        @media (max-width: 768px) {
          .sidebar__mobile-toggle { display: flex; }

          .sidebar {
            position: fixed;
            top: 0; left: 0; bottom: 0;
            transform: translateX(-100%);
            transition: transform var(--transition);
            width: var(--sidebar-width) !important;
            min-width: var(--sidebar-width) !important;
          }

          .sidebar.mobile-open {
            transform: translateX(0);
          }

          .sidebar__overlay.visible { display: block; }

          .sidebar .sidebar__logo-text,
          .sidebar .sidebar__section-label,
          .sidebar .sidebar__link-label,
          .sidebar .sidebar__collapse-label {
            opacity: 1 !important;
          }

          .app-main { padding: 1rem; padding-top: 4rem; }
        }
      `}</style>

      {/* Mobile toggle */}
      <button
        className="sidebar__mobile-toggle"
        onClick={() => setMobileOpen(true)}
        aria-label="Open menu"
      >
        ☰
      </button>

      {/* Overlay */}
      <div
        className={`sidebar__overlay${mobileOpen ? " visible" : ""}`}
        onClick={() => setMobileOpen(false)}
      />

      <aside className={`sidebar${collapsed ? " collapsed" : ""}${mobileOpen ? " mobile-open" : ""}`}>
        {/* Logo */}
        <Link href="/" className="sidebar__logo">
          <span className="sidebar__logo-icon">APP</span>General
          <span className="sidebar__logo-text">MyApp</span>
        </Link>

        {/* Nav sections */}
        <nav className="sidebar__nav">
          {NAV_SECTIONS.map((section) => (
            <div key={section.label} className="sidebar__section">
              <div className="sidebar__section-label">{section.label}</div>
              <ul className="sidebar__items">
                {section.items.map(({ label, href, icon }) => {
                  const active = pathname === href;
                  return (
                    <li key={href}>
                      <Link
                        href={href}
                        className={`sidebar__link${active ? " sidebar__link--active" : ""}`}
                        onClick={() => setMobileOpen(false)}
                        title={collapsed ? label : undefined}
                      >
                        <span className="sidebar__icon">{icon}</span>
                        <span className="sidebar__link-label">{label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* Footer / Collapse */}
        <div className="sidebar__footer">
          <button
            className="sidebar__collapse-btn"
            onClick={() => setCollapsed((v) => !v)}
            aria-label="Toggle sidebar"
          >
            <span className="sidebar__collapse-icon">«</span>
            <span className="sidebar__collapse-label">Collapse</span>
          </button>
        </div>
      </aside>
    </>
  );
}