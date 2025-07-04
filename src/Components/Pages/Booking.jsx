import React, { useState, useEffect } from "react";
import Navbar from "../Main/Navbar";
import axios from "axios";
import { QRCodeCanvas } from "qrcode.react";
import { useNavigate } from "react-router-dom";
const Booking = () => {
  // Form state
  const [form, setForm] = useState({
    source: "",
    destination: "",
    routeNo: "",
    vehicleNo: "",
    passengers: 1,
  });

  // User state
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  // UI state
  const [success, setSuccess] = useState(false);
  const [ticketDetails, setTicketDetails] = useState(null);
  const [stops, setStops] = useState([]);
  const [sourceSuggestions, setSourceSuggestions] = useState([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [fare, setFare] = useState(null);
  const [loadingRoutes, setLoadingRoutes] = useState(false);
  const [loadingFare, setLoadingFare] = useState(false);
  const [loadingBook, setLoadingBook] = useState(false);
  const [error, setError] = useState("");

  // Load Razorpay script
  useEffect(() => {
    if (!window.Razorpay) {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onerror = () => {
        setError("Failed to load payment processor. Please refresh the page.");
      };
      document.body.appendChild(script);
    }
  }, []);

  // Fetch user profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) return;
        const response = await fetch("http://localhost:8080/api/user/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setUser(data);
        }
      } catch (err) {
        // Optionally handle error
      }
    };
    fetchProfile();
  }, []);

  // Fetch bus stops
  useEffect(() => {
    const fetchStops = async () => {
      try {
        const response = await fetch("/stopNames.json");
        const data = await response.json();
        setStops(data || []);
      } catch (err) {
        console.error("Failed to load stops:", err);
        setStops([]);
      }
    };
    fetchStops();
  }, []);

  // Handle source/destination input changes
  const handleSourceChange = (e) => {
    const value = e.target.value;
    setForm((prev) => ({ ...prev, source: value }));
    setSourceSuggestions(
      value
        ? stops
            .filter((stop) =>
              stop.toLowerCase().includes(value.toLowerCase())
            )
            .slice(0, 8)
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
        ? stops
            .filter((stop) =>
              stop.toLowerCase().includes(value.toLowerCase())
            )
            .slice(0, 8)
        : []
    );
    setRoutes([]);
    setForm((prev) => ({ ...prev, routeNo: "" }));
    setFare(null);
  };

  // Handle stop selection
  const handleSourceSelect = (stop) => {
    setForm((prev) => ({ ...prev, source: stop }));
    setSourceSuggestions([]);
  };

  const handleDestinationSelect = (stop) => {
    setForm((prev) => ({ ...prev, destination: stop }));
    setDestinationSuggestions([]);
  };

  // Fetch routes between selected stops
  useEffect(() => {
    const fetchRoutes = async () => {
      if (
        !form.source ||
        !form.destination ||
        form.source === form.destination
      )
        return;

      setError("");
      setLoadingRoutes(true);
      try {
        const response = await axios.get(
          `http://localhost:8080/api/vehicle/stopTimes/routes/${encodeURIComponent(
            form.source
          )}/${encodeURIComponent(form.destination)}`
        );
        setRoutes(response.data || []);
        if (!response.data?.length) {
          setError("No routes found between these stops.");
        }
      } catch (err) {
        setError("Failed to fetch routes. Please try again.");
        console.error("Route fetch error:", err);
      }
      setLoadingRoutes(false);
    };

    const timer = setTimeout(fetchRoutes, 500); // Debounce
    return () => clearTimeout(timer);
  }, [form.source, form.destination]);

  // Calculate fare when route is selected
  useEffect(() => {
    const calculateFare = async () => {
      if (!form.routeNo || !form.source || !form.destination) return;

      setError("");
      setLoadingFare(true);
      try {
        const response = await axios.get(
          `http://localhost:8080/api/vehicle/by-trip/${encodeURIComponent(
            form.routeNo
          )}`
        );

        const validStops =
          response.data
            ?.filter((stop) => stop.latitude && stop.longitude)
            ?.sort((a, b) => a.stopSequence - b.stopSequence) || [];

        const sourceIdx = validStops.findIndex(
          (s) => s.stopName.toLowerCase() === form.source.toLowerCase()
        );
        const destIdx = validStops.findIndex(
          (s) => s.stopName.toLowerCase() === form.destination.toLowerCase()
        );

        if (sourceIdx !== -1 && destIdx !== -1) {
          setFare(Math.abs(destIdx - sourceIdx) * 3); // ₹3 per stop
        } else {
          setError("Selected stops are not on this route.");
          setFare(null);
        }
      } catch (err) {
        setError("Failed to calculate fare. Please try again.");
        console.error("Fare calculation error:", err);
      }
      setLoadingFare(false);
    };

    calculateFare();
  }, [form.routeNo]);

  // Form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (name === "routeNo") setFare(null);
  };

  // Validate form before submission
  const validateForm = () => {
    if (!form.source || !form.destination) {
      setError("Please select source and destination stops");
      return false;
    }
    if (form.source === form.destination) {
      setError("Source and destination cannot be the same");
      return false;
    }
    if (!form.routeNo) {
      setError("Please select a route");
      return false;
    }
    if (form.passengers < 1 || form.passengers > 10) {
      setError("Number of passengers must be between 1-10");
      return false;
    }
    if (!fare) {
      setError("Could not calculate fare. Please try again.");
      return false;
    }
    return true;
  };

  // Razorpay payment handler
  const openRazorpay = async (amount) => {
    // Take a snapshot of form data to avoid nulls in async handler
    const bookingSnapshot = { ...form };
    try {
      // Create order on backend
      const { data: order } = await axios.post(
        `http://localhost:8080/api/payment/create-order`,
        {
          amount: amount * 100, // paise
          currency: "INR",
          receipt: `booking_${Date.now()}`,
          notes: {
            source: bookingSnapshot.source,
            destination: bookingSnapshot.destination,
            routeNo: bookingSnapshot.routeNo,
            passengers: bookingSnapshot.passengers,
          },
        }
      );

      const options = {
        key: "rzp_test_jWKY6NPp7atUuc", // Replace with your Razorpay key
        amount: order.amount,
        currency: order.currency,
        name: "City Bus Services",
        description: "Bus Ticket Payment",
        order_id: order.id,
        handler: async function (response) {
          try {
            console.log("this is the user",user.id)
            // Verify payment on backend, include user info
            const { data } = await axios.post(
              `http://localhost:8080/api/payment/verify`,
              {
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                 passengersId: user.id,
                bookingDetails: {
                  ...bookingSnapshot,
                    
                },
              }
            );

            if (data.success) {
              setTicketDetails({
                ...bookingSnapshot,
                paymentId: response.razorpay_payment_id,
                bookingId: data.bookingId,
                fare: amount,
                date: new Date().toLocaleString(),
                user: user
                  ? {
                      id: user.id,
                      name: user.name,
                      email: user.email,
                      phone: user.phone,
                    }
                  : null,
              });
              setSuccess(true);
            } else {
              setError("Payment verification failed. Please contact support.");
            }
          } catch (err) {
            setError("Payment verification error. Please contact support.");
            console.error("Payment verification error:", err);
          }
        },
        prefill: {
          name: user?.name || "Bus Passenger",
          email: user?.email || "passenger@example.com",
          contact: user?.phone || "+919876543210",
        },
        theme: { color: "#16a34a" },
        modal: {
          ondismiss: function () {
            setError("Payment was cancelled. Please try again.");
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      setError("Payment initialization failed. Please try again.");
      console.error("Payment error:", err);
      throw err;
    }
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
     if (!user) {
      navigate("/LoginUser");
      return;
    }

    setLoadingBook(true);
    setError("");
    try {
      await openRazorpay(fare * form.passengers);
    } catch (err) {
      // Error already set by openRazorpay
    }
    setLoadingBook(false);
  };

  // Generate a simple booking ID (for demo)
  const generateBookingId = () => {
    return `BUS-${Math.floor(100000 + Math.random() * 900000)}`;
  };

  // Reset form for new booking
  const handleNewBooking = () => {
    setSuccess(false);
    setForm({
      source: "",
      destination: "",
      routeNo: "",
      vehicleNo: "",
      passengers: 1,
    });
    setFare(null);
    setRoutes([]);
    setError("");
  };

  return (
    <>
     
      <style>{`
        .booking-container {
          display: flex;
          justify-content: center;
          padding: 2rem 1rem;
          background: linear-gradient(90deg, #d1fae5 60%, #86efac 100%);
          min-height: calc(100vh - 64px);
          border-radius: 2.5rem;
          max-width: 1030px;
          margin-left:0.5rem;
        }
        .booking-card {
          width: 100%;
          max-width: 800px;
          background: white;
          border-radius: 1rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          padding: 2rem;
        }
        .booking-title {
          font-size: 1.8rem;
          font-weight: 700;
          color: #166534;
          margin-bottom: 0.5rem;
        }
        .booking-subtitle {
          font-size: 1rem;
          color: #4b5563;
          margin-bottom: 1.5rem;
        }
        .booking-form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .form-row {
          display: flex;
          gap: 1rem;
        }
        .form-group {
          flex: 1;
          position: relative;
        }
        .form-label {
          display: block;
          font-weight: 600;
          color: #166534;
          margin-bottom: 0.5rem;
        }
        .form-input {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #d1fae5;
          border-radius: 0.5rem;
          font-size: 1rem;
          background: #f0fdf4;
          transition: all 0.2s;
        }
        .form-input:focus {
          outline: none;
          border-color: #10b981;
          box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.2);
          background: white;
        }
        .suggestions-list {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: white;
          border: 1px solid #d1fae5;
          border-radius: 0.5rem;
          z-index: 10;
          max-height: 200px;
          overflow-y: auto;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .suggestion-item {
          padding: 0.75rem 1rem;
          cursor: pointer;
          transition: background 0.2s;
        }
        .suggestion-item:hover {
          background: #d1fae5;
        }
        .submit-btn {
          background: #10b981;
          color: white;
          border: none;
          border-radius: 0.5rem;
          padding: 1rem;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
          margin-top: 1rem;
        }
        .submit-btn:hover {
          background: #059669;
        }
        .submit-btn:disabled {
          background: #a7f3d0;
          cursor: not-allowed;
        }
        .error-message {
          color: #dc2626;
          font-size: 0.875rem;
          margin-top: 0.25rem;
        }
        .success-card {
          background: #d1fae5;
          border-radius: 0.5rem;
          padding: 2rem;
          text-align: center;
        
        }
        .success-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #166534;
          margin-bottom: 1rem;
        }
        .ticket-details {
          text-align: left;
          background: white;
          border-radius: 0.5rem;
          padding: 1.5rem;
          margin: 1.5rem 0;
        }
        .ticket-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.75rem;
        }
        .ticket-label {
          font-weight: 600;
          color: #4b5563;
        }
        .ticket-value {
          color: #166534;
        }
        .action-buttons {
          display: flex;
          gap: 1rem;
          justify-content: center;
          align-items: center;
        }
        .or-separator {
          font-weight: 600;
          color: #166534;
          padding: 0 0.5rem;
          font-size: 1rem;
        }
        .action-btn {
          padding: 0.75rem 1.5rem;
          border-radius: 0.5rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }
        .print-btn {
          background: #10b981;
          color: white;
          border: none;
        }
        .print-btn:hover {
          background: #059669;
        }
        .new-booking-btn {
          background: white;
          color: #10b981;
          border: 1px solid #10b981;
        }
        .new-booking-btn:hover {
          background: #f0fdf4;
        }
        .features-container {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
          margin-top: 2rem;
          justify-content: center;
        }
        .feature-badge {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: #ecfdf5;
          color: #065f46;
          padding: 0.5rem 1rem;
          border-radius: 9999px;
          font-size: 0.875rem;
          font-weight: 500;
        }
        @media (max-width: 768px) {
          .form-row {
            flex-direction: column;
            gap: 1rem;
          }
          .booking-card {
            padding: 1.5rem;
          }
        }
      `}</style>

      <div className="booking-container">
        <div className="booking-card">
          {!success ? (
            <>
              <h1 className="booking-title">Book Your Bus Ticket</h1>
              <p className="booking-subtitle">
                Secure your seat with easy online booking
              </p>

              {error && <p className="error-message">{error}</p>}

              <form className="booking-form" onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">From</label>
                    <input
                      className="form-input"
                      type="text"
                      name="source"
                      placeholder="Enter boarding point"
                      value={form.source}
                      onChange={handleSourceChange}
                      required
                      autoComplete="off"
                    />
                    {sourceSuggestions.length > 0 && (
                      <div className="suggestions-list">
                        {sourceSuggestions.map((stop, idx) => (
                          <div
                            key={idx}
                            className="suggestion-item"
                            onClick={() => handleSourceSelect(stop)}
                          >
                            {stop}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="form-label">To</label>
                    <input
                      className="form-input"
                      type="text"
                      name="destination"
                      placeholder="Enter destination"
                      value={form.destination}
                      onChange={handleDestinationChange}
                      required
                      autoComplete="off"
                    />
                    {destinationSuggestions.length > 0 && (
                      <div className="suggestions-list">
                        {destinationSuggestions.map((stop, idx) => (
                          <div
                            key={idx}
                            className="suggestion-item"
                            onClick={() => handleDestinationSelect(stop)}
                          >
                            {stop}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Route</label>
                    <select
                      className="form-input"
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
                    {loadingRoutes && (
                      <p className="error-message">
                        Loading available routes...
                      </p>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Passengers</label>
                    <input
                      className="form-input"
                      type="number"
                      name="passengers"
                      min="1"
                      max="10"
                      value={form.passengers}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Vehicle No (Optional)</label>
                    <input
                      className="form-input"
                      type="text"
                      name="vehicleNo"
                      placeholder="e.g. DL01AB1234"
                      value={form.vehicleNo}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Total Fare</label>
                    <input
                      className="form-input"
                      type="text"
                      readOnly
                      value={
                        loadingFare
                          ? "Calculating..."
                          : fare !== null
                          ? `₹${fare * form.passengers}`
                          : "--"
                      }
                      style={{ fontWeight: "600", color: "#166534" }}
                    />
                  </div>
                </div>

                <button
                  className="submit-btn"
                  type="submit"
                  disabled={!fare || loadingBook}
                >
                  {loadingBook ? (
                    "Processing Payment..."
                  ) : (
                    <>Pay ₹{fare ? fare * form.passengers : "--"} & Book</>
                  )}
                </button>
              </form>
            </>
          ) : (
            <div className="success-card">
              <h2 className="success-title">🎉 Booking Confirmed!</h2>
              <div style={{ margin: "1.5rem 0" }}>
                <QRCodeCanvas
                  value={JSON.stringify({
                    bookingId: ticketDetails?.bookingId || generateBookingId(),
                    paymentId: ticketDetails?.paymentId,
                    routeNo: form.routeNo,
                    source: form.source,
                    destination: form.destination,
                    passengers: form.passengers,
                    fare: fare ? fare * form.passengers : "--",
                    date: new Date().toLocaleString(),
                    user: ticketDetails?.user || null,
                  })}
                  size={140}
                  bgColor="#fff"
                  fgColor="#166534"
                  level="H"
                  includeMargin={true}
                />
                <div
                  style={{
                    fontSize: "0.95rem",
                    color: "#4b5563",
                    marginTop: "0.5rem",
                  }}
                >
                  Show this QR code to the conductor for verification
                </div>
              </div>
              <div className="ticket-details">
                <div className="ticket-row">
                  <span className="ticket-label">Booking ID:</span>
                  <span className="ticket-value">
                    {ticketDetails?.bookingId || generateBookingId()}
                  </span>
                </div>
                <div className="ticket-row">
                  <span className="ticket-label">Route:</span>
                  <span className="ticket-value">{form.routeNo}</span>
                </div>
                <div className="ticket-row">
                  <span className="ticket-label">From:</span>
                  <span className="ticket-value">{form.source}</span>
                </div>
                <div className="ticket-row">
                  <span className="ticket-label">To:</span>
                  <span className="ticket-value">{form.destination}</span>
                </div>
                <div className="ticket-row">
                  <span className="ticket-label">Passengers:</span>
                  <span className="ticket-value">{form.passengers}</span>
                </div>
                <div className="ticket-row">
                  <span className="ticket-label">Total Paid:</span>
                  <span className="ticket-value">
                    ₹{fare ? fare * form.passengers : "--"}
                  </span>
                </div>
                <div className="ticket-row">
                  <span className="ticket-label">Payment ID:</span>
                  <span className="ticket-value">
                    {ticketDetails?.paymentId ||
                      "PAY_" +
                        Math.random().toString(36).substr(2, 8)}
                  </span>
                </div>
                <div className="ticket-row">
                  <span className="ticket-label">Date:</span>
                  <span className="ticket-value">
                    {new Date().toLocaleString()}
                  </span>
                </div>
                {ticketDetails?.user && (
                  <>
                    <div className="ticket-row">
                      <span className="ticket-label">Passenger:</span>
                      <span className="ticket-value">
                        {ticketDetails.user.name}
                      </span>
                    </div>
                    <div className="ticket-row">
                      <span className="ticket-label">Email:</span>
                      <span className="ticket-value">
                        {ticketDetails.user.email}
                      </span>
                    </div>
                    <div className="ticket-row">
                      <span className="ticket-label">Phone:</span>
                      <span className="ticket-value">
                        {ticketDetails.user.phone}
                      </span>
                    </div>
                  </>
                )}
              </div>

              <div className="action-buttons">
                <button
                  className="action-btn print-btn"
                  onClick={() => window.print()}
                >
                  Print Ticket
                </button>
                <span className="or-separator">OR</span>
                <button
                  className="action-btn new-booking-btn"
                  onClick={handleNewBooking}
                >
                  New Booking
                </button>
              </div>
            </div>
          )}

          <div className="features-container">
            <div className="feature-badge">
              <span>🚌</span>
              <span>Live Tracking</span>
            </div>
            <div className="feature-badge">
              <span>🪑</span>
              <span>Guaranteed Seat</span>
            </div>
            <div className="feature-badge">
              <span>🔔</span>
              <span>Journey Alerts</span>
            </div>
            <div className="feature-badge">
              <span>💳</span>
              <span>Secure Payments</span>
            </div>
            <div className="feature-badge">
              <span>📄</span>
              <span>e-Ticket</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Booking;