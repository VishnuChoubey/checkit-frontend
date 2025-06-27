import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { motion } from "framer-motion";
import axios from "axios";

const DriverDashboard = () => {
  const location = useLocation();
  const email = location.state?.email || ""; // Retrieve email from state

  const [driver, setDriver] = useState(null); // Driver information
  const [busLocation, setBusLocation] = useState([28.6139, 77.2090]); // Default bus location
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  // Fetch driver information using email
  useEffect(() => {
    const fetchDriverInfo = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:8080/api/drivers?email=${email}`);
        setDriver(response.data); // Assuming the API returns driver details
        setLoading(false);
      } catch (err) {
        console.error("Error fetching driver info:", err);
        setError("Failed to load driver information.");
        setLoading(false);
      }
    };

    if (email) {
      fetchDriverInfo();
    } else {
      setError("Email not provided.");
      setLoading(false);
    }
  }, [email]);

  // Simulate live bus location updates
  useEffect(() => {
    const interval = setInterval(() => {
      setBusLocation((prev) => [
        prev[0] + (Math.random() - 0.5) * 0.001,
        prev[1] + (Math.random() - 0.5) * 0.001,
      ]);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <motion.div
        initial={{ x: -200, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-64 bg-gray-800 p-5 flex flex-col"
      >
        <h2 className="text-xl font-bold">Bus Driver Dashboard</h2>
        <nav className="mt-5 space-y-4">
          {["My Trips", "Schedules", "Settings"].map((item, index) => (
            <motion.a
              key={index}
              href="#"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="block p-2 rounded bg-gray-700 hover:bg-gray-600 transition"
            >
              {item}
            </motion.a>
          ))}
        </nav>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        {/* Driver Info */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-6 p-4 bg-gray-800 rounded-lg shadow"
        >
          <h3 className="text-lg font-semibold">Welcome, {driver?.name || "Driver"}</h3>
          <p>Assigned Route: {driver?.route || "N/A"}</p>
          <p>Next Trip: {driver?.nextTrip || "N/A"}</p>
          <p>Email: {driver?.email || "N/A"}</p>
          <p>Phone: {driver?.phone || "N/A"}</p>
        </motion.div>

        {/* Live Bus Tracking */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="h-96 bg-gray-800 rounded-lg overflow-hidden shadow"
        >
          <MapContainer center={busLocation} zoom={13} style={{ height: "100%", width: "100%" }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker position={busLocation}>
              <Popup>Live Bus Location</Popup>
            </Marker>
          </MapContainer>
        </motion.div>
      </div>
    </div>
  );
};

export default DriverDashboard;