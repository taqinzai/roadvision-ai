import { useEffect, useState } from "react";
import axios from "axios";
import AppShell from "../components/AppShell";
import Icon from "../components/Icon";

export default function Detection() {
  const [potholes, setPotholes] = useState([]);
  const [search, setSearch] = useState("");
  const [filterSeverity, setFilterSeverity] = useState("All");
  const [selectedPothole, setSelectedPothole] = useState(null);
  const [editedStatus, setEditedStatus] = useState("");

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

  const filteredPotholes = [...potholes].sort((a, b) => new Date(b.detected_time) - new Date(a.detected_time)).filter((pothole) => {
    const searchText = search.trim();
    const isNumeric = /^\d+$/.test(searchText);
    const matchSearch = searchText === "" || (isNumeric
      ? pothole.id.toString().includes(searchText)
      : pothole.location_name?.toLowerCase().includes(searchText.toLowerCase()));
    const matchSeverity = filterSeverity === "All" || pothole.severity === filterSeverity;
    return matchSearch && matchSeverity;
  });

  const updateStatus = async (id, status) => {
    try {
      await fetch(`http://127.0.0.1:8000/update-status/${id}`, {
        method: "PUT",
        body: new URLSearchParams({ status }),
      });
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  };

  const deletePothole = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this pothole record?"
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://127.0.0.1:8000/delete-pothole/${id}`, {
        method: "DELETE",
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to delete pothole record");
      }

      console.log(data.message);
      setPotholes((currentPotholes) =>
        currentPotholes.filter((pothole) => pothole.id !== id)
      );
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  const imageUrl = (pothole) => `http://100.91.123.26:8000/uploads/${pothole.image_url}`;

  return (
    <>
      <AppShell
        title="Live Detection"
        eyebrow="Computer Vision Operations"
        actions={<div className="live-badge"><span />AI Engine Active</div>}
      >
        <div className="page-intro">
          <p>Review incoming road damage events, inspect AI captures, and coordinate response status.</p>
          <span>{filteredPotholes.length} detections shown</span>
        </div>

        <section className="filter-bar">
          <label className="search-field"><Icon name="search" /><input type="text" placeholder="Search location or pothole ID..." value={search} onChange={(e) => setSearch(e.target.value)} /></label>
          <label className="select-field"><Icon name="filter" /><select value={filterSeverity} onChange={(e) => setFilterSeverity(e.target.value)}><option>All</option><option>Critical</option><option>Moderate</option><option>Minor</option></select></label>
        </section>

        <section className="detection-grid">
          {filteredPotholes.map((pothole) => (
            <article className="detection-card" key={pothole.id}>
              <div className="detection-image">
                <img src={imageUrl(pothole)} alt={`Road damage at ${pothole.location_name}`} />
                <span className="camera-label"><i />AI CAPTURE</span>
                <span className={`severity severity-${pothole.severity?.toLowerCase()}`}><i />{pothole.severity}</span>
                <div className="focus-corners" aria-hidden="true" />
              </div>
              <div className="detection-body">
                <div className="detection-id"><span>Detection</span><strong>RV-{String(pothole.id).padStart(4, "0")}</strong></div>
                <h2>{pothole.location_name}</h2>
                <div className="detection-meta">
                  <span><Icon name="clock" size={15} />{new Date(pothole.detected_time).toLocaleString()}</span>
                  <span className={`status status-${pothole.status?.toLowerCase().replace(" ", "-")}`}>{pothole.status}</span>
                </div>
                <div className="detection-actions">
                  <button className="primary-button" onClick={() => { setSelectedPothole(pothole); setEditedStatus(pothole.status); }}>
                    Analyze Detection <Icon name="arrow" size={17} />
                  </button>
                  <button className="delete-button" onClick={() => deletePothole(pothole.id)}>
                    Delete
                  </button>
                </div>
              </div>
            </article>
          ))}
        </section>
        {!filteredPotholes.length && <div className="empty-state panel"><Icon name="search" size={30} /><p>No detections match the current filters.</p></div>}
      </AppShell>

      {selectedPothole && (
        <div className="modal-backdrop" role="presentation" onMouseDown={(e) => { if (e.target === e.currentTarget) setSelectedPothole(null); }}>
          <section className="analysis-modal" role="dialog" aria-modal="true" aria-labelledby="detection-title">
            <div className="modal-header">
              <div><p className="section-kicker">AI Analysis Record</p><h2 id="detection-title">Detection RV-{String(selectedPothole.id).padStart(4, "0")}</h2></div>
              <button className="icon-button" onClick={() => setSelectedPothole(null)} aria-label="Close details"><Icon name="close" /></button>
            </div>
            <div className="analysis-layout">
              <div className="analysis-visual">
                <div className="camera-frame">
                  <img src={imageUrl(selectedPothole)} alt={`Pothole at ${selectedPothole.location_name}`} />
                  <div className="focus-corners" />
                  <span className="camera-label"><i />CAPTURE VERIFIED</span>
                </div>
                <p><Icon name="location" size={17} />{selectedPothole.location_name}</p>
              </div>
              <div className="analysis-info">
                <div className="analysis-title"><span className="stat-icon"><Icon name="detection" /></span><div><small>Current Detection</small><strong>{selectedPothole.severity} road damage</strong></div></div>
                <dl>
                  <div><dt>Severity Level</dt><dd><span className={`severity severity-${selectedPothole.severity?.toLowerCase()}`}><i />{selectedPothole.severity}</span></dd></div>
                  <div><dt>GPS Latitude</dt><dd>{selectedPothole.latitude}</dd></div>
                  <div><dt>GPS Longitude</dt><dd>{selectedPothole.longitude}</dd></div>
                  <div><dt>Detection Timestamp</dt><dd>{new Date(selectedPothole.detected_time).toLocaleString()}</dd></div>
                </dl>
                <label className="status-control">Response Status<select value={editedStatus} onChange={(e) => setEditedStatus(e.target.value)}><option value="Pending">Pending</option><option value="In Progress">In Progress</option><option value="Resolved">Resolved</option></select></label>
                <div className="modal-actions">
                  <button className="primary-button" onClick={() => { updateStatus(selectedPothole.id, editedStatus); setSelectedPothole({ ...selectedPothole, status: editedStatus }); }}>Save Status</button>
                  <button className="secondary-button" onClick={() => setSelectedPothole(null)}>Close</button>
                </div>
              </div>
            </div>
          </section>
        </div>
      )}
    </>
  );
}
