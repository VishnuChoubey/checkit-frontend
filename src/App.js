import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, Outlet, useLocation } from "react-router-dom";

import Footer from "./Components/Main/Footer";
import Home from "./Components/Main/Home";
import Navbar from "./Components/Main/Navbar";

import ViewDetails from "./Components/UserInterface/ViewDetails";
import BusPass from "./Components/UserInterface/BusPass";
import OneWayTicket from './Components/UserInterface/OneWayTicket';

import Login from "./Drivers/login/Login";  
import LoginUser from "./Users/LoginUser/LoginUser";
import Registration from "./Drivers/registration/Registration";
import RegistrationUser from "./Users/registrationUser/RegistrationUser";
import BusTracker from "./Components/UserInterface/BusTracker";
import CheckItCard from "./Components/Main/CheckItCard.jsx";
import Sidebar from "./Components/UserInterface/Sidebar";
import WebsocketCheck from "./Components/UserInterface/WebsocketCheck";
import HomeLayout from "./Components/Main/HomeLayout";
import SuperSaver from "./Components/Pages/SuperSaver.jsx";
import CheckInCities from "./Components/Pages/CheckInCities.jsx";

import NewApp from "./Drivers/NewApp";
import DashboardPage from './Drivers/Pages/DashboardPage/DashboardPage.jsx';
import BusesPage from './Drivers/Pages/BusesPage.jsx';
import StaffPage from './Drivers/Pages/StaffPage.jsx';
import RoutesPage from './Drivers/Pages/RoutesPage.jsx';
import SchedulerPage from './Drivers/Pages/SchedulerPage.jsx';
import EmergencyPage from './Drivers/Pages/EmergencyPage/EmergencyPage.jsx';
import DriversPage from "./Drivers/Pages/DriversPage.jsx";
import DriverProfile from "./Drivers/Profile/DriverProfile.jsx";
import PassengerDashboard from "./Users/UserDashboard/PassengerDashboard.jsx";
import Booking from "./Components/Pages/Booking.jsx";
import RouteInfo from "./Components/Pages/RouteInfo.jsx";
const isAuthenticated = () => !!localStorage.getItem("token");

const PrivateRoute = ({ element }) => {
  return isAuthenticated() ? element : <Navigate to="/login" replace />;
};

const LogoutOnExit = () => {
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const allowedPaths = ["/driverdashboard", "/login", "/newapp"];
    const isAllowed = allowedPaths.some(path => location.pathname.startsWith(path));

    if (token && !isAllowed) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
  }, [location.pathname]);

  return null;
};

function App() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <BrowserRouter>
      <LogoutOnExit />
      <Routes>
        <Route path="/" element={<HomeLayout />}>
          <Route index element={<Home />} />
      
        <Route path="/app-features" element={<ViewDetails />} />
        <Route path="/app-features/select-trip" element={<OneWayTicket />} />
        <Route path="/app-features/select-product-type" element={<BusPass />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/LoginUser" element={<LoginUser />} />
        <Route path="/Registration" element={<Registration />} />
        <Route path="/RegistrationUser" element={<RegistrationUser />} />
        <Route path="/BusTracker" element={<BusTracker />} />
        <Route path="/WebsocketCheck" element={<WebsocketCheck />} />
        <Route path="/Sidebar" element={<Sidebar />} />
        <Route path="/passengers" element={<PassengerDashboard />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/buspass" element={<BusPass />} />
        <Route path="/supersaver" element={<SuperSaver />} />
        <Route path="/allcities" element={<CheckInCities />} />
           <Route path="driverprofile" element={<DriverProfile />} />
        <Route path="/checkitcard" element={<CheckItCard />} />

        <Route path="/routeinfo" element={<RouteInfo />} />
          </Route>
        {/* NewApp with nested pages */}
        <Route path="/newapp" element={<NewApp />}>
          <Route path="" element={<DashboardPage />} />
          <Route path="buses" element={<BusesPage />} />
          <Route path="staff" element={<StaffPage />} />
          <Route path="routes" element={<RoutesPage />} />
          <Route path="scheduler" element={<SchedulerPage />} />
          <Route path="emergency" element={<EmergencyPage />} />
          <Route path="drivers" element={<DriversPage />} />
           <Route path="driverprofile" element={<DriverProfile />} />
          
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
