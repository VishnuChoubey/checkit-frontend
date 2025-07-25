import React, { useState, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";

const menuItems = [
  { icon: "grid-outline", title: "Dashboard", link: "/" },
  { icon: "card-outline", title: "Check It Card", link: "/checkitcard" },
  { icon: "ticket-outline", title: "Book Ticket", link: "/booking" },
  { icon: "wallet-outline", title: "Bus Pass", link: "/buspass" },
  { icon: "star-outline", title: "Super Saver", link: "/supersaver" },
  { icon: "location-outline", title: "Check In Cities", link: "/allcities" },
  { icon: "flask-outline", title: "Try Check In", link: "/app-features" },
];

const Navbar = ({ navOpen, setNavOpen, windowWidth }) => {
  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [role, setRole] = useState("user");
  const navigate = useNavigate();
  const location = useLocation();

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    if (windowWidth <= 1024 && navOpen) {
      const handleClickOutside = (e) => {
        if (!e.target.closest('.sidebar-navbar') && !e.target.closest('.mobile-nav-toggle')) {
          setNavOpen(false);
        }
      };
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [navOpen, windowWidth, setNavOpen]);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoadingProfile(true);

      const token = localStorage.getItem("accessToken");
      if (!token) {
        setProfile(null);
        setLoadingProfile(false);
        return;
      }
      try {
        // Try user profile first
        let response = await fetch("http://localhost:8080/api/user/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          const data = await response.json();
          setProfile(data);
          setRole("user");
        } else {
          // If not user, try driver profile
          response = await fetch("http://localhost:8080/api/driver/profile", {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (response.ok) {
            const data = await response.json();
            setProfile(data);
            setRole("driver");
          } else {
            setProfile(null);
          }
        }
      } catch (err) {
        setProfile(null);
      }
      setLoadingProfile(false);
    };
    fetchProfile();
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setProfile(null);
    setLoadingProfile(false);
    navigate("/LoginUser");
  };

  return (
    <>
      <style>{`
        .sidebar-navbar {
          background: #16a34a;
          color: #fff;
          width: ${windowWidth > 1024 ? '220px' : windowWidth > 768 ? '280px' : '75vw'};
          max-width: 100%;
          height: 100vh;
          position: fixed;
          top: 0;
          left: ${navOpen ? '0' : '-100%'};
          z-index: 1000;
          transition: left 0.3s ease;
          overflow-y: auto;
          box-shadow: ${navOpen && windowWidth <= 1024 ? '2px 0 10px rgba(0,0,0,0.2)' : 'none'};
          border-radius: 1rem;
        }
        .sidebar-navbar .user-info {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 2rem 1rem 1.5rem;
        }
        .sidebar-navbar .user-photo {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          object-fit: cover;
          border: 2.5px solid #bbf7d0;
          box-shadow: 0 2px 8px rgba(22,163,74,0.10);
          margin-bottom: 0.7rem;
          background: #e5e7eb;
        }
        .sidebar-navbar .user-name {
          font-size: 1.08rem;
          font-weight: 700;
          color: #fff;
          letter-spacing: 0.02em;
          white-space: nowrap;
          max-width: 140px;
          overflow: hidden;
          text-overflow: ellipsis;
          display: block;
          text-align: center;
        }
        .sidebar-navbar ul {
          list-style: none;
          margin: 0;
          padding: 0 0.5rem;
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        .sidebar-navbar li {
          margin-bottom: 0.5rem;
        }
        .sidebar-navbar .nav-link {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.75rem 1rem;
          border-radius: 0.75rem;
          color: #fff;
          text-decoration: none;
          font-size: 1rem;
          transition: background 0.2s;
        }
        .sidebar-navbar .nav-link.active,
        .sidebar-navbar .nav-link:focus {
          background: #166534;
        }
        .sidebar-navbar .nav-link:hover {
          background: #15803d;
        }
        .sidebar-navbar .logout-btn {
          width: 90%;
          margin: 1rem auto;
          background: #dc2626;
          color: #fff;
          border: none;
          border-radius: 0.5rem;
          padding: 0.5rem;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        }
        .sidebar-navbar .logout-btn:hover {
          background: #b91c1c;
        }
        .mobile-nav-toggle {
          display: ${windowWidth <= 1024 ? 'flex' : 'none'};
          position: fixed;
          top: 1rem;
          left: 1rem;
          background: #fff;
          border: none;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 5px rgba(0,0,0,0.2);
          z-index: 1100;
          cursor: pointer;
          color: #16a34a;
        }
        .close-sidebar {
          display: ${windowWidth <= 1024 && navOpen ? 'block' : 'none'};
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: transparent;
          border: none;
          color: white;
          font-size: 1.5rem;
          cursor: pointer;
          z-index: 1001;
        }
        @media (max-width: 768px) {
          .sidebar-navbar {
            width: 60vw;
          }
        }
        .sidebar-navbar .user-info {
          padding: 1.5rem 1rem;
        }
        .sidebar-navbar .user-photo {
          width: 50px;
          height: 50px;
        }
      `}</style>
      {windowWidth <= 1024 && !navOpen && (
        <button
          className="mobile-nav-toggle"
          onClick={() => setNavOpen(true)}
          aria-label="Toggle navigation"
        >
          <FaBars />
        </button>
      )}
      <nav className="sidebar-navbar">
        <button 
          className="close-sidebar" 
          onClick={() => setNavOpen(false)}
          aria-label="Close menu"
        >
          <FaTimes />
        </button>
        <div className="user-info">
          {loadingProfile ? (
            <>
              <img
                src="https://ui-avatars.com/api/?name=User"
                alt="User"
                className="user-photo"
              />
              <span style={{ color: "#fff", fontWeight: 600 }}>Loading...</span>
            </>
          ) : !profile ? (
            <>
              <img
                src="https://ui-avatars.com/api/?name=User"
                alt="User"
                className="user-photo"
              />
              <span className="user-name">User</span>
              {localStorage.getItem("accessToken") && (
                <button className="logout-btn" onClick={handleLogout}>Logout</button>
              )}
            </>
          ) : role === "user" ? (
            <>
              <img
                src={
                  profile.profilePictureUrl
                    ? profile.profilePictureUrl
                    : "https://ui-avatars.com/api/?name=User"
                }
                alt={profile.name || "User"}
                className="user-photo"
                style={{ cursor: "pointer" }}
                onClick={() => navigate("/passengers")}
                onError={e => { e.target.onerror = null; e.target.src = "https://ui-avatars.com/api/?name=User"; }}
              />
              <span className="user-name" title={profile.name}>{profile.name || "User"}</span>
              {localStorage.getItem("accessToken") && (
                <button className="logout-btn" onClick={handleLogout}>Logout</button>
              )}
            </>
          ) : (
            <>
              <img
                src={
                  profile.photo
                    ? profile.photo
                    : "https://ui-avatars.com/api/?name=Driver"
                }
                alt={profile.name || "Driver"}
                className="user-photo"
                style={{ cursor: "pointer" }}
                onClick={() => navigate("/driverprofile")}
                onError={e => { e.target.onerror = null; e.target.src = "https://ui-avatars.com/api/?name=Driver"; }}
              />
              <span className="user-name" title={profile.name}>{profile.name || "Driver"}</span>
              <span style={{ color: "#bbf7d0", fontSize: "0.95rem" }}>
                {profile.role || "Driver"}
              </span>
              {localStorage.getItem("accessToken") && (
                <button className="logout-btn" onClick={handleLogout}>Logout</button>
              )}
            </>
          )}
        </div>
        <ul>
          {menuItems.map((item, idx) => (
            <li key={idx}>
              <NavLink
                to={item.link}
                className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
                onClick={() => windowWidth <= 1024 && setNavOpen(false)}
              >
                <ion-icon name={item.icon}></ion-icon>
                <span>{item.title}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
};

export default Navbar;