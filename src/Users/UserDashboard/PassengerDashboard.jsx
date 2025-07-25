import React, { useState, useEffect } from 'react';
import Navbar from '../../Components/Main/Navbar';

const PassengerDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [ticketHistory, setTicketHistory] = useState([]);
  const [favoriteRoutes, setFavoriteRoutes] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [profileError, setProfileError] = useState("");
  const [loadingTickets, setLoadingTickets] = useState(false);

  // Fetch user profile
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

  // Fetch ticket history after profile is loaded
  useEffect(() => {
    const fetchTickets = async () => {
      if (!profile?.id) return;
      setLoadingTickets(true);
      try {
        const token = localStorage.getItem("accessToken");
        const response = await fetch(
          `http://localhost:8080/api/user/bookings/${profile.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          setTicketHistory(data || []);
          // Calculate favorite routes
          const routeMap = {};
          data.forEach((t) => {
            const key = `${t.routeNo}|${t.source}|${t.destination}`;
            routeMap[key] = (routeMap[key] || 0) + 1;
          });
          const favs = Object.entries(routeMap)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(([key, count]) => {
              const [routeNo, source, destination] = key.split("|");
              return { routeNo, source, destination, count };
            });
          setFavoriteRoutes(favs);
        }
      } catch (err) {
        // Optionally handle error
      }
      setLoadingTickets(false);
    };
    fetchTickets();
  }, [profile]);

  // Helper to format date
  const formatDate = (iso) => {
    if (!iso) return "--";
    const d = new Date(iso);
    return d.toLocaleDateString() + " " + d.toLocaleTimeString();
  };

  return (
    <>
     
     <style>{`
        .passenger-container {
        background:linear-gradient(90deg, #d1fae5 60%, #86efac 100%);
          max-width: 1030px;
          margin: 0 auto;
          margin-top: 0.2rem;
          border-radius: 2.5rem;
          box-shadow: 0 2px 12px rgba(22,163,74,0.08);
          padding: 2.5rem 2rem 2rem 2rem;
          min-height: 80vh;
          padding-left: 2rem;
          padding-right: 0px;
          display: flex;
          flex-direction: column;
        }
        .passenger-header {
        background: #f0fdf4;
          display: flex;
          // align-items: center;
          justify-content: space-between;
          gap: 2rem;
          border-bottom: 1px solid #e5e7eb;
          padding:0.2rem 0.2rem 0.2rem 0.2rem;
          margin-bottom: 1.5rem;
          margin-left:1rem;
          max-width: 930px;
          border-radius: 1.2rem;

        }
        .profile-section {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }
        .profile-picture {
          width: 80px;
          height: 80px;
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
  margin-left: 0.9rem;
  margin-right: 3.5rem;
  padding: 1.5rem;
  background-color: #f9f9f9;
  border-radius: 1.2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  max-width: 940px;
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
      ? profile.profilePictureUrl
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
              <h3>₹{profile?.walletBalance ?? 0}</h3>
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
                <p>You have booked <b>{ticketHistory.length}</b> tickets.</p>
              </div>
              <div className="dashboard-card">
                <i className="fa fa-wallet" />
                <h4>Wallet</h4>
                <p>Balance: <b>₹{profile?.walletBalance ?? 0}</b></p>
              </div>
              <div className="dashboard-card">
                <i className="fa fa-map-marker" />
                <h4>Favorite Routes</h4>
                <p>
                  {favoriteRoutes.length === 0
                    ? "No favorite routes yet."
                    : favoriteRoutes
                        .map(
                          (r) =>
                            `${r.source} → ${r.destination} (${r.routeNo})`
                        )
                        .join(", ")}
                </p>
              </div>
            </div>
          </div>
        )}
        {/* Tickets Tab */}
        {activeTab === 'tickets' && (
          <div className="tickets-content">
            <h2>My Tickets</h2>
            {loadingTickets ? (
              <div>Loading tickets...</div>
            ) : ticketHistory.length === 0 ? (
              <div>No tickets found.</div>
            ) : (
              <table className="ticket-table">
                <thead>
                  <tr>
                    <th>Booking ID</th>
                    <th>Route</th>
                    <th>From</th>
                    <th>To</th>
                    <th>Passengers</th>
                    <th>Status</th>
                    <th>Fare</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {ticketHistory.map((ticket) => (
                    <tr key={ticket.id}>
                      <td>{ticket.bookingId}</td>
                      <td>{ticket.routeNo}</td>
                      <td>{ticket.source}</td>
                      <td>{ticket.destination}</td>
                      <td>{ticket.passengers}</td>
                      <td className={`status-${ticket.status}`}>{ticket.status}</td>
                      <td>₹{ticket.fare ?? "--"}</td>
                      <td>{formatDate(ticket.bookingDate)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
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
                favoriteRoutes.map((route, idx) => (
                  <div className="favorite-route-card" key={idx}>
                    <strong>
                      {route.source} <ion-icon name="arrow-forward-outline"></ion-icon> {route.destination}
                    </strong>
                    <span>Route No: {route.routeNo}</span>
                    <span>Booked {route.count} times</span>
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