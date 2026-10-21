import { useEffect, useState } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, CartesianGrid } from "recharts";
import AppShell from "../components/AppShell";
import Icon from "../components/Icon";

const monthlyData = [
  { month: "Jan", potholes: 12 }, { month: "Feb", potholes: 19 },
  { month: "Mar", potholes: 8 }, { month: "Apr", potholes: 25 }, { month: "May", potholes: 15 },
];
const severityColors = ["#ef4444", "#f59e0b", "#3b82f6"];
const statusColors = ["#f59e0b", "#3b82f6", "#22c55e"];
const tooltipStyle = { background: "#111a2d", border: "1px solid rgba(148,163,184,.2)", borderRadius: "12px", color: "#fff" };

function ChartCard({ title, eyebrow, icon, children, wide = false }) {
  return <section className={`chart-card ${wide ? "chart-wide" : ""}`}><div className="chart-header"><span className="chart-icon"><Icon name={icon} /></span><div><p>{eyebrow}</p><h2>{title}</h2></div></div>{children}</section>;
}

export default function Analytics() {
  const [potholes, setPotholes] = useState([]);

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/potholes").then((response) => setPotholes(response.data)).catch((error) => console.error(error));
  }, []);

  const severityData = ["Critical", "Moderate", "Minor"].map((name) => ({ name, value: potholes.filter((p) => p.severity === name).length }));
  const statusData = ["Pending", "In Progress", "Resolved"].map((name) => ({ name, value: potholes.filter((p) => p.status === name).length }));
  const locationCounts = {};
  potholes.forEach((pothole) => {
    const location = pothole.location_name || "Unknown";
    locationCounts[location] = (locationCounts[location] || 0) + 1;
  });
  const topLocations = Object.entries(locationCounts).map(([location, count]) => ({ location, count })).sort((a, b) => b.count - a.count).slice(0, 5);
  const matrixData = ["Critical", "Moderate", "Minor"].map((severity) => ({
    severity,
    pending: potholes.filter((p) => p.severity === severity && p.status === "Pending").length,
    progress: potholes.filter((p) => p.severity === severity && p.status === "In Progress").length,
    resolved: potholes.filter((p) => p.severity === severity && p.status === "Resolved").length,
  }));

  return (
    <AppShell title="Analytics" eyebrow="Operational Intelligence" actions={<div className="live-badge neutral"><Icon name="analytics" size={15} />Data Insights</div>}>
      <div className="page-intro"><p>Explore detection patterns, severity mix, response progress, and high-frequency locations.</p><span>{potholes.length} records analyzed</span></div>
      <div className="analytics-grid">
        <ChartCard title="Severity Distribution" eyebrow="Risk profile" icon="alert">
          <ResponsiveContainer width="100%" height={280}><PieChart><Pie data={severityData} dataKey="value" nameKey="name" innerRadius={65} outerRadius={96} paddingAngle={4}>{severityData.map((entry, index) => <Cell key={entry.name} fill={severityColors[index]} stroke="transparent" />)}</Pie><Tooltip contentStyle={tooltipStyle} /></PieChart></ResponsiveContainer>
          <div className="chart-legend">{severityData.map((item, index) => <span key={item.name}><i style={{ background: severityColors[index] }} />{item.name}<b>{item.value}</b></span>)}</div>
        </ChartCard>

        <ChartCard title="Response Status" eyebrow="Operations progress" icon="activity">
          <ResponsiveContainer width="100%" height={280}><PieChart><Pie data={statusData} dataKey="value" nameKey="name" innerRadius={65} outerRadius={96} paddingAngle={4}>{statusData.map((entry, index) => <Cell key={entry.name} fill={statusColors[index]} stroke="transparent" />)}</Pie><Tooltip contentStyle={tooltipStyle} /></PieChart></ResponsiveContainer>
          <div className="chart-legend">{statusData.map((item, index) => <span key={item.name}><i style={{ background: statusColors[index] }} />{item.name}<b>{item.value}</b></span>)}</div>
        </ChartCard>

        <ChartCard title="Monthly Detection Overview" eyebrow="Volume trend" icon="analytics">
          <ResponsiveContainer width="100%" height={300}><BarChart data={monthlyData}><CartesianGrid stroke="rgba(148,163,184,.08)" vertical={false} /><XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#718096" }} /><YAxis axisLine={false} tickLine={false} tick={{ fill: "#718096" }} /><Tooltip contentStyle={tooltipStyle} cursor={{ fill: "rgba(246,201,69,.05)" }} /><Bar dataKey="potholes" fill="#f6c945" radius={[7, 7, 0, 0]} /></BarChart></ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Top Detection Locations" eyebrow="Geographic hotspots" icon="location">
          <ResponsiveContainer width="100%" height={300}><BarChart data={topLocations} layout="vertical"><CartesianGrid stroke="rgba(148,163,184,.08)" horizontal={false} /><XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: "#718096" }} /><YAxis type="category" dataKey="location" width={95} axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 11 }} /><Tooltip contentStyle={tooltipStyle} cursor={{ fill: "rgba(54,224,194,.05)" }} /><Bar dataKey="count" fill="#36e0c2" radius={[0, 7, 7, 0]} /></BarChart></ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Severity vs Status Matrix" eyebrow="Response coverage" icon="database" wide>
          <div className="data-table-wrap"><table className="data-table matrix-table"><thead><tr><th>Severity</th><th>Pending</th><th>In Progress</th><th>Resolved</th><th>Total</th></tr></thead><tbody>{matrixData.map((row) => <tr key={row.severity}><td><span className={`severity severity-${row.severity.toLowerCase()}`}><i />{row.severity}</span></td><td>{row.pending}</td><td>{row.progress}</td><td>{row.resolved}</td><td><strong>{row.pending + row.progress + row.resolved}</strong></td></tr>)}</tbody></table></div>
        </ChartCard>
      </div>
    </AppShell>
  );
}
