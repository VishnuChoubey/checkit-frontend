import React from "react";
import Navbar from "../Main/Navbar.jsx";

const CheckInCities = () => (
  <>
   
    <style>{`
      .cities-container {
       display: grid;
         
          gap: 3rem;
         
          background: #fff;
          border-radius: 2rem;
          box-shadow: 0 8px 32px rgba(22,163,74,0.13), 0 2px 8px rgba(22,163,74,0.08);
          padding: 2rem 2rem 2rem 2rem;
          margin-top: 0;
          margin-bottom: 0.5rem;
          margin-left: 0.4rem;
          margin-right: 0.4rem;
          background: linear-gradient(90deg, #f0fdf4 60%, #bbf7d0 100%);
      }
      .cities-title {
        font-size: 2rem;
        font-weight: 700;
        color: #166534;
        margin-bottom: 1.5rem;
      }
      .city-card {
        background: #f0fdf4;
        border-radius: 1rem;
        box-shadow: 0 2px 8px rgba(22,163,74,0.08);
        padding: 2rem 1.5rem;
        min-width: 260px;
        max-width: 350px;
        margin: 0 auto;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        border-left: 6px solid #16a34a;
      }
      .city-name {
        font-size: 1.3rem;
        font-weight: 700;
        color: #15803d;
        margin-bottom: 0.5rem;
      }
      .city-state {
        color: #64748b;
        font-size: 1.05rem;
        margin-bottom: 1rem;
      }
      .city-info {
        color: #374151;
        font-size: 1rem;
        margin-bottom: 0.5rem;
      }
      @media (max-width: 900px) {
        .cities-container {
          margin-left: 0;
          padding: 1.2rem 0.5rem;
        }
        .city-card {
          min-width: 0;
          width: 100%;
        }
      }
    `}</style>
    <div className="cities-container">
      <div className="cities-title">Check In Cities</div>
      <div className="city-card">
        <div className="city-name">Delhi</div>
        <div className="city-state">Delhi NCR</div>
        <div className="city-info">
          <strong>Available Services:</strong>
          <ul style={{ margin: "0.5rem 0 0 1.2rem" }}>
            <li>Bus Passes</li>
            <li>Book Tickets</li>
            <li>Super Saver Offers</li>
            <li>Check It Card</li>
          </ul>
        </div>
        <div className="city-info">
          <strong>More cities coming soon!</strong>
        </div>
      </div>
    </div>
  </>
);

export default CheckInCities;