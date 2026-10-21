import "./MapFix";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function MapComponent() {

  const potholes = [
    {
      id: 1,
      location: "Shah Alam",
      severity: "Critical",
      position: [3.0738, 101.5183],
    },

    {
      id: 2,
      location: "Klang",
      severity: "Moderate",
      position: [3.0333, 101.45],
    },
  ];

  return (
    <MapContainer
      center={[3.0738, 101.5183]}
      zoom={11}
      style={{
        height: "100%",
        width: "100%",
        borderRadius: "20px",
      }}
    >
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {potholes.map((pothole) => (
        <Marker key={pothole.id} position={pothole.position}>
          
          <Popup>
        
             <div style={{ width: "200px" }}>

               <img
                 src="/src/assets/pothole1.png"
                 alt="Pothole"
                 style={{
                   width: "100%",
                   borderRadius: "10px",
                   marginBottom: "10px",
                 }}
              />

              <h2
                style={{
                  fontWeight: "bold",
                  fontSize: "18px",
                }}
              >
                {pothole.location}
              </h2>

              <p>
                Severity: {pothole.severity}
              </p>

            </div>

          </Popup>

        </Marker>
      ))}
    </MapContainer>
  );
}