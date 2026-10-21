import { useEffect, useState } from "react";
import axios from "axios";
import AppShell from "../components/AppShell";
import Icon from "../components/Icon";

export default function Dashboard() {
  const [potholes, setPotholes] = useState([]);

  useEffect(() => {
    const fetchData = () => {
      axios.get("http://127.0.0.1:8000/potholes")
        .then((response) => setPotholes(response.data))
        .catch((error) => console.error(error));
    };
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const counts = {
    pending: potholes.filter((p) => p.status === "Pending").length,
    progress: potholes.filter((p) => p.status === "In Progress").length,
    resolved: potholes.filter((p) => p.status === "Resolved").length,
  };

  const stats = [
    { label: "Total Detections", value: potholes.length, icon: "detection", tone: "cyan", note: "All recorded events" },
    { label: "Pending Review", value: counts.pending, icon: "clock", tone: "amber", note: "Awaiting assessment" },
    { label: "In Progress", value: counts.progress, icon: "activity", tone: "blue", note: "Active operations" },
    { label: "Resolved", value: counts.resolved, icon: "check", tone: "green", note: "Successfully completed" },
  ];

  return (
    <AppShell
      title="RoadVision AI"
      eyebrow="AI Road Intelligence"
      actions={<div className="live-badge"><span />Live AI Analysis</div>}
    >
      <section className="hero-panel">
        <div className="hero-copy">
          <div className="hero-kicker"><Icon name="activity" size={16} />Autonomous vision network operational</div>
          <h2>See road damage.<br /><span>Act before impact.</span></h2>
          <p>Real-Time AI-Powered Road Damage Detection System</p>
          <div className="hero-meta">
            <span><i className="status-dot" />All systems nominal</span>
            <span>5 sec refresh cycle</span>
          </div>
        </div>
        <div className="hero-visual" aria-hidden="true">
          <div className="radar-ring ring-one" />
          <div className="radar-ring ring-two" />
          <div className="radar-core"><Icon name="detection" size={38} /></div>
          <span className="scan-node node-one" />
          <span className="scan-node node-two" />
          <span className="scan-node node-three" />
        </div>
      </section>

      <div className="telemetry-banner" aria-label="RoadVision live system telemetry">
        <div className="telemetry-label"><span />RoadVision Live</div>
        <div className="telemetry-window">
          <div className="telemetry-track">
            {[0, 1].map((copy) => (
              <div className="telemetry-group" key={copy} aria-hidden={copy === 1}>
                <span><b>AI VISION</b> Scanning road surface</span>
                <i />
                <span><b>GPS</b> Location stream synchronized</span>
                <i />
                <span><b>NETWORK</b> Raspberry Pi online</span>
                <i />
                <span><b>DETECTIONS</b> {potholes.length} events recorded</span>
                <i />
                <span><b>REFRESH</b> Live data every 5 seconds</span>
                <i />
              </div>
            ))}
          </div>
        </div>
      </div>

      <section className="stats-grid" aria-label="Detection statistics">
        {stats.map((stat) => (
          <article className={`stat-card tone-${stat.tone}`} key={stat.label}>
            <div className="stat-card-top">
              <span className="stat-icon"><Icon name={stat.icon} /></span>
              <span className="stat-trend">REAL TIME</span>
            </div>
            <strong>{stat.value.toString().padStart(2, "0")}</strong>
            <h3>{stat.label}</h3>
            <p>{stat.note}</p>
          </article>
        ))}
      </section>

      <section className="panel">
        <div className="panel-header">
          <div>
            <p className="section-kicker">Streaming data</p>
            <h2>Live Detection Feed</h2>
          </div>
          <div className="feed-status"><span />Auto-refreshing</div>
        </div>

        <div className="data-table-wrap">
          <table className="data-table">
            <thead><tr><th>Pothole ID</th><th>GPS Location</th><th>Severity</th><th>Detection Time</th><th>Status</th></tr></thead>
            <tbody>
              {[...potholes].sort((a, b) => new Date(b.detected_time) - new Date(a.detected_time)).map((pothole, index) => (
                <tr key={pothole.id} className={index === 0 ? "new-detection" : ""}>
                  <td><span className="id-cell">RV-{String(pothole.id).padStart(4, "0")}</span></td>
                  <td><span className="location-cell"><Icon name="location" size={16} />{pothole.location_name}</span></td>
                  <td><span className={`severity severity-${pothole.severity?.toLowerCase()}`}><i />{pothole.severity}</span></td>
                  <td>{new Date(pothole.detected_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</td>
                  <td><span className={`status status-${pothole.status?.toLowerCase().replace(" ", "-")}`}>{pothole.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
          {!potholes.length && <div className="empty-state"><Icon name="activity" size={28} /><p>Waiting for detection data...</p></div>}
        </div>
      </section>
    </AppShell>
  );
}
