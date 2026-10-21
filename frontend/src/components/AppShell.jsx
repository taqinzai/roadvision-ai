import { useState } from "react";
import Sidebar from "./Sidebar";
import Icon from "./Icon";
import ThemeToggle from "./ThemeToggle";

export default function AppShell({ children, title, eyebrow = "Road Intelligence Center", actions }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="app-shell">
      <div className="ambient-grid" aria-hidden="true" />
      <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />
      {menuOpen && <button className="sidebar-backdrop" aria-label="Close navigation" onClick={() => setMenuOpen(false)} />}

      <main className="main-content">
        <header className="mobile-header">
          <button className="icon-button" onClick={() => setMenuOpen(true)} aria-label="Open navigation">
            <Icon name="menu" />
          </button>
          <div className="mobile-brand"><span className="brand-mark small">RV</span>RoadVision AI</div>
          <ThemeToggle />
        </header>

        <div className="page-container">
          <div className="page-heading">
            <div>
              <p className="eyebrow">{eyebrow}</p>
              <h1>{title}</h1>
            </div>
            <div className="page-actions">
              {actions}
              <ThemeToggle />
            </div>
          </div>
          {children}
        </div>
      </main>
    </div>
  );
}
