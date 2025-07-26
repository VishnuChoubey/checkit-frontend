import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import DashboardPage from './Pages/DashboardPage/DashboardPage.jsx';
import BusesPage from './Pages/BusesPage.jsx';
import StaffPage from './Pages/StaffPage.jsx';
import RoutesPage from './Pages/RoutesPage.jsx';
import SchedulerPage from './Pages/SchedulerPage.jsx';
import EmergencyPage from './Pages/EmergencyPage/EmergencyPage.jsx';
import Topbar from './Topbar/Topbar';
import Sidebar from './Sidebar/Sidebar';
import './NewApp.css';
import DriversPage from './Pages/DriversPage.jsx';
import DriverProfile from './Profile/DriverProfile.jsx';
import PassengerDashboard from '../Users/UserDashboard/PassengerDashboard.jsx';

function NewApp() {
  const [sidebarActive, setSidebarActive] = useState(false);

  const toggleSidebar = () => {
    setSidebarActive(!sidebarActive);
  }

  return (
    <div className="container">
      {/* <Sidebar active={sidebarActive} />
      <div className={`main ${sidebarActive ? 'active' : ''}`}> */}
        {/* <Topbar toggleSidebar={toggleSidebar} /> */}
        {/* <Routes> */}
          {/* <Route path="" element={<DashboardPage />} />
          <Route path="buses" element={<BusesPage />} />
          <Route path="staff" element={<StaffPage />} />
          <Route path="routes" element={<RoutesPage />} />
          <Route path="scheduler" element={<SchedulerPage />} />
          <Route path="emergency" element={<EmergencyPage />} />
          <Route path="drivers" element={<DriversPage />} />
          <Route path="driverprofile" element={<DriverProfile />} />
          <Route path="passengers" element={<PassengerDashboard />} /> */}
        {/* </Routes> */}
      {/* </div> */}
    </div>
  );
}

export default NewApp;
