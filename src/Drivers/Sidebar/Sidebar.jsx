import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';

// Example user data (replace with real user data as needed)
const user = {
  name: "Vishnu Sharma",
  photo: "https://randomuser.me/api/portraits/men/32.jpg",
};

const menuItems = [
  { icon: 'grid-outline', title: 'Dashboard', link: '' },
  { icon: 'bus-outline', title: 'Available Buses', link: 'buses' },
  { icon: 'person-circle-outline', title: 'Driver Details', link: 'drivers' },
  { icon: 'people-outline', title: 'Staff Details', link: 'staff' },
  { icon: 'navigate-circle-outline', title: 'Routes Details', link: 'routes' },
  { icon: 'calendar-outline', title: 'Scheduler', link: 'scheduler' },
  { icon: 'notifications-circle-outline', title: 'Emergency', link: 'emergency' },
  { icon: 'log-out-outline', title: 'Log out', link: '#' }
];

const Sidebar = ({ active }) => {
  const location = useLocation();

  return (
    <>
      <style>{`
        .custom-sidebar {
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
        }
        .custom-sidebar .user-info {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 2rem 1rem 1.5rem 1rem;
        }
        .custom-sidebar .user-photo {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          object-fit: cover;
          border: 2.5px solid #bbf7d0;
          box-shadow: 0 2px 8px rgba(22,163,74,0.10);
        }
        .custom-sidebar .user-name {
          font-size: 1.15rem;
          font-weight: 700;
          color: #fff;
          letter-spacing: 0.02em;
          white-space: nowrap;
        }
        .custom-sidebar ul {
          list-style: none;
          margin: 0;
          padding: 0 0.5rem;
          flex: 1;
        }
        .custom-sidebar li {
          margin-bottom: 0.5rem;
        }
        .custom-sidebar .nav-link {
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
        .custom-sidebar .nav-link.active,
        .custom-sidebar .nav-link:focus {
          background: #166534;
          color: #fff;
        }
        .custom-sidebar .nav-link:hover {
          background: #15803d;
          color: #d1fae5;
        }
        @media (max-width: 768px) {
          .custom-sidebar {
            position: static;
            width: 100%;
            height: auto;
            flex-direction: row;
            border-radius: 0;
            min-width: 0;
          }
          .custom-sidebar .user-info {
            padding: 1rem 0.5rem;
          }
          .custom-sidebar ul {
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            padding: 0.5rem;
          }
          .custom-sidebar li {
            margin-bottom: 0;
            margin-right: 0.5rem;
          }
        }
      `}</style>
      <nav className="custom-sidebar">
        <div className="user-info">
          <img src={user.photo} alt={user.name} className="user-photo" />
          <span className="user-name">{user.name}</span>
        </div>
        <ul>
          {menuItems.map((item, index) => (
            <li key={index}>
              <Link
                to={item.link}
                className={
                  "nav-link" +
                  (location.pathname.endsWith(item.link) && item.link !== "#" ? " active" : "")
                }
              >
                <span className="icon">
                  <ion-icon name={item.icon}></ion-icon>
                </span>
                <span className="title">{item.title}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
};

export default Sidebar;