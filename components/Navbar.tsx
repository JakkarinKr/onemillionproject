// components/Navbar.tsx
"use client";
 
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
 
const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Items", href: "/items" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "About", href: "/about" },
];
 
export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
 
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700&family=Manrope:wght@400;500&display=swap');
 
        :root {
          --nav-bg: #0c0c0e;
          --nav-border: rgba(255,255,255,0.07);
          --nav-text: rgba(255,255,255,0.55);
          --nav-active: #f0f0f0;
          --nav-accent: #e8ff47;
          --nav-hover-bg: rgba(255,255,255,0.05);
          --nav-height: 60px;
        }
 
        * { box-sizing: border-box; margin: 0; padding: 0; }
 
        body {
          background: #0f0f11;
          color: #e0e0e0;
          font-family: 'Manrope', sans-serif;
        }
 
        .navbar {
          position: sticky;
          top: 0;
          z-index: 100;
          height: var(--nav-height);
          background: var(--nav-bg);
          border-bottom: 1px solid var(--nav-border);
          backdrop-filter: blur(12px);
          display: flex;
          align-items: center;
          padding: 0 1.5rem;
          gap: 2rem;
        }
 
        .navbar__logo {
          font-family: 'Syne', sans-serif;
          font-size: 1.15rem;
          font-weight: 700;
          color: var(--nav-active);
          text-decoration: none;
          letter-spacing: -0.02em;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          white-space: nowrap;
        }
 
        .navbar__logo-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: var(--nav-accent);
          display: inline-block;
        }
 
        .navbar__links {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          flex: 1;
          list-style: none;
        }
 
        .navbar__link {
          text-decoration: none;
          color: var(--nav-text);
          font-size: 0.83rem;
          font-weight: 500;
          padding: 0.4rem 0.75rem;
          border-radius: 6px;
          transition: color 0.15s, background 0.15s;
          letter-spacing: 0.01em;
          position: relative;
        }
 
        .navbar__link:hover {
          color: var(--nav-active);
          background: var(--nav-hover-bg);
        }
 
        .navbar__link--active {
          color: var(--nav-active);
        }
 
        .navbar__link--active::after {
          content: '';
          position: absolute;
          bottom: -1px;
          left: 50%;
          transform: translateX(-50%);
          width: 16px;
          height: 2px;
          background: var(--nav-accent);
          border-radius: 2px;
        }
 
        .navbar__end {
          margin-left: auto;
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
 
        .navbar__cta {
          background: var(--nav-accent);
          color: #0c0c0e;
          font-size: 0.78rem;
          font-weight: 700;
          font-family: 'Syne', sans-serif;
          padding: 0.4rem 1rem;
          border-radius: 6px;
          text-decoration: none;
          letter-spacing: 0.02em;
          transition: opacity 0.15s;
        }
 
        .navbar__cta:hover { opacity: 0.85; }
 
        /* Hamburger */
        .navbar__hamburger {
          display: none;
          flex-direction: column;
          gap: 4px;
          cursor: pointer;
          padding: 4px;
          background: none;
          border: none;
          margin-left: auto;
        }
 
        .navbar__hamburger span {
          display: block;
          width: 22px;
          height: 2px;
          background: var(--nav-active);
          border-radius: 2px;
          transition: transform 0.2s, opacity 0.2s;
        }
 
        .navbar__hamburger--open span:nth-child(1) { transform: translateY(6px) rotate(45deg); }
        .navbar__hamburger--open span:nth-child(2) { opacity: 0; }
        .navbar__hamburger--open span:nth-child(3) { transform: translateY(-6px) rotate(-45deg); }
 
        /* Mobile menu */
        .navbar__mobile {
          display: none;
          position: fixed;
          top: var(--nav-height);
          left: 0; right: 0;
          background: var(--nav-bg);
          border-bottom: 1px solid var(--nav-border);
          padding: 1rem 1.5rem 1.5rem;
          flex-direction: column;
          gap: 0.25rem;
          z-index: 99;
        }
 
        .navbar__mobile.open { display: flex; }
 
        .navbar__mobile-link {
          text-decoration: none;
          color: var(--nav-text);
          font-size: 0.9rem;
          font-weight: 500;
          padding: 0.65rem 0.75rem;
          border-radius: 6px;
          transition: color 0.15s, background 0.15s;
        }
 
        .navbar__mobile-link:hover,
        .navbar__mobile-link--active {
          color: var(--nav-active);
          background: var(--nav-hover-bg);
        }
 
        .navbar__mobile-cta {
          margin-top: 0.5rem;
          display: block;
          text-align: center;
          background: var(--nav-accent);
          color: #0c0c0e;
          font-size: 0.83rem;
          font-weight: 700;
          font-family: 'Syne', sans-serif;
          padding: 0.6rem 1rem;
          border-radius: 6px;
          text-decoration: none;
        }
 
        @media (max-width: 640px) {
          .navbar__links,
          .navbar__end { display: none; }
          .navbar__hamburger { display: flex; }
        }
 
        main {
          padding: 2rem 1.5rem;
          max-width: 1100px;
          margin: 0 auto;
        }
      `}</style>
 
      <nav className="navbar">
        <Link href="/" className="navbar__logo">
          <span className="navbar__logo-dot" />
          MyApp
        </Link>
 
        <ul className="navbar__links">
          {NAV_LINKS.map(({ label, href }) => (
            <li key={href}>
              <Link
                href={href}
                className={`navbar__link${pathname === href ? " navbar__link--active" : ""}`}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
 
        <div className="navbar__end">
          <Link href="/login" className="navbar__cta">Sign in →</Link>
        </div>
 
        <button
          className={`navbar__hamburger${menuOpen ? " navbar__hamburger--open" : ""}`}
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          <span /><span /><span />
        </button>
      </nav>
 
      {/* Mobile menu */}
      <div className={`navbar__mobile${menuOpen ? " open" : ""}`}>
        {NAV_LINKS.map(({ label, href }) => (
          <Link
            key={href}
            href={href}
            className={`navbar__mobile-link${pathname === href ? " navbar__mobile-link--active" : ""}`}
            onClick={() => setMenuOpen(false)}
          >
            {label}
          </Link>
        ))}
        <Link href="/login" className="navbar__mobile-cta" onClick={() => setMenuOpen(false)}>
          Sign in →
        </Link>
      </div>
    </>
  );
}
 