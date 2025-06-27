import React, { useState } from 'react';

const SIDEBAR_WIDTH = 220; // Match your sidebar width

const DriverProfile = () => {
  // Sample driver data - in a real app, this would come from authentication/API
  const [driver, setDriver] = useState({
    id: 'DRV-78945',
    name: 'Rajesh Kumar',
    role: 'Senior Driver',
    email: 'rajesh.kumar@buscompany.com',
    phone: '+91 9876543210',
    licenseNumber: 'DL0420211234567',
    licenseExpiry: '2025-12-31',
    address: '123 MG Road, New Delhi, India',
    experience: '8 years',
    status: 'active',
    profilePhoto: 'driver-profile.jpg',
    emergencyContact: {
      name: 'Priya Kumar',
      relationship: 'Wife',
      phone: '+91 8765432109'
    },
    assignedBus: {
      number: 'DL04PB7890',
      route: 'Downtown to University',
      type: 'AC Volvo'
    },
    performance: {
      rating: 4.7,
      tripsCompleted: 1245,
      punctuality: '95%'
    }
  });

  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...driver });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEmergencyContactChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      emergencyContact: {
        ...prev.emergencyContact,
        [name]: value
      }
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setDriver(formData);
    setIsEditing(false);
  };

  return (
    <>
      <style>{`
        .driver-profile-container {
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
        .profile-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 2rem;
          border-bottom: 1px solid #e5e7eb;
          padding-bottom: 1.5rem;
          margin-bottom: 1.5rem;
        }
        .profile-photo-section {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }
        .profile-photo {
          position: relative;
          width: 90px;
          height: 90px;
        }
        .profile-photo img {
          width: 90px;
          height: 90px;
          border-radius: 50%;
          object-fit: cover;
          border: 3px solid #bbf7d0;
          box-shadow: 0 2px 8px rgba(22,163,74,0.10);
        }
        .btn-change-photo {
          position: absolute;
          bottom: 0;
          right: 0;
          background: #16a34a;
          color: #fff;
          border: none;
          border-radius: 50%;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(22,163,74,0.10);
          font-size: 1.2rem;
        }
        .profile-basic h2 {
          font-size: 1.5rem;
          font-weight: 700;
          color: #166534;
          margin-bottom: 0.2rem;
        }
        .profile-basic .role {
          color: #4b5563;
          font-size: 1rem;
          margin-bottom: 0.2rem;
        }
        .profile-basic .status {
          font-size: 0.98rem;
          font-weight: 600;
          color: #16a34a;
          background: #bbf7d0;
          border-radius: 1rem;
          padding: 0.2rem 0.8rem;
          display: inline-block;
        }
        .profile-basic .status.inactive {
          color: #b91c1c;
          background: #fee2e2;
        }
        .profile-actions {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .btn-edit, .btn-save, .btn-cancel {
          background: #16a34a;
          color: #fff;
          border: none;
          border-radius: 0.7rem;
          padding: 0.6rem 1.2rem;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
          display: flex;
          align-items: center;
          gap: 0.5rem;
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
          gap: 0.7rem;
        }
        .profile-tabs {
          display: flex;
          gap: 1.2rem;
          margin-bottom: 1.5rem;
        }
        .profile-tabs button {
          background: #f0fdf4;
          color: #166534;
          border: none;
          border-radius: 0.7rem 0.7rem 0 0;
          padding: 0.7rem 1.5rem;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s, color 0.2s;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .profile-tabs button.active, .profile-tabs button:focus {
          background: #16a34a;
          color: #fff;
        }
        .profile-content, .assigned-content, .performance-content {
          padding: 1.2rem 0.2rem 0.5rem 0.2rem;
        }
        .profile-details .detail-row {
          display: flex;
          gap: 1.5rem;
          margin-bottom: 0.7rem;
        }
        .profile-details .detail-label {
          font-weight: 600;
          color: #166534;
          min-width: 140px;
        }
        .profile-details .detail-value {
          color: #374151;
        }
        .profile-form .form-group {
          margin-bottom: 1rem;
        }
        .profile-form label {
          font-weight: 600;
          color: #166534;
          margin-bottom: 0.2rem;
          display: block;
        }
        .profile-form input, .profile-form textarea {
          width: 100%;
          padding: 0.6rem;
          border: 1.5px solid #bbf7d0;
          border-radius: 0.5rem;
          font-size: 1rem;
          background: #f0fdf4;
          margin-top: 0.2rem;
          transition: border-color 0.2s;
        }
        .profile-form input:focus, .profile-form textarea:focus {
          outline: none;
          border-color: #16a34a;
          background: #fff;
        }
        .profile-form textarea {
          min-height: 60px;
          resize: vertical;
        }
        .assigned-content .bus-card {
          display: flex;
          align-items: center;
          gap: 1.2rem;
          background: #f0fdf4;
          border-radius: 1rem;
          padding: 1.2rem 1.5rem;
          margin-bottom: 1.5rem;
          box-shadow: 0 2px 8px rgba(22,163,74,0.06);
        }
        .assigned-content .bus-icon {
          font-size: 2.5rem;
          color: #16a34a;
          background: #bbf7d0;
          border-radius: 50%;
          padding: 0.7rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .assigned-content .bus-details h3 {
          font-size: 1.2rem;
          font-weight: 700;
          color: #166534;
          margin-bottom: 0.2rem;
        }
        .assigned-content .bus-details p {
          color: #374151;
          font-size: 1rem;
          margin-bottom: 0.2rem;
        }
        .assigned-content .route-info {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          color: #15803d;
          font-size: 0.98rem;
        }
        .assigned-content .schedule-info {
          background: #fff;
          border-radius: 0.7rem;
          box-shadow: 0 1px 4px rgba(22,163,74,0.05);
          padding: 1rem 1.2rem;
        }
        .assigned-content .schedule-info h3 {
          font-size: 1.1rem;
          font-weight: 700;
          color: #16a34a;
          margin-bottom: 0.7rem;
        }
        .assigned-content .schedule-item {
          display: flex;
          align-items: center;
          gap: 1.2rem;
          margin-bottom: 0.5rem;
        }
        .assigned-content .schedule-time {
          font-weight: 600;
          color: #166534;
          min-width: 90px;
        }
        .assigned-content .schedule-route {
          color: #374151;
        }
        .performance-content .performance-stats {
          display: flex;
          gap: 2rem;
          margin-bottom: 2rem;
        }
        .performance-content .stat-card {
          background: #f0fdf4;
          border-radius: 1rem;
          padding: 1.2rem 1.5rem;
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          box-shadow: 0 2px 8px rgba(22,163,74,0.06);
        }
        .performance-content .stat-value {
          font-size: 2rem;
          font-weight: 800;
          color: #16a34a;
          margin-bottom: 0.2rem;
        }
        .performance-content .stat-label {
          color: #374151;
          font-size: 1rem;
          margin-bottom: 0.2rem;
        }
        .performance-content .stat-stars ion-icon {
          color: #facc15;
          font-size: 1.2rem;
        }
        .performance-content .performance-graph {
          background: #fff;
          border-radius: 1rem;
          box-shadow: 0 1px 4px rgba(22,163,74,0.05);
          padding: 1.2rem 1.5rem;
        }
        .performance-content .performance-graph h3 {
          font-size: 1.1rem;
          font-weight: 700;
          color: #16a34a;
          margin-bottom: 0.7rem;
        }
        .performance-content .graph-placeholder {
          background: #f0fdf4;
          border-radius: 0.7rem;
          padding: 1.2rem;
          text-align: center;
          color: #94a3b8;
        }
        @media (max-width: 900px) {
          .driver-profile-container {
            margin-left: 0;
            padding: 1.2rem 0.5rem;
          }
          .profile-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }
          .performance-content .performance-stats {
            flex-direction: column;
            gap: 1rem;
          }
        }
      `}</style>
      <div className="driver-profile-container">
        <div className="profile-header">
          <div className="profile-photo-section">
            <div className="profile-photo">
              <img
                src={`/images/profiles/${driver.profilePhoto}`}
                alt={driver.name}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/images/profiles/default-driver.jpg'
                }}
              />
              {!isEditing && (
                <button
                  className="btn-change-photo"
                  onClick={() => document.getElementById('photoInput').click()}
                >
                  <ion-icon name="camera-outline"></ion-icon>
                </button>
              )}
              <input
                type="file"
                id="photoInput"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={(e) => {
                  // Handle photo upload logic here
                }}
              />
            </div>
            <div className="profile-basic">
              <h2>{driver.name}</h2>
              <p className="role">{driver.role}</p>
              <p className={`status ${driver.status}`}>
                {driver.status.charAt(0).toUpperCase() + driver.status.slice(1)}
              </p>
            </div>
          </div>
          <div className="profile-actions">
            {!isEditing ? (
              <button
                className="btn-edit"
                onClick={() => {
                  setFormData({ ...driver });
                  setIsEditing(true);
                }}
              >
                <ion-icon name="create-outline"></ion-icon> Edit Profile
              </button>
            ) : (
              <div className="edit-actions">
                <button
                  className="btn-cancel"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn-save"
                  onClick={handleSubmit}
                >
                  Save Changes
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
            className={activeTab === 'assigned' ? 'active' : ''}
            onClick={() => setActiveTab('assigned')}
          >
            <ion-icon name="bus-outline"></ion-icon> Assigned Bus
          </button>
          <button
            className={activeTab === 'performance' ? 'active' : ''}
            onClick={() => setActiveTab('performance')}
          >
            <ion-icon name="speedometer-outline"></ion-icon> Performance
          </button>
        </div>

        {activeTab === 'profile' && (
          <div className="profile-content">
            {isEditing ? (
              <form className="profile-form">
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>License Number</label>
                  <input
                    type="text"
                    name="licenseNumber"
                    value={formData.licenseNumber}
                    onChange={handleInputChange}
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
                  />
                </div>
                <div className="form-group">
                  <label>Address</label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows="3"
                  />
                </div>

                <h3>Emergency Contact</h3>
                <div className="form-group">
                  <label>Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.emergencyContact.name}
                    onChange={handleEmergencyContactChange}
                  />
                </div>
                <div className="form-group">
                  <label>Relationship</label>
                  <input
                    type="text"
                    name="relationship"
                    value={formData.emergencyContact.relationship}
                    onChange={handleEmergencyContactChange}
                  />
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.emergencyContact.phone}
                    onChange={handleEmergencyContactChange}
                  />
                </div>
              </form>
            ) : (
              <div className="profile-details">
                <div className="detail-row">
                  <span className="detail-label">Driver ID:</span>
                  <span className="detail-value">{driver.id}</span>
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
                  <span className="detail-value">{new Date(driver.licenseExpiry).toLocaleDateString()}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Address:</span>
                  <span className="detail-value">{driver.address}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Experience:</span>
                  <span className="detail-value">{driver.experience}</span>
                </div>

                <h3>Emergency Contact</h3>
                <div className="detail-row">
                  <span className="detail-label">Name:</span>
                  <span className="detail-value">{driver.emergencyContact.name}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Relationship:</span>
                  <span className="detail-value">{driver.emergencyContact.relationship}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Phone:</span>
                  <span className="detail-value">{driver.emergencyContact.phone}</span>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'assigned' && (
          <div className="assigned-content">
            <div className="bus-card">
              <div className="bus-icon">
                <ion-icon name="bus"></ion-icon>
              </div>
              <div className="bus-details">
                <h3>{driver.assignedBus.number}</h3>
                <p>{driver.assignedBus.type}</p>
                <div className="route-info">
                  <ion-icon name="location-outline"></ion-icon>
                  <span>{driver.assignedBus.route}</span>
                </div>
              </div>
            </div>
            <div className="schedule-info">
              <h3>Current Schedule</h3>
              <div className="schedule-item">
                <div className="schedule-time">06:00 AM</div>
                <div className="schedule-route">Downtown to University</div>
              </div>
              <div className="schedule-item">
                <div className="schedule-time">09:30 AM</div>
                <div className="schedule-route">University to Downtown</div>
              </div>
              <div className="schedule-item">
                <div className="schedule-time">02:00 PM</div>
                <div className="schedule-route">Downtown to Central Station</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'performance' && (
          <div className="performance-content">
            <div className="performance-stats">
              <div className="stat-card">
                <div className="stat-value">{driver.performance.rating}</div>
                <div className="stat-label">Average Rating</div>
                <div className="stat-stars">
                  {[...Array(5)].map((_, i) => (
                    <ion-icon
                      key={i}
                      name={i < Math.floor(driver.performance.rating) ? 'star' : 'star-outline'}
                    ></ion-icon>
                  ))}
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{driver.performance.tripsCompleted}</div>
                <div className="stat-label">Trips Completed</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{driver.performance.punctuality}</div>
                <div className="stat-label">Punctuality</div>
              </div>
            </div>

            <div className="performance-graph">
              <h3>Monthly Performance</h3>
              <div className="graph-placeholder">
                {/* In a real app, this would be a chart component */}
                <p>Performance chart would be displayed here</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default DriverProfile;