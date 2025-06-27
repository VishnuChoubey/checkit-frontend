import React, { useState, useEffect, useCallback } from "react";
import { FaRoute, FaSearch, FaMapMarkerAlt, FaBus } from "react-icons/fa";
import axios from "axios";
import Navbar from "../Main/Navbar";

const SIDEBAR_WIDTH = 220;

const RouteInfo = () => {
  const [stops, setStops] = useState([]);
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [routeNo, setRouteNo] = useState("");
  const [sourceSuggestions, setSourceSuggestions] = useState([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [routeStops, setRouteStops] = useState([]);
  const [loadingRoutes, setLoadingRoutes] = useState(false);
  const [loadingStops, setLoadingStops] = useState(false);
  const [error, setError] = useState("");

  // Fetch all stops for suggestions
  useEffect(() => {
    const fetchStops = async () => {
      try {
        const response = await fetch('/stopNames.json');
        const data = await response.json();
        setStops(data || []);
      } catch (err) {
        setStops([]);
      }
    };
    fetchStops();
  }, []);

  // Suggestion logic
  const handleSourceChange = (e) => {
    const value = e.target.value;
    setSource(value);
    setSourceSuggestions(
      value
        ? stops.filter((stop) =>
            stop.toLowerCase().includes(value.toLowerCase())
          ).slice(0, 8)
        : []
    );
  };

  const handleDestinationChange = (e) => {
    const value = e.target.value;
    setDestination(value);
    setDestinationSuggestions(
      value
        ? stops.filter((stop) =>
            stop.toLowerCase().includes(value.toLowerCase())
          ).slice(0, 8)
        : []
    );
  };

  const handleSourceSelect = (stop) => {
    setSource(stop);
    setSourceSuggestions([]);
  };

  const handleDestinationSelect = (stop) => {
    setDestination(stop);
    setDestinationSuggestions([]);
  };

  // Find all routes between stops
  const findRoutes = async () => {
    setError("");
    setRoutes([]);
    setLoadingRoutes(true);
    setRouteStops([]);
    if (!source || !destination) {
      setError("Please select both source and destination stops.");
      setLoadingRoutes(false);
      return;
    }
    try {
      const response = await axios.get(
        `http://localhost:8080/api/vehicle/stopTimes/routes/${encodeURIComponent(
          source
        )}/${encodeURIComponent(destination)}`
      );
      setRoutes(response.data || []);
    } catch (err) {
      setError("Failed to fetch routes.");
    }
    setLoadingRoutes(false);
  };

  // Find all stops for a route
  const findRouteStops = async () => {
    setError("");
    setRouteStops([]);
    setLoadingStops(true);
    setRoutes([]);
    if (!routeNo) {
      setError("Please enter a route number.");
      setLoadingStops(false);
      return;
    }
    try {
      const response = await axios.get(
        `http://localhost:8080/api/vehicle/by-trip/${encodeURIComponent(routeNo)}`
      );
      let validStops = response.data
        .filter((stop) => stop.latitude && stop.longitude)
        .sort((a, b) => a.stopSequence - b.stopSequence);
      setRouteStops(validStops);
    } catch (err) {
      setError("Failed to fetch stops for this route.");
    }
    setLoadingStops(false);
  };

  return (
    <>
      <style>{`
        .routeinfo-layout {
          display: flex;
          min-height: 100vh;
          background: #f3f4f6;
        }
        .routeinfo-main {
      
          
          border-radius: 2rem;             /* Tailwind: rounded-2xl = 1rem (16px) */
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); /* Tailwind: shadow-2xl */
          padding: 1.5rem;                 /* Tailwind: p-6 = 1.5rem */

          /* Margin overrides from inline style */
          margin-top: 0.2rem;
          margin-bottom: 1rem;
          margin-left: 8px;
          margin-right: 0.4rem;
          background: linear-gradient(90deg, #f0fdf4 60%, #bbf7d0 100%);
        
        }
        .routeinfo-title {
          font-size: 2.2rem;
          font-weight: 800;
          color: #16a34a;
          letter-spacing: 0.04em;
          text-align: center;
          margin-bottom: 0.5rem;
        }
        .routeinfo-desc {
          text-align: center;
          color: #4b5563;
          font-size: 1.1rem;
          margin-bottom: 1.5rem;
        }
        .routeinfo-card {
          background: #fff;
          border-radius: 1.2rem;
          box-shadow: 0 2px 12px rgba(22,163,74,0.08);
          padding: 2rem 1.5rem 2.5rem 1.5rem;
          margin-top: 2rem;
          width: 100%;
          max-width: 800px;
          margin-left: 7rem;
        }
        .routeinfo-section-title {
          font-size: 1.2rem;
          font-weight: 700;
          color: #166534;
          margin-bottom: 1rem;
          margin-top: 1.5rem;
        }
        .routeinfo-input-row {
          display: flex;
          gap: 1rem;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
        }
        .routeinfo-input-group {
          flex: 1;
          min-width: 180px;
          position: relative;
        }
        .routeinfo-input {
          width: 100%;
          padding: 0.8rem 1rem;
          border-radius: 0.7rem;
          border: 1.5px solid #d1fae5;
          font-size: 1rem;
          outline: none;
          margin-bottom: 0.2rem;
        }
        .routeinfo-suggestions {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: #fff;
          border: 1px solid #bbf7d0;
          border-radius: 0.7rem;
          z-index: 10;
          max-height: 180px;
          overflow-y: auto;
          box-shadow: 0 2px 8px rgba(22,163,74,0.08);
        }
        .routeinfo-suggestion {
          padding: 0.7rem 1rem;
          cursor: pointer;
          color: #166534;
        }
        .routeinfo-suggestion:hover {
          background: #bbf7d0;
        }
        .routeinfo-btn {
          background: #16a34a;
          color: #fff;
          border: none;
          border-radius: 0.7rem;
          padding: 0.8rem 1.5rem;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-top: 0.1rem;
        }
        .routeinfo-btn:hover {
          background: #15803d;
        }
        .routeinfo-divider {
          margin: 2.5rem 0 1.5rem 0;
          border: none;
          border-top: 2px dashed #bbf7d0;
        }
        .routeinfo-list {
          margin-top: 1rem;
        }
        .routeinfo-list-item {
          background: #f0fdf4;
          border-radius: 0.7rem;
          padding: 1rem 1.2rem;
          margin-bottom: 0.7rem;
          box-shadow: 0 1px 4px rgba(22,163,74,0.07);
          display: flex;
          align-items: center;
          gap: 1.2rem;
        }
        .routeinfo-list-item .icon {
          color: #16a34a;
          font-size: 1.3rem;
        }
        .routeinfo-list-item .stop-seq {
          color: #64748b;
          font-size: 1rem;
          margin-left: 0.5rem;
        }
        .routeinfo-error {
          color: #dc2626;
          font-size: 1rem;
          margin-bottom: 1rem;
          margin-top: 0.5rem;
        }
        @media (max-width: 900px) {
          .routeinfo-main {
            margin-left: 0;
            padding: 1rem 0.2rem;
          }
          .routeinfo-card {
            padding: 1rem 0.7rem 1.5rem 0.7rem;
          }
        }
      `}</style>
      
     
        <div className="routeinfo-main">
          <div className="routeinfo-title">Route Info & Stop Finder</div>
          <div className="routeinfo-desc">
            Find all available routes between two stops or view all stops for a specific route number.<br />
            <span style={{ color: "#16a34a", fontWeight: 600 }}>
              Powered by Delhi Bus Data
            </span>
          </div>
          <div className="routeinfo-card">
            <div className="routeinfo-section-title">
              <FaRoute className="inline mr-2" />
              Find All Routes Between Stops
            </div>
            <div className="routeinfo-input-row">
              <div className="routeinfo-input-group">
                <input
                  className="routeinfo-input"
                  type="text"
                  placeholder="Source Stop"
                  value={source}
                  onChange={handleSourceChange}
                  autoComplete="off"
                />
                {sourceSuggestions.length > 0 && (
                  <div className="routeinfo-suggestions">
                    {sourceSuggestions.map((stop, idx) => (
                      <div
                        key={idx}
                        className="routeinfo-suggestion"
                        onClick={() => handleSourceSelect(stop)}
                      >
                        {stop}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="routeinfo-input-group">
                <input
                  className="routeinfo-input"
                  type="text"
                  placeholder="Destination Stop"
                  value={destination}
                  onChange={handleDestinationChange}
                  autoComplete="off"
                />
                {destinationSuggestions.length > 0 && (
                  <div className="routeinfo-suggestions">
                    {destinationSuggestions.map((stop, idx) => (
                      <div
                        key={idx}
                        className="routeinfo-suggestion"
                        onClick={() => handleDestinationSelect(stop)}
                      >
                        {stop}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <button className="routeinfo-btn" onClick={findRoutes} disabled={loadingRoutes}>
                <FaSearch /> {loadingRoutes ? "Finding..." : "Find Routes"}
              </button>
            </div>
            {error && <div className="routeinfo-error">{error}</div>}
            {routes.length > 0 && (
              <div className="routeinfo-list">
                <div className="routeinfo-section-title" style={{marginTop:0}}>Available Routes:</div>
                {routes.map((route, idx) => (
                  <div className="routeinfo-list-item" key={route}>
                    <FaBus className="icon" />
                    <span style={{ fontWeight: 600, color: "#166534" }}>
                      Route No: {route}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <hr className="routeinfo-divider" />

            <div className="routeinfo-section-title">
              <FaMapMarkerAlt className="inline mr-2" />
              Find All Stops of a Route
            </div>
            <div className="routeinfo-input-row">
              <div className="routeinfo-input-group" style={{maxWidth: 260}}>
                <input
                  className="routeinfo-input"
                  type="text"
                  placeholder="Enter Route Number"
                  value={routeNo}
                  onChange={e => setRouteNo(e.target.value)}
                  autoComplete="off"
                />
              </div>
              <button className="routeinfo-btn" onClick={findRouteStops} disabled={loadingStops}>
                <FaSearch /> {loadingStops ? "Finding..." : "Show Stops"}
              </button>
            </div>
            {routeStops.length > 0 && (
              <div className="routeinfo-list">
                <div className="routeinfo-section-title" style={{marginTop:0}}>Stops for Route {routeNo}:</div>
                {routeStops.map((stop, idx) => (
                  <div className="routeinfo-list-item" key={stop.stopId || idx}>
                    <FaMapMarkerAlt className="icon" />
                    <span style={{ fontWeight: 600, color: "#166534" }}>
                      {stop.stopName}
                    </span>
                    <span className="stop-seq">#{stop.stopSequence}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
     
    </>
  );
};

export default RouteInfo;