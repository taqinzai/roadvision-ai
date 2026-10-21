import { BrowserRouter, Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Detection from "./pages/Detection";
import GPSMap from "./pages/GPSMap";
import Analytics from "./pages/Analytics";
import Login from "./pages/Login";
import ProtectedRoute from "./routes/ProtectedRoute";

export default function App() {
  return (
    <BrowserRouter>

      <Routes>

            <Route
      path="/"
      element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      }
    />

            <Route
      path="/detection"
      element={
        <ProtectedRoute>
          <Detection />
        </ProtectedRoute>
      }
    />

            <Route
      path="/gps-map"
      element={
        <ProtectedRoute>
          <GPSMap />
        </ProtectedRoute>
      }
    />

            <Route
      path="/analytics"
      element={
        <ProtectedRoute>
          <Analytics />
        </ProtectedRoute>
      }
    />

        <Route path="/login" element={<Login />} />

      </Routes>

    </BrowserRouter>
  );
}