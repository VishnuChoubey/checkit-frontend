import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
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

const Navbar = () => {
  const [navOpen, setNavOpen] = useState(false);
  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [profileError, setProfileError] = useState("");
  const navigate = useNavigate();

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
          setProfile(null);
        }
      } catch (err) {
        setProfile(null);
      }
      setLoadingProfile(false);
    };
    fetchProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    navigate("/LoginUser");
  };

  return (
    <>
      <style>{`
        .sidebar-navbar {
          background: #16a34a;
          color: #fff;
          border-radius: 1rem;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
          min-width: 220px;
          width: 220px;
          height: 100vh;
          position: fixed;
          top: 0;
          left: 0;
          display: flex;
          flex-direction: column;
          z-index: 50;
          transition: left 0.3s;
        }
        .sidebar-navbar .user-info {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 2rem 1rem 1.5rem 1rem;
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
        .sidebar-navbar .profile-error {
          color: #fff;
          font-weight: 600;
          font-size: 1rem;
          margin-top: 0.5rem;
        }
        .sidebar-navbar ul {
          list-style: none;
          margin: 0;
          padding: 0 0.5rem;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
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
          transition: background 0.2s, color 0.2s;
        }
        .sidebar-navbar .nav-link.active,
        .sidebar-navbar .nav-link:focus {
          background: #166534;
          color: #fff;
        }
        .sidebar-navbar .nav-link:hover {
          background: #15803d;
          color: #d1fae5;
        }
        .sidebar-navbar .logout-btn {
          width: 90%;
          margin: 0.5rem auto 0.0rem auto; 
          background: #dc2626;
          color: #fff;
          border: none;
          border-radius: 0.5rem;
          padding: 0.3rem 0;
          font-size: 1.05rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
          display: block;
        }
        .sidebar-navbar .logout-btn:hover {
          background: #b91c1c;
        }
        .sidebar-navbar .fill-space {
          flex: 1;
        }
        .mobile-nav-toggle {
          display: none;
        }
        @media (max-width: 768px) {
          .sidebar-navbar {
            position: fixed;
            left: ${navOpen ? "0" : "-100vw"};
            top: 0;
            width: 100vw;
            height: 100vh;
            flex-direction: column;
            border-radius: 0;
            min-width: 0;
            box-shadow: 0 2px 8px rgba(0,0,0,0.08);
            background: #16a34a;
            z-index: 100;
            transition: left 0.3s;
          }
          .sidebar-navbar .user-info {
            flex-direction: row;
            padding: 1rem 0.5rem;
            align-items: center;
            justify-content: flex-start;
          }
          .sidebar-navbar .user-photo {
            width: 40px;
            height: 40px;
            margin-bottom: 0;
            margin-right: 0.7rem;
          }
          .sidebar-navbar .user-name {
            max-width: 70px;
            text-align: left;
          }
          .sidebar-navbar ul {
            flex-direction: row;
            flex-wrap: nowrap;
            overflow-x: auto;
            padding: 0.5rem;
            gap: 0.5rem;
            margin: 0;
          }
          .sidebar-navbar li {
            margin-bottom: 0;
            margin-right: 0.5rem;
            flex: 0 0 auto;
          }
          .sidebar-navbar .logout-btn {
            width: auto;
            margin: 0 0rem 0 0rem;
            padding: 0rem 0rem;
          }
          .mobile-nav-toggle {
            display: block;
            position: fixed;
            top: 1rem;
            left: 1rem;
            background: none;
            border: none;
            color: #16a34a;
            font-size: 2rem;
            z-index: 200;
          }
        }
      `}</style>
      <button
        className="mobile-nav-toggle"
        onClick={() => setNavOpen((open) => !open)}
        aria-label="Toggle navigation"
      >
        {navOpen ? <FaTimes /> : <FaBars />}
      </button>
      <nav className="sidebar-navbar" style={{ left: window.innerWidth <= 768 && !navOpen ? "-100vw" : "0" }}>
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
          ) : !profile || !profile.profilePictureUrl || !profile.name ? (
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
          ) : (
            <>
              <img
                src={
                  profile.profilePictureUrl
                    ? `http://localhost:8080${profile.profilePictureUrl}`
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
          )}
        </div>
        <ul>
          {menuItems.map((item, idx) => (
            <li key={idx}>
              <NavLink
                to={item.link}
                className={({ isActive }) =>
                  `nav-link${isActive ? " active" : ""}`
                }
                onClick={() => setNavOpen(false)}
              >
                <ion-icon name={item.icon}></ion-icon>
                <span>{item.title}</span>
              </NavLink>
            </li>
          ))}
        </ul>
        <div className="fill-space"></div>
      </nav>
    </>
  );
};

export default Navbar;