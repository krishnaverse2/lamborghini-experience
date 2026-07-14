"use client";

import { useState } from "react";

const navigationItems = [
  { label: "Design", href: "#design" },
  { label: "Performance", href: "#performance" },
  { label: "Technology", href: "#technology" },
];

export default function Navigation() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="site-header">
      <a
        href="#top"
        className="brand-mark"
        aria-label="Revuelto home"
      >
        <span className="brand-mark__symbol">R</span>

        <span className="brand-mark__copy">
          <strong>REVUELTO</strong>
          <small>Digital Experience</small>
        </span>
      </a>

      <nav
        className={`desktop-navigation ${
          menuOpen ? "desktop-navigation--open" : ""
        }`}
        aria-label="Primary navigation"
      >
        {navigationItems.map((item, index) => (
          <a
            key={item.label}
            href={item.href}
            onClick={() => setMenuOpen(false)}
          >
            <span>
              {(index + 1).toString().padStart(2, "0")}
            </span>

            {item.label}
          </a>
        ))}
      </nav>

      <div className="header-actions">
        <button
          type="button"
          className="sound-button"
          aria-label="Sound is currently disabled"
        >
          <span className="sound-button__dot" />
          Sound off
        </button>

        <button
          type="button"
          className="menu-button"
          aria-expanded={menuOpen}
          aria-label="Toggle navigation"
          onClick={() => setMenuOpen((current) => !current)}
        >
          <span />
          <span />
        </button>
      </div>
    </header>
  );
}