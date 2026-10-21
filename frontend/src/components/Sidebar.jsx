import { Link, useLocation } from "react-router-dom";
import Icon from "./Icon";

export default function Sidebar({ open = false, onClose }) {
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard", path: "/", icon: "dashboard" },
    { name: "Live Detection", path: "/detection", icon: "detection" },
    { name: "GPS Monitoring", path: "/gps-map", icon: "map" },
    { name: "Analytics", path: "/analytics", icon: "analytics" },
  ];

  return (
    <aside className={`sidebar ${open ? "is-open" : ""}`}>
      <div className="sidebar-hardware-art" aria-hidden="true">
        <div className="pi-board">
          <span className="pi-chip">AI</span>
          <span className="pi-port port-one" />
          <span className="pi-port port-two" />
          <span className="pi-pin-row" />
          <span className="pi-trace trace-one" />
          <span className="pi-trace trace-two" />
        </div>
        <div className="ai-camera">
          <span className="camera-lens"><i /></span>
          <span className="camera-ribbon" />
        </div>
        <div className="road-scan">
          <span className="road-line road-line-one" />
          <span className="road-line road-line-two" />
          <span className="pothole-target"><i /><i /><i /><i /></span>
          <span className="scan-beam" />
        </div>
        <span className="hardware-link link-one" />
        <span className="hardware-link link-two" />
      </div>

      <div className="sidebar-top">
        <div className="brand">
          <span className="brand-mark">RV</span>
          <div><strong>RoadVision</strong><span>AI MONITORING</span></div>
        </div>
        <button className="sidebar-close" onClick={onClose} aria-label="Close navigation"><Icon name="close" /></button>
      </div>

      <p className="nav-label">Command Center</p>
      <nav className="nav-list" aria-label="Primary navigation">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            onClick={onClose}
            className={`nav-item ${location.pathname === item.path ? "active" : ""}`}
          >
            <Icon name={item.icon} />
            {item.name}
            {location.pathname === item.path && <span className="nav-active-dot" />}
          </Link>
        ))}
      </nav>

      <div className="sidebar-spacer" />
      <div className="system-panel">
        <div className="system-panel-title"><span>System Network</span><span className="live-label">LIVE</span></div>
        <div className="system-row"><Icon name="server" /><span>FastAPI</span><b><i />Connected</b></div>
        <div className="system-row"><Icon name="database" /><span>Database</span><b><i />Connected</b></div>
        <div className="system-row"><Icon name="cpu" /><span>Raspberry Pi</span><b><i />Online</b></div>
      </div>

      <button
        onClick={() => {
          localStorage.removeItem("isLoggedIn");
          window.location.href = "/login";
        }}
        className="logout-button"
      >
        <Icon name="logout" />
        Logout
      </button>
      <div className="sidebar-footer">RoadVision Core v2.4</div>
    </aside>
  );
}
