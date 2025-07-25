import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DriverProfile = () => {
  const [driver, setDriver] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const res = await axios.get("http://localhost:8080/api/driver/profile", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setDriver(res.data);
        setFormData({
          ...res.data,
          photo: null,
          password: "",
          confirmPassword: "",
        });
      } catch (err) {
        setDriver(null);
      }
    };
    fetchProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "photo") {
      setFormData(prev => ({
        ...prev,
        photo: files[0]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updateForm = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          updateForm.append(key, value);
        }
      });
      const token = localStorage.getItem("accessToken");
      const res = await axios.put(
        "http://localhost:8080/api/driver/profile",
        updateForm,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log(res.data);
      setDriver(res.data);
      console.log(res.data);
      setIsEditing(false);
    } catch (err) {
      alert("Failed to update profile.");
    }
  };

  // Dummy data for assigned bus and performance (replace with API data if available)
  const assignedBus = driver?.assignedBus || {
    busNumber: "DL1PC1234",
    route: "Connaught Place - Dwarka",
    shift: "Morning",
    status: "Active"
  };
  const performance = driver?.performance || {
    punctuality: "98%",
    feedback: "4.7/5",
    completedTrips: 120,
    incidents: 0
  };

  if (!driver || !formData) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        Loading profile...
      </div>
    );
  }

  return (
    <>
      <style>{`
        .driver-profile-container {
          background: #fff;
          border-radius: 1.2rem;
          box-shadow: 0 8px 32px rgba(22,163,74,0.13), 0 2px 8px rgba(22,163,74,0.08);
          padding: 1.5rem 1.2rem 1.2rem 1.2rem;
          margin: 1.5rem auto 2rem auto;
          background: linear-gradient(90deg, #f0fdf4 60%, #bbf7d0 100%);
          max-width: 1022px;
          width: 100%;
        }
        .profile-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid #e5e7eb;
          padding-bottom: 1rem;
          margin-bottom: 1rem;
        }
        .profile-photo-section {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .profile-photo {
          position: relative;
          width: 70px;
          height: 70px;
        }
        .profile-photo img {
          width: 70px;
          height: 70px;
          border-radius: 50%;
          object-fit: cover;
          border: 2.5px solid #bbf7d0;
          box-shadow: 0 2px 8px rgba(22,163,74,0.10);
          background: #e5e7eb;
        }
        .profile-basic h2 {
          font-size: 1.18rem;
          font-weight: 700;
          color: #166534;
          margin-bottom: 0.1rem;
        }
        .profile-basic .role {
          color: #4b5563;
          font-size: 0.98rem;
          margin-bottom: 0.1rem;
        }
        .profile-basic .status {
          font-size: 0.93rem;
          font-weight: 600;
          color: #16a34a;
          background: #bbf7d0;
          border-radius: 1rem;
          padding: 0.13rem 0.7rem;
          display: inline-block;
        }
        .profile-basic .status.inactive {
          color: #b91c1c;
          background: #fee2e2;
        }
        .profile-actions {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .btn-edit, .btn-save, .btn-cancel {
          background: #16a34a;
          color: #fff;
          border: none;
          border-radius: 0.7rem;
          padding: 0.4rem 1rem;
          font-size: 0.98rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }
        .btn-edit:hover, .btn-save:hover {
          background: #15803d;
        }
        .btn-cancel {
          background: #e5e7eb;
          color: #374151;
        }
        .btn-cancel:hover {
          background: #d1d5db;
        }
        .edit-actions {
          display: flex;
          gap: 0.4rem;
        }
        .profile-tabs {
          display: flex;
          gap: 0.7rem;
          margin-bottom: 1rem;
        }
        .profile-tabs button {
          background: #f0fdf4;
          color: #166534;
          border: none;
          border-radius: 0.7rem 0.7rem 0 0;
          padding: 0.5rem 1rem;
          font-size: 0.98rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s, color 0.2s;
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }
        .profile-tabs button.active, .profile-tabs button:focus {
          background: #16a34a;
          color: #fff;
        }
        .profile-content {
          padding: 0.3rem 0.1rem 0.3rem 0.1rem;
        }
        .profile-details .detail-row {
          display: flex;
          gap: 1rem;
          margin-bottom: 0.4rem;
        }
        .profile-details .detail-label {
          font-weight: 600;
          color: #166534;
          min-width: 110px;
        }
        .profile-details .detail-value {
          color: #374151;
        }
        .profile-form .form-group {
          margin-bottom: 0.7rem;
        }
        .profile-form label {
          font-weight: 600;
          color: #166534;
          margin-bottom: 0.15rem;
          display: block;
        }
        .profile-form input, .profile-form textarea {
          width: 100%;
          padding: 0.45rem;
          border: 1.5px solid #bbf7d0;
          border-radius: 0.5rem;
          font-size: 0.97rem;
          background: #f0fdf4;
          margin-top: 0.1rem;
          transition: border-color 0.2s;
        }
        .profile-form input:focus, .profile-form textarea:focus {
          outline: none;
          border-color: #16a34a;
          background: #fff;
        }
        .profile-form textarea {
          min-height: 45px;
          resize: vertical;
        }
        .profile-form h3 {
          margin-top: 1rem;
          margin-bottom: 0.4rem;
          color: #16a34a;
          font-size: 1.01rem;
        }
        .profile-details h3 {
          margin-top: 1rem;
          margin-bottom: 0.4rem;
          color: #16a34a;
          font-size: 1.01rem;
        }
        .profile-meta {
          margin-top: 1rem;
          font-size: 0.95rem;
          color: #64748b;
          text-align: right;
        }
        .assigned-bus-card, .performance-card {
          background: #f0fdf4;
          border-radius: 0.7rem;
          box-shadow: 0 1px 4px rgba(22,163,74,0.07);
          padding: 1rem 1.2rem;
          margin-bottom: 1rem;
        }
        .assigned-bus-title, .performance-title {
          font-size: 1.01rem;
          font-weight: 700;
          color: #166534;
          margin-bottom: 0.5rem;
        }
        .assigned-bus-details, .performance-details {
          font-size: 0.97rem;
          color: #374151;
        }
        @media (max-width: 600px) {
          .driver-profile-container {
            padding: 0.7rem 0.1rem;
            max-width: 99vw;
          }
          .profile-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.6rem;
          }
          .profile-photo-section {
            gap: 0.6rem;
          }
          .profile-details .detail-row {
            flex-direction: column;
            gap: 0.15rem;
          }
          .assigned-bus-card, .performance-card {
            padding: 0.7rem 0.5rem;
          }
        }
      `}</style>
      <div className="driver-profile-container">
        <div className="profile-header">
          <div className="profile-photo-section">
            <div className="profile-photo">
              <img
                src={
                  driver.photo
                    ? driver.photo
                    : "/images/profiles/default-driver.jpg"
                }
                // alt={driver.name}
                // onError={e => {
                //   e.target.onerror = null;
                //   e.target.src = '/images/profiles/default-driver.jpg'
                // }}
              />
              {isEditing && (
                <input
                  type="file"
                  id="photoInput"
                  name="photo"
                  accept="image/*"
                  style={{ display: 'block', marginTop: '0.5rem' }}
                  onChange={handleInputChange}
                />
              )}
            </div>
            <div className="profile-basic">
              <h2>{driver.name}</h2>
              <p className="role">{driver.role || "Driver"}</p>
              <p className={`status ${driver.status}`}>
                {driver.status ? driver.status.charAt(0).toUpperCase() + driver.status.slice(1) : "Active"}
              </p>
            </div>
          </div>
          <div className="profile-actions">
            {!isEditing ? (
              <button
                className="btn-edit"
                onClick={() => setIsEditing(true)}
              >
                <ion-icon name="create-outline"></ion-icon> Edit
              </button>
            ) : (
              <div className="edit-actions">
                <button
                  className="btn-cancel"
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setFormData({
                      ...driver,
                      password: "",
                      confirmPassword: "",
                      photo: null,
                    });
                  }}
                >
                  Cancel
                </button>
                <button
                  className="btn-save"
                  type="submit"
                  onClick={handleSubmit}
                >
                  Save
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="profile-tabs">
          <button
            className={activeTab === 'profile' ? 'active' : ''}
            onClick={() => setActiveTab('profile')}
          >
            <ion-icon name="person-outline"></ion-icon> Profile
          </button>
          <button
            className={activeTab === 'bus' ? 'active' : ''}
            onClick={() => setActiveTab('bus')}
          >
            <ion-icon name="bus-outline"></ion-icon> Assigned Bus
          </button>
          <button
            className={activeTab === 'performance' ? 'active' : ''}
            onClick={() => setActiveTab('performance')}
          >
            <ion-icon name="stats-chart-outline"></ion-icon> Performance
          </button>
        </div>

        {activeTab === 'profile' && (
          <div className="profile-content">
            {isEditing ? (
              <form className="profile-form" onSubmit={handleSubmit} autoComplete="off">
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>License Number</label>
                  <input
                    type="text"
                    name="licenseNumber"
                    value={formData.licenseNumber}
                    disabled
                  />
                </div>
                <div className="form-group">
                  <label>License Expiry</label>
                  <input
                    type="date"
                    name="licenseExpiry"
                    value={formData.licenseExpiry}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Address</label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows="2"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Experience (years)</label>
                  <input
                    type="number"
                    name="experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                    min={0}
                    required
                  />
                </div>
                <h3 style={{ borderBottom: "2px solid #16a34a", paddingBottom: "0.5rem" }}>Emergency Contact Details</h3>
                <div className="form-group">
                  <label>Name</label>
                  <input
                    type="text"
                    name="emergencyName"
                    value={formData.emergencyName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Relationship</label>
                  <input
                    type="text"
                    name="emergencyRelationship"
                    value={formData.emergencyRelationship}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input
                    type="tel"
                    name="emergencyPhone"
                    value={formData.emergencyPhone}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Password</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password || ""}
                    onChange={handleInputChange}
                    autoComplete="new-password"
                  />
                </div>
                <div className="form-group">
                  <label>Confirm Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword || ""}
                    onChange={handleInputChange}
                    autoComplete="new-password"
                  />
                </div>
                <button className="btn-save" type="submit">
                  Save Changes
                </button>
              </form>
            ) : (
              <div className="profile-details">
                <div className="detail-row">
                  <span className="detail-label">Name:</span>
                  <span className="detail-value">{driver.name}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Email:</span>
                  <span className="detail-value">{driver.email}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Phone:</span>
                  <span className="detail-value">{driver.phone}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">License Number:</span>
                  <span className="detail-value">{driver.licenseNumber}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">License Expiry:</span>
                  <span className="detail-value">{driver.licenseExpiry}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Address:</span>
                  <span className="detail-value">{driver.address}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Experience:</span>
                  <span className="detail-value">{driver.experience} years</span>
                </div>
                <h3>Emergency Contact</h3>
                <div className="detail-row">
                  <span className="detail-label">Name:</span>
                  <span className="detail-value">{driver.emergencyName}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Relationship:</span>
                  <span className="detail-value">{driver.emergencyRelationship}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Phone:</span>
                  <span className="detail-value">{driver.emergencyPhone}</span>
                </div>
              </div>
            )}
            <div className="profile-meta">
              Last updated: {driver.updatedAt ? new Date(driver.updatedAt).toLocaleString() : "N/A"}
            </div>
          </div>
        )}

        {activeTab === 'bus' && (
          <div className="assigned-bus-card">
            <div className="assigned-bus-title">
              <ion-icon name="bus-outline"></ion-icon> Assigned Bus Details
            </div>
            <div className="assigned-bus-details">
              <div><strong>Bus Number:</strong> {assignedBus.busNumber}</div>
              <div><strong>Route:</strong> {assignedBus.route}</div>
              <div><strong>Shift:</strong> {assignedBus.shift}</div>
              <div>
                <strong>Status:</strong>{" "}
                <span style={{
                  color: assignedBus.status === "Active" ? "#16a34a" : "#b91c1c",
                  fontWeight: 600
                }}>
                  {assignedBus.status}
                </span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'performance' && (
          <div className="performance-card">
            <div className="performance-title">
              <ion-icon name="stats-chart-outline"></ion-icon> Performance Overview
            </div>
            <div className="performance-details">
              <div><strong>Punctuality:</strong> {performance.punctuality}</div>
              <div><strong>Feedback:</strong> {performance.feedback}</div>
              <div><strong>Completed Trips:</strong> {performance.completedTrips}</div>
              <div><strong>Incidents:</strong> {performance.incidents}</div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default DriverProfile;