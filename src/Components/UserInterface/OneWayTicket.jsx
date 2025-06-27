import React, { useState } from "react";
import { FaArrowLeft, FaBus, FaRoute, FaMapMarkerAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const OneWayTicket = () => {
  const navigate = useNavigate();
  const [routeNumber, setRouteNumber] = useState("");
  const [startStop, setStartStop] = useState("");
  const [endStop, setEndStop] = useState("");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const goBack = () => {
    navigate(-1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!routeNumber || !startStop || !endStop) {
      setError("Please fill all fields.");
      return;
    }
    setError("");
    setSubmitted(true);
    // In a real app, proceed to next step or payment
  };

  return (
    <>
      <style>{`
        .oneway-bg {
          min-height: 100vh;
          background: #f3f4f6;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding-top: 2.5rem;
        }
        .oneway-card {
          background: #fff;
          border-radius: 1.2rem;
          box-shadow: 0 2px 12px rgba(22,163,74,0.08);
          max-width: 420px;
          width: 100%;
          padding: 2rem 1.5rem 1.5rem 1.5rem;
        }
        .oneway-header {
          display: flex;
          align-items: center;
          margin-bottom: 1.5rem;
        }
        .oneway-header h1 {
          font-size: 1.3rem;
          font-weight: 700;
          color: #166534;
          margin-left: 0.7rem;
        }
        .oneway-form {
          display: flex;
          flex-direction: column;
          gap: 1.1rem;
        }
        .oneway-input-group {
          display: flex;
          align-items: center;
          gap: 0.7rem;
          background: #f0fdf4;
          border-radius: 0.7rem;
          padding: 0.7rem 1rem;
        }
        .oneway-input-group input {
          border: none;
          background: transparent;
          outline: none;
          font-size: 1rem;
          width: 100%;
          color: #374151;
          padding: 0.5rem 0;
        }
        .oneway-input-group input::placeholder {
          color: #6b7280;
        }
        .oneway-input-group:focus-within {
          box-shadow: 0 0 0 2px #16a34a33;
        }
        .oneway-error {
          color: #dc2626;
          background: #fee2e2;
          border-radius: 0.5rem;
          padding: 0.5rem 1rem;
          font-size: 0.97rem;
          margin-bottom: 0.5rem;
          text-align: center;
        }
        .oneway-success {
          color: #16a34a;
          background: #bbf7d0;
          border-radius: 0.5rem;
          padding: 1.2rem 1rem;
          font-size: 1.1rem;
          margin-bottom: 0.5rem;
          text-align: center;
        }
        .oneway-btn {
          background: #166534;
          color: #fff;
          width: 100%;
          padding: 0.8rem;
          border: none;
          border-radius: 0.7rem;
          font-size: 1.1rem;
          font-weight: 700;
          cursor: pointer;
          margin-top: 0.5rem;
          transition: background 0.2s;
        }
        .oneway-btn:hover {
          background: #15803d;
        }
        @media (max-width: 600px) {
          .oneway-card {
            padding: 1.2rem 0.5rem 1rem 0.5rem;
          }
        }
      `}</style>
      <div className="oneway-bg">
        <div className="oneway-card">
          <div className="oneway-header">
            <FaArrowLeft className="text-xl cursor-pointer" onClick={goBack} />
            <h1>Select One Way Trip</h1>
          </div>
          {error && <div className="oneway-error">{error}</div>}
          {submitted ? (
            <div className="oneway-success">
              <strong>Trip Selected!</strong>
              <div style={{ marginTop: "0.7rem" }}>
                <div>
                  <FaRoute className="inline mr-2 text-green-600" />
                  <span>Route: {routeNumber}</span>
                </div>
                <div>
                  <FaMapMarkerAlt className="inline mr-2 text-blue-600" />
                  <span>From: {startStop}</span>
                </div>
                <div>
                  <FaMapMarkerAlt className="inline mr-2 text-red-600" />
                  <span>To: {endStop}</span>
                </div>
              </div>
              <div style={{ marginTop: "1.2rem" }}>
                <button
                  className="oneway-btn"
                  onClick={() => alert("Proceed to payment or next step")}
                >
                  Continue
                </button>
              </div>
            </div>
          ) : (
            <form className="oneway-form" onSubmit={handleSubmit}>
              <div className="oneway-input-group">
                <FaRoute className="text-green-600 text-lg" />
                <input
                  type="text"
                  placeholder="Enter Route Number"
                  value={routeNumber}
                  onChange={e => setRouteNumber(e.target.value)}
                />
              </div>
              <div className="oneway-input-group">
                <FaMapMarkerAlt className="text-blue-600 text-lg" />
                <input
                  type="text"
                  placeholder="Enter Start Stop"
                  value={startStop}
                  onChange={e => setStartStop(e.target.value)}
                />
              </div>
              <div className="oneway-input-group">
                <FaMapMarkerAlt className="text-red-600 text-lg" />
                <input
                  type="text"
                  placeholder="Enter End Stop"
                  value={endStop}
                  onChange={e => setEndStop(e.target.value)}
                />
              </div>
              <button className="oneway-btn" type="submit">
                Next
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  );
};

export default OneWayTicket;