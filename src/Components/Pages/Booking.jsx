import React, { useState, useEffect } from "react";
import Navbar from "../Main/Navbar";
import axios from "axios";

const Booking = () => {
  const [form, setForm] = useState({
    source: "",
    destination: "",
    routeNo: "",
    vehicleNo: "",
    passengers: 1,
  });
  const [success, setSuccess] = useState(false);

  // For suggestions and route dropdown
  const [stops, setStops] = useState([]);
  const [sourceSuggestions, setSourceSuggestions] = useState([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [routeStops, setRouteStops] = useState([]);
  const [fare, setFare] = useState(null);
  const [loadingRoutes, setLoadingRoutes] = useState(false);
  const [loadingFare, setLoadingFare] = useState(false);
  const [error, setError] = useState("");

  // Fetch stops for suggestions
  const [loadingBook, setLoadingBook] = useState(false);
// ...existing code...


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
    setForm((prev) => ({ ...prev, source: value }));
    setSourceSuggestions(
      value
        ? stops.filter((stop) =>
            stop.toLowerCase().includes(value.toLowerCase())
          ).slice(0, 8)
        : []
    );
    setRoutes([]);
    setForm((prev) => ({ ...prev, routeNo: "" }));
    setFare(null);
  };

  const handleDestinationChange = (e) => {
    const value = e.target.value;
    setForm((prev) => ({ ...prev, destination: value }));
    setDestinationSuggestions(
      value
        ? stops.filter((stop) =>
            stop.toLowerCase().includes(value.toLowerCase())
          ).slice(0, 8)
        : []
    );
    setRoutes([]);
    setForm((prev) => ({ ...prev, routeNo: "" }));
    setFare(null);
  };

  const handleSourceSelect = (stop) => {
    setForm((prev) => ({ ...prev, source: stop }));
    setSourceSuggestions([]);
    setRoutes([]);
    setForm((prev) => ({ ...prev, routeNo: "" }));
    setFare(null);
  };

  const handleDestinationSelect = (stop) => {
    setForm((prev) => ({ ...prev, destination: stop }));
    setDestinationSuggestions([]);
    setRoutes([]);
    setForm((prev) => ({ ...prev, routeNo: "" }));
    setFare(null);
  };

  // Fetch all routes between source and destination
  useEffect(() => {
    const fetchRoutes = async () => {
      setError("");
      setRoutes([]);
      setRouteStops([]);
      setFare(null);
      if (
        form.source &&
        form.destination &&
        form.source !== form.destination
      ) {
        setLoadingRoutes(true);
        try {
          const response = await axios.get(
            `http://localhost:8080/api/vehicle/stopTimes/routes/${encodeURIComponent(
              form.source
            )}/${encodeURIComponent(form.destination)}`
          );
          setRoutes(response.data || []);
        } catch (err) {
          setError("No routes found between these stops.");
        }
        setLoadingRoutes(false);
      }
    };
    fetchRoutes();
    // eslint-disable-next-line
  }, [form.source, form.destination]);

  // When routeNo is selected, fetch stops for that route and calculate fare
  useEffect(() => {
    const fetchRouteStopsAndFare = async () => {
      setError("");
      setRouteStops([]);
      setFare(null);
      if (
        form.routeNo &&
        form.source &&
        form.destination &&
        form.source !== form.destination
      ) {
        setLoadingFare(true);
        try {
          const response = await axios.get(
            `http://localhost:8080/api/vehicle/by-trip/${encodeURIComponent(
              form.routeNo
            )}`
          );
          let validStops = response.data
            .filter((stop) => stop.latitude && stop.longitude)
            .sort((a, b) => a.stopSequence - b.stopSequence);

          setRouteStops(validStops);

          // Find indices of source and destination
          const sourceIdx = validStops.findIndex(
            (s) =>
              s.stopName.toLowerCase() === form.source.toLowerCase()
          );
          const destIdx = validStops.findIndex(
            (s) =>
              s.stopName.toLowerCase() === form.destination.toLowerCase()
          );
          if (sourceIdx !== -1 && destIdx !== -1) {
            const stopsBetween = Math.abs(destIdx - sourceIdx);
            setFare(stopsBetween * 3);
          } else {
            setFare(null);
            setError("Selected stops are not on this route.");
          }
        } catch (err) {
          setError("Could not fetch stops for this route.");
        }
        setLoadingFare(false);
      }
    };
    fetchRouteStopsAndFare();
    // eslint-disable-next-line
  }, [form.routeNo]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (name === "routeNo") setFare(null);
  };

  const handleSubmit = (e) => {
  e.preventDefault();
  setLoadingBook(true);
  setTimeout(() => {
    setSuccess(false);
    setLoadingBook(false);
  }, 150000); // Simulate loading for 1.5s
};

  return (
    <>
      <Navbar />
      <style>{`
        .booking-bg {
           display: grid;
         
          gap: 3rem;
         
          background: #fff;
          border-radius: 2rem;
          box-shadow: 0 8px 32px rgba(22,163,74,0.13), 0 2px 8px rgba(22,163,74,0.08);
          padding: 2rem 2rem 2rem 2rem;
          margin-top: 0;
          margin-bottom: 0.5rem;
          margin-left: 0.4rem;
          margin-right: 0.4rem;
          background: linear-gradient(90deg, #f0fdf4 60%, #bbf7d0 100%);
      
        }
      
        .booking-card {
          width: 100%;
          max-width: 1050px;
          background: #fff;
          border-radius: 2rem;
          box-shadow: 0 8px 32px rgba(22,163,74,0.13), 0 2px 8px rgba(22,163,74,0.08);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          min-height: unset;
          padding: 2rem 2.5rem;
          margin: 0;
        }
        .booking-title {
          font-size: 2.1rem;
          font-weight: 800;
          color: #15803d;
          margin-bottom: 0.3rem;
          text-align: left;
        }
        .booking-subtitle {
          font-size: 1.05rem;
          color: #4b5563;
          margin-bottom: 1.2rem;
          text-align: left;
        }
        .booking-form {
          display: flex;
          flex-direction: column;
          gap: 0.7rem;
        }
        .booking-form-row {
          display: flex;
          gap: 0.7rem;
        }
        .booking-form-row > div {
          flex: 1;
        }
        .booking-label {
          font-weight: 600;
          color: #166534;
          margin-bottom: 0.2rem;
        }
        .booking-input {
          width: 100%;
          padding: 0.5rem;
          border: 1.5px solid #bbf7d0;
          border-radius: 0.6rem;
          font-size: 1rem;
          background: #f0fdf4;
          transition: border-color 0.2s;
        }
        .booking-input:focus {
          outline: none;
          border-color: #16a34a;
          background: #fff;
        }
        .booking-suggestions {
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
        .booking-suggestion {
          padding: 0.7rem 1rem;
          cursor: pointer;
          color: #166534;
        }
        .booking-suggestion:hover {
          background: #bbf7d0;
        }
        .booking-btn {
          background: linear-gradient(90deg, #16a34a 60%, #22d3ee 100%);
          color: #fff;
          border: none;
          border-radius: 0.7rem;
          font-size: 1.1rem;
          font-weight: 700;
          padding: 0.7rem 0;
          cursor: pointer;
          margin-top: 0.3rem;
          box-shadow: 0 2px 8px rgba(22,163,74,0.10);
          transition: background 0.2s;
        }
        .booking-btn:hover {
          background: linear-gradient(90deg, #15803d 60%, #0ea5e9 100%);
        }
        .booking-success {
          background: #bbf7d0;
          color: #166534;
          border-radius: 1rem;
          padding: 1.2rem;
          text-align: center;
          font-size: 1.1rem;
          font-weight: 600;
          margin-top: 1.2rem;
        }
        .booking-feature-list {
          margin-top: 1.2rem;
          display: flex;
          flex-wrap: wrap;
          gap: 0.7rem;
          justify-content: center;
        }
        .booking-feature-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 1rem;
          color: #166534;
          background: #f0fdf4;
          border-radius: 0.7rem;
          padding: 0.3rem 0.7rem;
          font-weight: 500;
        }
        .booking-feature-icon {
          font-size: 1.2rem;
        }
        .booking-error {
          color: #dc2626;
          font-size: 1rem;
          margin-bottom: 0.7rem;
          margin-top: 0.2rem;
        }
        @media (max-width: 1200px) {
          .booking-main-container {
            margin-left: 0;
            width: 100vw;
            padding-top: 0;
          }
          .booking-card {
            max-width: 98vw;
            padding: 1.2rem 0.5rem;
          }
        }
        @media (max-width: 700px) {
          .booking-card {
            border-radius: 0.7rem;
            padding: 0.7rem 0.2rem;
          }
          .booking-form-row {
            flex-direction: column;
            gap: 0.3rem;
          }
        }
      `}</style>
      <div className="booking-bg">
        
          <div className="booking-card">
            <div className="booking-title">Local Bus Ticket Booking</div>
            <div className="booking-subtitle">
              Book your seat on a local bus quickly and securely.
            </div>
            {error && <div className="booking-error">{error}</div>}
            {!success ? (
              <form className="booking-form" onSubmit={handleSubmit} autoComplete="off">
                <div className="booking-form-row">
                  <div style={{ position: "relative" }}>
                    <div className="booking-label">Source Stop</div>
                    <input
                      className="booking-input"
                      type="text"
                      name="source"
                      placeholder="Enter source stop"
                      value={form.source}
                      onChange={handleSourceChange}
                      required
                      autoComplete="off"
                    />
                    {sourceSuggestions.length > 0 && (
                      <div className="booking-suggestions">
                        {sourceSuggestions.map((stop, idx) => (
                          <div
                            key={idx}
                            className="booking-suggestion"
                            onClick={() => handleSourceSelect(stop)}
                          >
                            {stop}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div style={{ position: "relative" }}>
                    <div className="booking-label">Destination Stop</div>
                    <input
                      className="booking-input"
                      type="text"
                      name="destination"
                      placeholder="Enter destination stop"
                      value={form.destination}
                      onChange={handleDestinationChange}
                      required
                      autoComplete="off"
                    />
                    {destinationSuggestions.length > 0 && (
                      <div className="booking-suggestions">
                        {destinationSuggestions.map((stop, idx) => (
                          <div
                            key={idx}
                            className="booking-suggestion"
                            onClick={() => handleDestinationSelect(stop)}
                          >
                            {stop}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="booking-form-row">
                  <div>
                    <div className="booking-label">Route Number</div>
                    <select
                      className="booking-input"
                      name="routeNo"
                      value={form.routeNo}
                      onChange={handleChange}
                      required
                      disabled={loadingRoutes || routes.length === 0}
                    >
                      <option value="">Select route</option>
                      {routes.map((route, idx) => (
                        <option key={idx} value={route}>
                          {route}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <div className="booking-label">Vehicle Number (optional)</div>
                    <input
                      className="booking-input"
                      type="text"
                      name="vehicleNo"
                      placeholder="e.g. DL1PC1234"
                      value={form.vehicleNo}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <div className="booking-label">Number of Passengers</div>
                    <input
                      className="booking-input"
                      type="number"
                      name="passengers"
                      min={1}
                      max={10}
                      value={form.passengers}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="booking-form-row">
                  <div>
                    <div className="booking-label">Fare</div>
                    <input
                      className="booking-input"
                      type="text"
                      value={
                        loadingFare
                          ? "Calculating..."
                          : fare !== null
                          ? `₹${fare * form.passengers}`
                          : "--"
                      }
                      readOnly
                      style={{ background: "#f3f4f6", color: "#166534", fontWeight: 700 }}
                    />
                  </div>
                </div>
                <button className="booking-btn" type="submit" disabled={!fare || loadingBook}>
                {loadingBook ? "Booking..." : "Book Ticket"}
              </button>
              </form>
            ) : (
              <div className="booking-success">
                🎉 Your local bus ticket has been booked!<br />
                Please show this confirmation to the conductor.
              </div>
            )}
            <div className="booking-feature-list">
              <div className="booking-feature-item">
                <span className="booking-feature-icon">🚌</span>
                Live Bus Tracking
              </div>
              <div className="booking-feature-item">
                <span className="booking-feature-icon">🪑</span>
                Guaranteed Seat
              </div>
              <div className="booking-feature-item">
                <span className="booking-feature-icon">🔔</span>
                Journey Reminders
              </div>
              <div className="booking-feature-item">
                <span className="booking-feature-icon">💳</span>
                Multiple Payment Options
              </div>
              <div className="booking-feature-item">
                <span className="booking-feature-icon">🛡️</span>
                24x7 Customer Support
              </div>
              <div className="booking-feature-item">
                <span className="booking-feature-icon">📄</span>
                Downloadable e-Ticket & QR
              </div>
            </div>
          </div>
      
      </div>
    </>
  );
};

export default Booking;