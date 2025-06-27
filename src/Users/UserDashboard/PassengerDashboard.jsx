import React, { useState, useEffect } from 'react';
import Navbar from '../../Components/Main/Navbar';

const PassengerDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [ticketHistory, setTicketHistory] = useState([
    // {
    //   id: 1,
    //   route: "Route 101",
    //   date: "2024-06-20",
    //   time: "10:30 AM",
    //   status: "Completed",
    //   fare: 25,
    // },
    // {
    //   id: 2,
    //   route: "Route 202",
    //   date: "2024-06-18",
    //   time: "2:15 PM",
    //   status: "Cancelled",
    //   fare: 30,
    // },
    // {
    //   id: 3,
    //   route: "Route 303",
    //   date: "2024-06-15",
    //   time: "8:00 AM",
    //   status: "Completed",
    //   fare: 20,
    // },
  ]);
  const [walletBalance, setWalletBalance] = useState(350);
  const [favoriteRoutes, setFavoriteRoutes] = useState([
    // {
    //   id: 1,
    //   name: "Route 101",
    //   from: "Station A",
    //   to: "Station B",
    // },
    // {
    //   id: 2,
    //   name: "Route 202",
    //   from: "Station C",
    //   to: "Station D",
    // },
  ]);
  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [profileError, setProfileError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      setLoadingProfile(true);
      setProfileError("");
      try {
        const token = localStorage.getItem("accessToken");
        const response = await fetch("http://localhost:8080/api/user/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          console.log("Profile data:", data);
          setProfile(data);
        } else {
          setProfileError("Failed to load profile.");
        }
      } catch (err) {
        setProfileError("Failed to load profile.");
      }
      setLoadingProfile(false);
    };
    fetchProfile();
  }, []);

  return (
    <>
      <Navbar />
      <style>{`
        .passenger-container {
          max-width: 1050px;
          margin: 0 auto;
          background: #fff;
          border-radius: 1.2rem;
          box-shadow: 0 2px 12px rgba(22,163,74,0.08);
          padding: 2.5rem 2rem 2rem 2rem;
          min-height: 80vh;
          padding-left: 150px;
          padding-right: 0px;
        }
        .passenger-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 2rem;
          border-bottom: 1px solid #e5e7eb;
          padding-bottom: 1.5rem;
          margin-bottom: 1.5rem;
        }
        .profile-section {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }
        .profile-picture {
          width: 90px;
          height: 90px;
          border-radius: 50%;
          object-fit: cover;
          border: 3px solid #16a34a;
          background: #f0fdf4;
        }
        .profile-details {
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
        }
        .profile-details .profile-name {
          font-size: 1.3rem;
          font-weight: 700;
          color: #166534;
        }
        .profile-details .profile-email {
          color: #4b5563;
          font-size: 1rem;
        }
        .profile-details .profile-phone {
          color: #374151;
          font-size: 0.98rem;
        }
        .wallet-balance {
          display: flex;
          align-items: center;
          gap: 1rem;
          background: #f0fdf4;
          border-radius: 1rem;
          padding: 0.7rem 1.5rem;
        }
        .wallet-balance ion-icon {
          font-size: 2rem;
          color: #16a34a;
        }
        .wallet-balance span {
          color: #374151;
          font-size: 0.98rem;
        }
        .wallet-balance h3 {
          color: #16a34a;
          font-size: 1.3rem;
          font-weight: 800;
          margin: 0;
        }
        .btn-add-money {
          background: #16a34a;
          color: #fff;
          border: none;
          border-radius: 0.7rem;
          padding: 0.5rem 1.1rem;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.3rem;
          transition: background 0.2s;
        }
        .btn-add-money:hover {
          background: #15803d;
        }
        .profile-loading, .profile-error {
          color: #b91c1c;
          font-size: 1rem;
          margin-bottom: 1rem;
        }
        .passenger-tabs {
          display: flex;
          gap: 1.5rem;
          margin-bottom: 2rem;
          margin-top: 1.5rem;
        }
        .passenger-tabs button {
          background: none;
          border: none;
          font-size: 1.1rem;
          font-weight: 600;
          color: #166534;
          padding: 0.6rem 1.2rem;
          border-radius: 0.7rem;
          cursor: pointer;
          transition: background 0.2s, color 0.2s;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .passenger-tabs button.active, .passenger-tabs button:hover {
          background: #bbf7d0;
          color: #15803d;
        }
       .dashboard-content,
.tickets-content,
.routes-content {
  margin-top: 2rem;
  padding: 1.5rem;
  background-color: #f9f9f9;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.dashboard-content h2 {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.dashboard-subtitle {
  font-size: 1rem;
  color: #666;
  margin-bottom: 1.5rem;
}

.dashboard-cards {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.dashboard-card {
  flex: 1 1 250px;
  background: white;
  padding: 1rem;
  border-radius: 10px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s;
}

.dashboard-card:hover {
  transform: translateY(-4px);
}

.dashboard-card i {
  font-size: 2rem;
  color: #007bff;
  margin-bottom: 0.5rem;
}

        .ticket-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 1rem;
        }
        .ticket-table th, .ticket-table td {
          border: 1px solid #e5e7eb;
          padding: 0.7rem 1rem;
          text-align: left;
        }
        .ticket-table th {
          background: #f0fdf4;
          color: #166534;
        }
        .ticket-table td.status-Completed {
          color: #16a34a;
          font-weight: 600;
        }
        .ticket-table td.status-Cancelled {
          color: #dc2626;
          font-weight: 600;
        }
        .favorite-routes-list {
          margin-top: 1rem;
        }
        .favorite-route-card {
          background: #f0fdf4;
          border-radius: 0.7rem;
          padding: 1rem 1.5rem;
          margin-bottom: 1rem;
          box-shadow: 0 1px 4px rgba(22,163,74,0.07);
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
        }
        @media (max-width: 900px) {
          .passenger-container {
            padding: 1.2rem 0.5rem;
          }
          .passenger-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }
          .profile-section {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.7rem;
          }
        }
      `}</style>
      <div className="passenger-container">
        <div className="passenger-header">
          <div className="profile-section">
            {loadingProfile ? (
              <div className="profile-loading">Loading profile...</div>
            ) : profileError ? (
              <div className="profile-error">{profileError}</div>
            ) : profile ? (
              <>
                <img
                  className="profile-picture"
                  src={
                    profile.profilePictureUrl
                      ? `http://localhost:8080${profile.profilePictureUrl}`
                      : "https://ui-avatars.com/api/?name=" + encodeURIComponent(profile.name || "User")
                  }
                  alt="Profile"
                />
                <div className="profile-details">
                  <span className="profile-name">{profile.name}</span>
                  <span className="profile-email">{profile.email}</span>
                  <span className="profile-phone">{profile.phone}</span>
                </div>
              </>
            ) : null}
          </div>
          <div className="wallet-balance">
            <ion-icon name="wallet-outline"></ion-icon>
            <div>
              <span>Wallet Balance</span>
              <h3>₹{0}</h3>
            </div>
            <button className="btn-add-money">
              <ion-icon name="add-outline"></ion-icon> Add Money
            </button>
          </div>
        </div>
        {/* Tabs */}
        <div className="passenger-tabs">
          <button 
            className={activeTab === 'dashboard' ? 'active' : ''}
            onClick={() => setActiveTab('dashboard')}
          >
            <ion-icon name="home-outline"></ion-icon> Dashboard
          </button>
          <button 
            className={activeTab === 'tickets' ? 'active' : ''}
            onClick={() => setActiveTab('tickets')}
          >
            <ion-icon name="ticket-outline"></ion-icon> My Tickets
          </button>
          <button 
            className={activeTab === 'routes' ? 'active' : ''}
            onClick={() => setActiveTab('routes')}
          >
            <ion-icon name="map-outline"></ion-icon> Favorite Routes
          </button>
        </div>
        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="dashboard-content">
  <h2>Welcome{profile && profile.name ? `, ${profile.name}` : ""}!</h2>
  <p className="dashboard-subtitle">
    Manage your tickets, wallet, and favorite routes all in one place.
  </p>

  <div className="dashboard-cards">
    <div className="dashboard-card">
      <i className="fa fa-ticket" />
      <h4>Ticket History</h4>
      <p>Review your previous travel details and rebook easily.</p>
    </div>
    <div className="dashboard-card">
      <i className="fa fa-wallet" />
      <h4>Wallet</h4>
      <p>Check your balance, add funds, or manage transactions.</p>
    </div>
    <div className="dashboard-card">
      <i className="fa fa-map-marker" />
      <h4>Favorite Routes</h4>
      <p>Track and manage your most used bus routes.</p>
    </div>
  </div>
</div>

        )}
        {/* Tickets Tab */}
        {activeTab === 'tickets' && (
          <div className="tickets-content">
            <h2>My Tickets</h2>
            <table className="ticket-table">
              <thead>
                <tr>
                  <th>Route</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Status</th>
                  <th>Fare</th>
                </tr>
              </thead>
              <tbody>
                {ticketHistory.map((ticket) => (
                  <tr key={ticket.id}>
                    <td>{ticket.route}</td>
                    <td>{ticket.date}</td>
                    <td>{ticket.time}</td>
                    <td className={`status-${ticket.status}`}>{ticket.status}</td>
                    <td>₹{ticket.fare}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {/* Favorite Routes Tab */}
        {activeTab === 'routes' && (
          <div className="routes-content">
            <h2>Favorite Routes</h2>
            <div className="favorite-routes-list">
              {favoriteRoutes.length === 0 ? (
                <p>No favorite routes added yet.</p>
              ) : (
                favoriteRoutes.map((route) => (
                  <div className="favorite-route-card" key={route.id}>
                    <strong>{route.name}</strong>
                    <span>
                      {route.from} <ion-icon name="arrow-forward-outline"></ion-icon> {route.to}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default PassengerDashboard;