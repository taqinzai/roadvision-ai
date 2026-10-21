import { useEffect, useState } from "react";
import axios from "axios";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import "leaflet/dist/leaflet.css";
import AppShell from "../components/AppShell";
import Icon from "../components/Icon";

const markerBase = { shadowUrl: markerShadow, iconSize: [25, 41], iconAnchor: [12, 41] };
const criticalIcon = new L.Icon({ ...markerBase, iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png" });
const moderateIcon = new L.Icon({ ...markerBase, iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-yellow.png" });
const minorIcon = new L.Icon({ ...markerBase, iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png" });

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({ iconRetinaUrl: markerIcon2x, iconUrl: markerIcon, shadowUrl: markerShadow });

export default function GPSMap() {
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

  const getMarkerIcon = (severity) => severity === "Critical" ? criticalIcon : severity === "Moderate" ? moderateIcon : minorIcon;
  const count = (severity) => potholes.filter((p) => p.severity === severity).length;

  return (
    <AppShell
      title="GPS Monitoring"
      eyebrow="Geospatial Intelligence"
      actions={<div className="live-badge"><span />GPS Connected</div>}
    >
      <div className="page-intro">
        <p>Real-time geographic tracking of every detected road damage event.</p>
        <span>{potholes.length} active markers</span>
      </div>
      <section className="map-panel">
        <MapContainer center={[3.0738, 101.5183]} zoom={11} style={{ height: "100%", width: "100%" }}>
          <TileLayer attribution="&copy; OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {potholes.map((pothole) => (
            <Marker key={pothole.id} position={[pothole.latitude, pothole.longitude]} icon={getMarkerIcon(pothole.severity)}>
              <Popup>
                <div className="map-popup">
                  <img src={`http://100.91.123.26:8000/uploads/${pothole.image_url}`} alt="Pothole" />
                  <small>ROADVISION DETECTION</small>
                  <h2>RV-{String(pothole.id).padStart(4, "0")}</h2>
                  <p className="popup-location"><Icon name="location" size={15} />{pothole.location_name}</p>
                  <div><span className={`severity severity-${pothole.severity?.toLowerCase()}`}><i />{pothole.severity}</span><span className={`status status-${pothole.status?.toLowerCase().replace(" ", "-")}`}>{pothole.status}</span></div>
                  <p className="coordinates">{pothole.latitude}, {pothole.longitude}</p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        <div className="map-stats">
          <div className="map-stats-head"><span><Icon name="map" />Network Overview</span><b>LIVE</b></div>
          <div className="map-total"><strong>{potholes.length}</strong><span>Total Potholes<small>Across monitored zones</small></span></div>
          <div className="map-severity-row"><span className="critical-dot" /><div><b>{count("Critical")}</b><small>Critical</small></div></div>
          <div className="map-severity-row"><span className="moderate-dot" /><div><b>{count("Moderate")}</b><small>Moderate</small></div></div>
          <div className="map-severity-row"><span className="minor-dot" /><div><b>{count("Minor")}</b><small>Minor</small></div></div>
        </div>
      </section>
    </AppShell>
  );
}
