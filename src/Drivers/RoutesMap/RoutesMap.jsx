import React, { useState } from 'react';
import HereMap from './HereMap';
import './RoutesMap.css';

const RoutesMap = () => {
  // const [formData, setFormData] = useState({
  //   start_stop: '',
  //   end_stop: ''
  // });
  // const [route, setRoute] = useState(null);
  // const [busStops, setBusStops] = useState([]);
  // const [error, setError] = useState(null);

  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormData(prev => ({ ...prev, [name]: value }));
  // };

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   // Mock data for demonstration
  //   setRoute({
  //     duration: 1800,
  //     distance: 8.5,
  //     polyline: "BFJxyz..." // Simplified for example
  //   });
  //   setBusStops([
  //     { lat: 28.613939, lng: 77.209023, name: 'Rajiv Chowk' },
  //     { lat: 28.625484, lng: 77.209290, name: 'Connaught Place' },
  //     { lat: 28.628054, lng: 77.220004, name: 'Barakhamba Road' }
  //   ]);
  // };

  // return (
  //   <div className="routes-container">
  //     <div className="search-section">
  //       <form onSubmit={handleSubmit}>
  //         <label htmlFor="start_stop">Start Bus Stop:</label>
  //         <input
  //           type="text"
  //           id="start_stop"
  //           name="start_stop"
  //           value={formData.start_stop}
  //           onChange={handleChange}
  //           required
  //         />
          
  //         <label htmlFor="end_stop">End Bus Stop:</label>
  //         <input
  //           type="text"
  //           id="end_stop"
  //           name="end_stop"
  //           value={formData.end_stop}
  //           onChange={handleChange}
  //           required
  //         />
          
  //         <button type="submit">Get Route</button>
  //       </form>

  //       {error && <div className="error-message">{error}</div>}
        
  //       {route && (
  //         <div className="success-message">
  //           Route found: Duration {Math.floor(route.duration / 60)} minutes, 
  //           Distance {route.distance} km.
  //         </div>
  //       )}
  //     </div>
      
  //     <HereMap 
  //       route={route} 
  //       busStops={busStops} 
  //       apiKey="YOUR_HERE_API_KEY" 
  //     />
  //   </div>
  // );
};

export default RoutesMap;