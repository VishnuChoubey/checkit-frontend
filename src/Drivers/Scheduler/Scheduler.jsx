import React, { useState } from 'react';
import './Scheduler.css';

const Scheduler = () => {
  // const [formData, setFormData] = useState({
  //   fromPlace: '',
  //   toPlace: '',
  //   date: '',
  //   time: ''
  // });

  // const [driverInfo, setDriverInfo] = useState(null);

  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormData(prev => ({ ...prev, [name]: value }));
  // };

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   // Mock data for demonstration
  //   setDriverInfo({
  //     name: "Rajesh Kumar",
  //     busNumber: "DL 1PB 5678",
  //     contact: "+91 98765 43210",
  //     eta: "15 minutes"
  //   });
  // };

  // return (
  //   <div className="scheduleBox">
  //     <div className="search-section">
  //       <form onSubmit={handleSubmit}>
  //         <input
  //           type="text"
  //           name="fromPlace"
  //           placeholder="From (Departure)"
  //           value={formData.fromPlace}
  //           onChange={handleChange}
  //           required
  //         />
  //         <input
  //           type="text"
  //           name="toPlace"
  //           placeholder="To (Destination)"
  //           value={formData.toPlace}
  //           onChange={handleChange}
  //           required
  //         />
  //         <input
  //           type="date"
  //           name="date"
  //           value={formData.date}
  //           onChange={handleChange}
  //           required
  //         />
  //         <input
  //           type="time"
  //           name="time"
  //           value={formData.time}
  //           onChange={handleChange}
  //           required
  //         />
  //         <button type="submit">Search</button>
  //       </form>
  //     </div>

  //     <div className="map-section">
  //       <p>Map Integration Area</p>
  //     </div>

  //     {driverInfo && (
  //       <div className="driver-info">
  //         <h3>Driver Information</h3>
  //         <div className="info-card">
  //           <p><strong>Name:</strong> {driverInfo.name}</p>
  //           <p><strong>Bus Number:</strong> {driverInfo.busNumber}</p>
  //           <p><strong>Contact:</strong> {driverInfo.contact}</p>
  //           <p><strong>ETA:</strong> {driverInfo.eta}</p>
  //         </div>
  //       </div>
  //     )}
  //   </div>
  // );
};

export default Scheduler;