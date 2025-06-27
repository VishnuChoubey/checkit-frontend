import React, { useState } from 'react';

const EmergencyPage = () => {
  const [emergencyType, setEmergencyType] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, this would send to backend
    console.log({ emergencyType, location, description });
    setSubmitted(true);
  };

  return (
    <>
      <style>{`
        .emergency-bg {
          min-height: 100vh;
          background: linear-gradient(120deg, #bbf7d0 0%, #16a34a 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem 1rem;
        }
        .emergency-card {
          background: #fff;
          border-radius: 1.5rem;
          box-shadow: 0 6px 32px rgba(22,163,74,0.10), 0 1.5px 6px rgba(22,163,74,0.08);
          padding: 2.5rem 2rem 2rem 2rem;
          max-width: 400px;
          width: 100%;
          position: relative;
        }
        .emergency-separator {
          position: absolute;
          left: 50%;
          top: -18px;
          transform: translateX(-50%);
          width: 60px;
          height: 7px;
          background: #f87171;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(239,68,68,0.15);
          border: 1.5px solid #dc2626;
        }
        .emergency-title {
          font-size: 2rem;
          font-weight: 800;
          color: #dc2626;
          margin-bottom: 0.2rem;
          letter-spacing: 0.04em;
          text-align: center;
        }
        .emergency-form {
          margin-top: 1.5rem;
        }
        .form-group {
          margin-bottom: 1.1rem;
          text-align: left;
        }
        .form-group label {
          display: block;
          font-weight: 600;
          margin-bottom: 0.4rem;
          color: #166534;
        }
        .form-group input,
        .form-group select,
        .form-group textarea {
          width: 100%;
          padding: 0.65rem;
          border: 1.5px solid #bbf7d0;
          border-radius: 0.5rem;
          font-size: 1rem;
          background: #f0fdf4;
          transition: border-color 0.2s;
        }
        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #16a34a;
          background: #fff;
        }
        .form-group textarea {
          min-height: 80px;
          resize: vertical;
        }
        .emergency-button {
          width: 100%;
          padding: 0.7rem;
          background: linear-gradient(90deg, #dc2626 60%, #f87171 100%);
          color: #fff;
          border: none;
          border-radius: 0.7rem;
          font-size: 1.1rem;
          font-weight: 700;
          cursor: pointer;
          margin-top: 0.2rem;
          margin-bottom: 0.7rem;
          box-shadow: 0 2px 8px rgba(239,68,68,0.10);
          transition: background 0.2s;
        }
        .emergency-button:hover {
          background: linear-gradient(90deg, #b91c1c 60%, #f87171 100%);
        }
        .success-message {
          text-align: center;
          padding: 2rem 0.5rem;
        }
        .success-message h3 {
          color: #16a34a;
          font-size: 1.4rem;
          font-weight: 700;
          margin-bottom: 0.7rem;
        }
        .success-message p {
          color: #374151;
          font-size: 1.05rem;
        }
        @media (max-width: 600px) {
          .emergency-card {
            padding: 1.5rem 0.7rem 1rem 0.7rem;
          }
        }
      `}</style>
      <div className="emergency-bg">
        <div className="emergency-card">
          <div className="emergency-separator"></div>
          <h2 className="emergency-title">Emergency Notification</h2>
          {submitted ? (
            <div className="success-message">
              <h3>Emergency Reported Successfully!</h3>
              <p>Our team has been notified and help is on the way.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="emergency-form">
              <div className="form-group">
                <label>Emergency Type:</label>
                <select
                  value={emergencyType}
                  onChange={(e) => setEmergencyType(e.target.value)}
                  required
                >
                  <option value="">Select an emergency type</option>
                  <option value="accident">Accident</option>
                  <option value="breakdown">Vehicle Breakdown</option>
                  <option value="medical">Medical Emergency</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label>Location:</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Current location or nearest landmark"
                  required
                />
              </div>

              <div className="form-group">
                <label>Description:</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide details about the emergency"
                  required
                />
              </div>

              <button type="submit" className="emergency-button">
                Send Emergency Alert
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  );
};

export default EmergencyPage;