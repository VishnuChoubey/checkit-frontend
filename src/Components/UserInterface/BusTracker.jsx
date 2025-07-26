import React, { useEffect, useState, useCallback, useRef } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { FaBus, FaMapMarkerAlt, FaClock } from "react-icons/fa";
import { ClipLoader } from "react-spinners";
import Nav from "../Main/Navbar";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const NEAR_STOP_THRESHOLD = 0.05; // 50 meters
const STOP_HIGHLIGHT_THRESHOLD = 0.5; // 500 meters

const BusTracker = () => {
  const location = useLocation();
  const { routeId, sourceStopId, destStopId, busData } = location.state || {};
  const vehicleId = busData?.vehicleId;

  const mapRef = useRef(null);
  const busMarkerRef = useRef(null);
  const stopMarkersRef = useRef([]);
  const routeLineRef = useRef(null);
  const stompClientRef = useRef(null);

  const [stops, setStops] = useState([]);
  const [busLocation, setBusLocation] = useState(null);
  const [currentStopIndex, setCurrentStopIndex] = useState(0);
  const [connectionStatus, setConnectionStatus] = useState("Connecting...");
  const [lastUpdated, setLastUpdated] = useState(null);
  const [eta, setEta] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [osrmError, setOsrmError] = useState("");
  const [wsError, setWsError] = useState("");

  // Calculate distance between two points in km
  const calculateDistance = useCallback((lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }, []);

  // Fetch stops sequence for the route
  useEffect(() => {
    let cancelled = false;
    async function fetchStops() {
      if (!routeId) return;
      setConnectionStatus("Loading stops...");
      setIsLoading(true);
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE}/api/vehicle/by-trip/${routeId}`);
        if (cancelled) return;
        if (response.data && Array.isArray(response.data)) {
          let validStops = response.data
            .filter(stop => stop.latitude && stop.longitude)
            .sort((a, b) => a.stopSequence - b.stopSequence);

          // Reverse if source is after destination
          const sourceIndex = validStops.findIndex(stop => stop.stopId === sourceStopId);
          const destIndex = validStops.findIndex(stop => stop.stopId === destStopId);
          if (sourceIndex !== -1 && destIndex !== -1 && sourceIndex > destIndex) {
            validStops = validStops.reverse();
          }
          setStops(validStops);
          setConnectionStatus("Waiting for bus data...");
          // Set initial bus location from busData if available
          if (!busLocation && busData && busData.latitude && busData.longitude) {
            // Find nearest stop to initial bus location
            let nearestStopIndex = 0;
            let minDistance = Infinity;
            validStops.forEach((stop, index) => {
              const distance = calculateDistance(
                stop.latitude, stop.longitude,
                busData.latitude, busData.longitude
              );
              if (distance < minDistance) {
                minDistance = distance;
                nearestStopIndex = index;
              }
            });
            setBusLocation({
              latitude: busData.latitude,
              longitude: busData.longitude,
              stopName: validStops[nearestStopIndex]?.stopName || "In Transit",
              status: "at stop",
              speed: `${(busData.speed || 0).toFixed(1)} km/h`
            });
            setCurrentStopIndex(nearestStopIndex);
            // Calculate ETA to next stop
            if (validStops[nearestStopIndex + 1]) {
              const nextStop = validStops[nearestStopIndex + 1];
              const dist = calculateDistance(
                busData.latitude, busData.longitude,
                nextStop.latitude, nextStop.longitude
              );
              const speed = busData.speed || 30;
              setEta(speed > 0 ? Math.ceil((dist / speed) * 60) : null);
            } else {
              setEta(null);
            }
          } else if (!busLocation && validStops.length > 0) {
            setBusLocation({
              latitude: validStops[0].latitude,
              longitude: validStops[0].longitude,
              stopName: validStops[0].stopName,
              status: "at stop",
              speed: "0 km/h"
            });
            setCurrentStopIndex(0);
            setEta(null);
          }
        }
      } catch (error) {
        setConnectionStatus("Failed to load stops");
      }
      setIsLoading(false);
    }
    fetchStops();
    return () => { cancelled = true; };
    // eslint-disable-next-line
  }, [routeId, sourceStopId, destStopId, busData, calculateDistance]);

  // Initialize map only once
  useEffect(() => {
    if (!stops.length || mapRef.current) return;

    const center = stops[0]
      ? [stops[0].latitude, stops[0].longitude]
      : [0, 0];

    const map = L.map("bus-map", {
      center,
      zoom: 16,
      zoomControl: true,
      attributionControl: false,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [stops]);

  // Draw static route polyline using OSRM (once per stops change)
  useEffect(() => {
    if (!mapRef.current || stops.length < 2) return;
    setOsrmError("");
    if (routeLineRef.current) {
      mapRef.current.removeLayer(routeLineRef.current);
      routeLineRef.current = null;
    }
    const coords = stops.map(stop => [stop.latitude, stop.longitude]);
    const osrmUrl = `http://localhost:5000/match/v1/driving/${coords
      .map(c => `${c[1]},${c[0]}`)
      .join(";")}?overview=full&geometries=geojson`;

    axios.get(osrmUrl)
      .then(res => {
        if (
          res.data &&
          res.data.routes &&
          res.data.routes.length > 0 &&
          res.data.routes[0].geometry
        ) {
          const routeCoords = res.data.routes[0].geometry.coordinates.map(
            ([lng, lat]) => [lat, lng]
          );
          routeLineRef.current = L.polyline(routeCoords, {
            color: "#3b82f6",
            weight: 4,
            dashArray: "6, 8",
          }).addTo(mapRef.current);
          mapRef.current.fitBounds(routeLineRef.current.getBounds(), { padding: [40, 40] });
        }
      })
      .catch(() => setOsrmError("Failed to load route from OSRM server."));
    // eslint-disable-next-line
  }, [stops]);

  // Add stop markers (only when stops or currentStopIndex changes)
  useEffect(() => {
    if (!mapRef.current || !stops.length) return;
    // Remove old markers
    stopMarkersRef.current.forEach(marker => mapRef.current.removeLayer(marker));
    stopMarkersRef.current = [];

    stops.forEach((stop, idx) => {
      const isCurrent = idx === currentStopIndex;
      const isNext = idx === currentStopIndex + 1;
      const isPassed = idx < currentStopIndex;

      let fillColor;
      if (isCurrent) fillColor = "#2563eb";
      else if (isNext) fillColor = "#d97706";
      else if (isPassed) fillColor = "#6b7280";
      else fillColor = "#16a34a";

      const icon = L.divIcon({
        className: "",
        html: `<svg width="22" height="22" viewBox="0 0 16 16" fill="${fillColor}" xmlns="http://www.w3.org/2000/svg">
          <circle cx="8" cy="8" r="7" stroke="#fff" stroke-width="2"/>
          ${isCurrent ? '<text x="8" y="12" font-size="8" text-anchor="middle" fill="white">B</text>' : ""}
        </svg>`,
        iconSize: [22, 22],
        iconAnchor: [11, 11],
      });

      const marker = L.marker([stop.latitude, stop.longitude], {
        icon,
        title: `${stop.stopName}${isCurrent ? " (Current)" : ""}`,
      }).addTo(mapRef.current);

      marker.bindTooltip(
        `${stop.stopName}${isCurrent ? " (Current)" : isNext ? " (Next)" : ""}`,
        { permanent: false, direction: "top" }
      );

      stopMarkersRef.current.push(marker);
    });
  }, [stops, currentStopIndex]);

  // Add/update bus marker and center map on bus
  useEffect(() => {
    if (!mapRef.current || !busLocation) return;

    // Update or create bus marker
    if (busMarkerRef.current) {
      busMarkerRef.current.setLatLng([busLocation.latitude, busLocation.longitude]);
    } else {
      const busIcon = L.divIcon({
        className: "",
        html: `<div style="font-size:28px;transform:rotate(0deg)">🚌</div>`,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });
      busMarkerRef.current = L.marker(
        [busLocation.latitude, busLocation.longitude],
        { icon: busIcon, title: `Bus (${busLocation.speed})` }
      ).addTo(mapRef.current);
    }
    // Center map on bus location as it moves
    mapRef.current.setView([busLocation.latitude, busLocation.longitude]);
  }, [busLocation]);

  // WebSocket connection
  useEffect(() => {
    if (!vehicleId) return;
    setConnectionStatus("Connecting to real-time data...");
    setIsLoading(true);
    setWsError("");
    if (stompClientRef.current) {
      stompClientRef.current.deactivate();
    }
    const socket = new SockJS(`${process.env.REACT_APP_API_BASE}/ws`);
    const stompClient = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: () => {
        setConnectionStatus("Connected to real-time data");
        stompClient.subscribe('/topic/vehicle', (message) => {
          try {
            const data = JSON.parse(message.body);
            // Find nearest stop
            console.log("Received data:", data);
            let nearestStopIndex = currentStopIndex;
            let minDistance = Infinity;
            let atStop = false;
            stops.forEach((stop, index) => {
              const distance = calculateDistance(
                stop.latitude, stop.longitude,
                data.latitude, data.longitude
              );
              if (distance < minDistance) {
                minDistance = distance;
                nearestStopIndex = index;
                atStop = distance < NEAR_STOP_THRESHOLD;
              }
            });
            if (minDistance < STOP_HIGHLIGHT_THRESHOLD && nearestStopIndex !== currentStopIndex) {
              setCurrentStopIndex(nearestStopIndex);
            }
            // Calculate ETA to next stop
            if (stops[nearestStopIndex + 1]) {
              const nextStop = stops[nearestStopIndex + 1];
              const dist = calculateDistance(
                data.latitude, data.longitude,
                nextStop.latitude, nextStop.longitude
              );
              const speed = data.speed || 30;
              setEta(speed > 0 ? Math.ceil((dist / speed) * 60) : null);
            } else {
              setEta(null);
            }
            setBusLocation({
              latitude: data.latitude,
              longitude: data.longitude,
              stopName: stops[nearestStopIndex]?.stopName || "In Transit",
              status: atStop ? "at stop" : "moving",
              speed: `${(data.speed || 0).toFixed(1)} km/h`,
              heading: data.heading || "N",
              nextStop: stops[nearestStopIndex + 1]?.stopName || "End of Route",
            });
            setLastUpdated(new Date(data.timestamp || Date.now()));
          } catch (error) {
            setWsError("Error processing WebSocket data.");
          } finally {
            setIsLoading(false);
          }
        });
        stompClient.publish({
          destination: '/app/subscribeVehicle',
          body: JSON.stringify({ vehicleId }),
          headers: { 'content-type': 'application/json' }
        });

      },
      onStompError: (frame) => {
        setConnectionStatus("Connection error");
        setWsError("WebSocket connection error.");
      },
      onDisconnect: () => {
        setConnectionStatus("Disconnected, reconnecting...");
      },
    });
    stompClient.activate();
    stompClientRef.current = stompClient;
    return () => {
      if (stompClientRef.current) {
        stompClientRef.current.deactivate();
      }
    };
    // eslint-disable-next-line
  }, [vehicleId, stops, currentStopIndex, calculateDistance]);

  // Format time
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "N/A";
    try {
      const date = new Date(timestamp);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return "N/A";
    }
  };

  return (
    <>
     <style>{`
        .bustracker-layout {
          display: flex;
          min-height: 100vh;
          background: #f3f4f6;
        }
        .bustracker-main {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 0 0.3rem 1rem 0.3rem;
        }
        .bustracker-statusbar {
          background: #16a34a;
          color: #fff;
          border-radius: 1.2rem 1.2rem 0 0;
          box-shadow: 0 2px 8px rgba(22,163,74,0.08);
          padding: 1rem 0.7rem 0.7rem 0.7rem;
          margin-bottom: 1.2rem;
          width: 100%;
          max-width: 1050px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1.5rem;
        }
        .bustracker-statusbar .bus-info {
          font-size: 1.1rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 0.7rem;
        }
        .bustracker-statusbar .bus-info .bus-icon {
          font-size: 1.5rem;
        }
        .bustracker-statusbar .bus-meta {
          display: flex;
          gap: 1.2rem;
        }
        .bustracker-statusbar .bus-meta span {
          background: #bbf7d0;
          color: #166534;
          border-radius: 1rem;
          padding: 0.3rem 1rem;
          font-size: 1rem;
          font-weight: 600;
        }
        .bustracker-map-section {
          width: 100%;
          max-width: 1050px;
          background: #fff;
          border-radius: 0 0 1.2rem 1.2rem;
          box-shadow: 0 2px 12px rgba(22,163,74,0.08);
          overflow: hidden;
          margin-bottom: 2rem;
        }
        #bus-map {
          width: 100%;
          height: 420px;
        }
        .bustracker-details {
          width: 100%;
          max-width: 1050px;
          background: #fff;
          border-radius: 1.2rem;
          box-shadow: 0 2px 12px rgba(22,163,74,0.08);
          padding: 1.2rem 0.7rem 1rem 0.7rem;
          margin-top: 0rem;
        }
        .bustracker-details h2 {
          font-size: 1.3rem;
          font-weight: 700;
          color: #166534;
          margin-bottom: 1.2rem;
        }
        .bustracker-stoplist {
          display: flex;
          flex-direction: column;
          gap: 0.7rem;
        }
        .bustracker-stopitem {
          display: flex;
          align-items: center;
          gap: 1.2rem;
          background: #f0fdf4;
          border-radius: 0.8rem;
          padding: 0.8rem 1.2rem;
          font-size: 1.05rem;
          box-shadow: 0 1px 4px rgba(22,163,74,0.05);
          transition: all 0.2s;
        }
        .bustracker-stopitem.current {
          background: #bbf7d0;
          font-weight: 700;
        }
        .bustracker-stopitem.next {
          background: #fef3c7;
        }
        .bustracker-stopitem.passed {
          background: #f3f4f6;
          color: #6b7280;
        }
        .bustracker-stopitem .stop-index {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: #16a34a;
          color: #fff;
          font-size: 1.1rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .bustracker-stopitem.current .stop-index {
          background: #2563eb;
        }
        .bustracker-stopitem.next .stop-index {
          background: #d97706;
        }
        .bustracker-stopitem.passed .stop-index {
          background: #6b7280;
        }
        .bustracker-stopitem .stop-name {
          color: #166534;
        }
        .bustracker-stopitem.passed .stop-name {
          color: #6b7280;
        }
        .bustracker-stopitem .stop-meta {
          color: #374151;
          font-size: 0.97rem;
          margin-left: 0.7rem;
        }
        .bustracker-stopitem .eta {
          color: #15803d;
          font-size: 0.97rem;
          margin-left: 1.2rem;
        }
        .bus-here-label {
          font-size: 1.1rem;
          font-weight: bold;
          color: #2563eb;
          margin-bottom: 0.2rem;
        }
        .connection-status {
          padding: 0.5rem;
          border-radius: 0.5rem;
          background: ${connectionStatus === "Connected to real-time data" ? "#bbf7d0" : "#fee2e2"};
          color: ${connectionStatus === "Connected to real-time data" ? "#166534" : "#b91c1c"};
          font-weight: 600;
          margin-bottom: 1rem;
        }
        @media (max-width: 900px) {
          .bustracker-main {
            margin-left: 0;
            padding: 1rem 0.2rem;
          }
          .bustracker-statusbar,
          .bustracker-map-section,
          .bustracker-details {
            padding-left: 0.7rem;
            padding-right: 0.7rem;
            max-width: 100vw;
          }
          .bustracker-statusbar {
            flex-direction: column;
            align-items: flex-start;
          }
        }
      `}</style>
      <div className="bustracker-layout">
        <div className="bustracker-main">
          {/* Status Bar */}
          <div className="bustracker-statusbar">
            <div className="bus-info">
              <span className="bus-icon"><FaBus /></span>
              Route: <span>{routeId || "N/A"}</span>
              {busLocation && (
                <>
                  <FaMapMarkerAlt className="ml-2" />
                  <span>{busLocation.stopName || "In Transit"}</span>
                </>
              )}
            </div>
            <div className="bus-meta">
              {eta && (
                <span>
                  <FaClock className="inline mr-1" /> ETA: ~{eta} min
                </span>
              )}
              <span>
                Last Update: {lastUpdated ? formatTimestamp(lastUpdated) : "N/A"}
              </span>
            </div>
          </div>

          {/* Connection Status */}
          <div className="connection-status">
            Status: {connectionStatus}
            {osrmError && <span style={{ color: "#b91c1c", marginLeft: 10 }}>{osrmError}</span>}
            {wsError && <span style={{ color: "#b91c1c", marginLeft: 10 }}>{wsError}</span>}
          </div>

          {/* Map Section */}
          <div className="bustracker-map-section">
            <div id="bus-map" style={{ width: "100%", height: "420px" }}></div>
          </div>

          {/* Details Section */}
          <div className="bustracker-details">
            <h2>Bus Stops</h2>
            {stops.length > 0 ? (
              <div className="bustracker-stoplist">
                {stops.map((stop, idx) => {
                  const isCurrent = idx === currentStopIndex;
                  const isNext = idx === currentStopIndex + 1;
                  const isPassed = idx < currentStopIndex;
                  return (
                    <React.Fragment key={stop.stopId}>
                      {isCurrent && (
                        <div className="bus-here-label">
                          🚌 Bus is here (Lat: {busLocation?.latitude?.toFixed(5)}, Lng: {busLocation?.longitude?.toFixed(5)})
                        </div>
                      )}
                      <div
                        className={`bustracker-stopitem ${isCurrent ? "current" : ""} ${isNext ? "next" : ""} ${isPassed ? "passed" : ""}`}
                      >
                        <div className="stop-index">{idx + 1}</div>
                        <div className="stop-name">{stop.stopName}</div>
                        <div className="stop-meta">Stop {stop.stopSequence}</div>
                        {isNext && eta && (
                          <div className="eta">
                            <FaClock className="inline mr-1" /> ETA: ~{eta} min
                          </div>
                        )}
                      </div>
                    </React.Fragment>
                  );
                })}
              </div>
            ) : (
              <div className="flex justify-center items-center py-8">
                {isLoading ? (
                  <ClipLoader color="#16a34a" size={40} />
                ) : (
                  <span className="text-gray-600">{connectionStatus}</span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default BusTracker;