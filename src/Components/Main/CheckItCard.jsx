import React from "react";
import Navbar from "./Navbar";

const CheckItCard = ({
  name = "Vishnu Kumar",
  cardNumber = "1234 5678 9012 3456",
  validThru = "12/30",
  avatarUrl,
}) => (
  <>
    <style>{`
      .checkit-bg {
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
      .checkit-navbar-space {
        width: 240px;
        flex-shrink: 0;
      }
      .checkit-card-outer {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        z-index: 1;
      }
      .checkit-card {
        width: 370px;
        height: 220px;
        border-radius: 1.5rem;
        background: linear-gradient(135deg, #16a34a 60%, #bbf7d0 100%);
        box-shadow: 0 8px 32px rgba(22,163,74,0.18), 0 2px 8px rgba(0,0,0,0.08);
        color: #fff;
        padding: 2rem 2rem 1.5rem 2rem;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        position: relative;
        overflow: hidden;
        margin-bottom: 10rem;
        margin-top: 5rem;
      }
      .checkit-card::before {
        content: "";
        position: absolute;
        top: -40px;
        right: -60px;
        width: 180px;
        height: 180px;
        background: radial-gradient(circle, #bbf7d0 60%, transparent 100%);
        opacity: 0.5;
        z-index: 0;
      }
      .checkit-chip {
        width: 48px;
        height: 32px;
        border-radius: 8px;
        background: linear-gradient(135deg, #e5e7eb 60%, #a7f3d0 100%);
        margin-bottom: 1.2rem;
        box-shadow: 0 2px 8px rgba(22,163,74,0.10);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1;
      }
      .checkit-logo {
        position: absolute;
        top: 1.2rem;
        right: 1.5rem;
        font-size: 1.5rem;
        font-weight: 900;
        letter-spacing: 0.1em;
        color: #166534;
        background: #bbf7d0;
        padding: 0.3rem 1.1rem;
        border-radius: 1rem;
        box-shadow: 0 2px 8px rgba(22,163,74,0.08);
        z-index: 1;
      }
      .checkit-card-number {
        font-size: 1.3rem;
        letter-spacing: 0.15em;
        font-family: "Roboto Mono", monospace;
        margin-bottom: 1.2rem;
        color: #fff;
        text-shadow: 0 1px 4px #15803d44;
        z-index: 1;
      }
      .checkit-card-details {
        display: flex;
        align-items: flex-end;
        justify-content: space-between;
        z-index: 1;
      }
      .checkit-user {
        display: flex;
        align-items: center;
        gap: 0.8rem;
      }
      .checkit-avatar {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        object-fit: cover;
        border: 2.5px solid #bbf7d0;
        background: #e5e7eb;
        box-shadow: 0 2px 8px rgba(22,163,74,0.10);
      }
      .checkit-user-info {
        display: flex;
        flex-direction: column;
      }
      .checkit-user-name {
        font-size: 1.08rem;
        font-weight: 700;
        color: #fff;
        letter-spacing: 0.02em;
        text-shadow: 0 1px 4px #15803d44;
      }
      .checkit-valid {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
      }
      .checkit-valid-label {
        font-size: 0.8rem;
        color: #d1fae5;
        letter-spacing: 0.08em;
      }
      .checkit-valid-date {
        font-size: 1.08rem;
        font-weight: 600;
        color: #fff;
        letter-spacing: 0.08em;
        margin-top: 0.1rem;
        text-shadow: 0 1px 4px #15803d44;
      }
      .checkit-wave {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 60px;
        background: url('data:image/svg+xml;utf8,<svg width="100%" height="60" xmlns="http://www.w3.org/2000/svg"><path d="M0 30 Q90 60 180 30 T360 30 V60 H0 Z" fill="%23bbf7d0" /></svg>');
        background-repeat: no-repeat;
        background-size: cover;
        opacity: 0.7;
        z-index: 0;
      }
      @media (max-width: 900px) {
        .checkit-bg {
          flex-direction: column;
        }
        .checkit-navbar-space {
          width: 100vw;
        }
        .checkit-card-outer {
          margin-left: 0;
          padding: 1.2rem 0.5rem;
        }
      }
      @media (max-width: 500px) {
        .checkit-card {
          width: 98vw;
          min-width: 0;
          padding: 1.2rem 0.7rem 1rem 0.7rem;
        }
      }
    `}</style>
    <div className="checkit-bg">
      
      <div className="checkit-card-outer">
        <div className="checkit-card">
          <div className="checkit-chip">
            <svg width="32" height="20" viewBox="0 0 32 20">
              <rect x="0" y="0" width="32" height="20" rx="5" fill="#a7f3d0" />
              <rect x="6" y="5" width="20" height="10" rx="2" fill="#e5e7eb" />
            </svg>
          </div>
          <div className="checkit-logo">Check It</div>
          <div className="checkit-card-number">{cardNumber}</div>
          <div className="checkit-card-details">
            <div className="checkit-user">
              <img
                className="checkit-avatar"
                src={
                  avatarUrl ||
                  "https://ui-avatars.com/api/?name=" +
                    encodeURIComponent(name)
                }
                alt={name}
              />
              <div className="checkit-user-info">
                <span className="checkit-user-name">{name}</span>
                <span style={{ fontSize: "0.85rem", color: "#d1fae5" }}>
                  Card Holder
                </span>
              </div>
            </div>
            <div className="checkit-valid">
              <span className="checkit-valid-label">VALID THRU</span>
              <span className="checkit-valid-date">{validThru}</span>
            </div>
          </div>
          <div className="checkit-wave"></div>
        </div>
      </div>
    </div>
  </>
);

export default CheckItCard;