import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "../components/Icon";
import ThemeToggle from "../components/ThemeToggle";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    if (email === "admin@smartroad.com" && password === "admin123") {
      localStorage.setItem("isLoggedIn", "true");
      navigate("/");
    } else {
      alert("Invalid email or password");
    }
  };

  return (
    <main className="login-page">
      <div className="login-theme-control"><ThemeToggle /></div>
      <div className="ambient-grid" />
      <div className="login-bg-scene" aria-hidden="true">
        <span className="login-road road-left" />
        <span className="login-road road-right" />
        <span className="login-scan-line" />
        <span className="login-target target-one" />
        <span className="login-target target-two" />
        <span className="login-camera-node" />
      </div>
      <section className="login-brand-panel">
        <div className="brand login-brand"><span className="brand-mark">RV</span><div><strong>RoadVision</strong><span>AI MONITORING</span></div></div>
        <div className="login-message">
          <p className="eyebrow">AI-Powered Infrastructure</p>
          <h1>Road intelligence.<br /><span>Reimagined.</span></h1>
          <p>
            RoadVision AI helps monitoring teams detect potholes in real time using camera vision,
            GPS coordinates, and live backend data from the field.
          </p>
          <div className="login-feature-grid">
            <span><Icon name="detection" size={16} />AI pothole detection</span>
            <span><Icon name="map" size={16} />GPS damage mapping</span>
            <span><Icon name="activity" size={16} />Live status monitoring</span>
          </div>
          <div className="login-mini-banner" aria-label="RoadVision login telemetry">
            <div className="login-mini-track">
              {[0, 1].map((copy) => (
                <div className="login-mini-group" key={copy} aria-hidden={copy === 1}>
                  <span>Camera feed active</span>
                  <i />
                  <span>AI model scanning</span>
                  <i />
                  <span>GPS stream ready</span>
                  <i />
                  <span>Road damage alerts online</span>
                  <i />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="login-network"><span><i />Computer Vision</span><span><i />GPS Tracking</span><span><i />Live Response</span></div>
      </section>
      <section className="login-form-panel">
        <form className="login-card" onSubmit={handleLogin}>
          <div className="login-mobile-brand"><span className="brand-mark">RV</span>RoadVision AI</div>
          <p className="section-kicker">Secure Operations Portal</p>
          <h2>Welcome back</h2>
          <p className="login-subtitle">Sign in to access the RoadVision command center.</p>
          <label>Email address<input type="email" placeholder="admin@smartroad.com" value={email} onChange={(e) => setEmail(e.target.value)} required /></label>
          <label>Password<input type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} required /></label>
          <button className="login-button">Access Command Center <Icon name="arrow" size={18} /></button>
          <div className="secure-note"><Icon name="check" size={16} />Protected by RoadVision secure authentication</div>
        </form>
      </section>
    </main>
  );
}
