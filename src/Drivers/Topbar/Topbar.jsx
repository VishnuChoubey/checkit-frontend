import React from 'react';
import './Topbar.css';

const Topbar = ({ toggleSidebar }) => {
  return (
    <div className="topbar">
      <div className="toggle" onClick={toggleSidebar}>
        <ion-icon name="menu-outline"></ion-icon>
      </div>
      <div className="search">
        <label>
          <input type="text" placeholder="Search here" />
          <ion-icon name="search-outline"></ion-icon>
        </label>
      </div>
      <div className="user">
        <img src="user.png" alt="User" />
      </div>
    </div>
  );
};

export default Topbar;