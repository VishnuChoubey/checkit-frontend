import React from "react";
import Navbar from "../Main/Navbar.jsx";

const superSaverDeals = [
  {
    title: "50% Off on First Ride",
    desc: "Enjoy half price on your first bus ticket booking.",
    code: "FIRST50",
    validTill: "30 June 2025",
  },
  {
    title: "Monthly Saver Pass",
    desc: "Unlimited rides for a month at just ₹499.",
    code: "MONTHLY499",
    validTill: "31 July 2025",
  },
  {
    title: "Refer & Earn",
    desc: "Invite friends and earn ₹100 wallet credit for each signup.",
    code: "REFER100",
    validTill: "No Expiry",
  },
];

const SuperSaver = () => (
  <>
   
    <style>{`
      .super-saver-container {
        display: flex;
         
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
      .super-saver-title {
        font-size: 2rem;
        font-weight: 700;
        color: #166534;
        margin-bottom: 1.5rem;
      }
      .deals-list {
        display: flex;
        flex-wrap: wrap;
        gap: 2rem;
      }
      .deal-card {
        background: #f0fdf4;
        border-radius: 1rem;
        box-shadow: 0 2px 8px rgba(22,163,74,0.08);
        padding: 2rem 1.5rem;
        min-width: 260px;
        flex: 1 1 300px;
        display: flex;
        flex-direction: column;
        gap: 0.7rem;
        border-left: 6px solid #16a34a;
      }
      .deal-title {
        font-size: 1.2rem;
        font-weight: 700;
        color: #15803d;
      }
      .deal-desc {
        color: #374151;
        font-size: 1rem;
      }
      .deal-code {
        background: #bbf7d0;
        color: #166534;
        font-weight: 600;
        border-radius: 0.5rem;
        padding: 0.3rem 0.8rem;
        display: inline-block;
        margin-top: 0.5rem;
      }
      .deal-valid {
        color: #64748b;
        font-size: 0.95rem;
        margin-top: 0.2rem;
      }
      @media (max-width: 900px) {
        .super-saver-container {
          margin-left: 0;
          padding: 1.2rem 0.5rem;
        }
        .deals-list {
          flex-direction: column;
        }
      }
    `}</style>
    <div className="super-saver-container">
      <div className="super-saver-title">Super Saver Deals</div>
      <div className="deals-list">
        {superSaverDeals.map((deal, idx) => (
          <div className="deal-card" key={idx}>
            <div className="deal-title">{deal.title}</div>
            <div className="deal-desc">{deal.desc}</div>
            <div className="deal-code">Use Code: {deal.code}</div>
            <div className="deal-valid">Valid Till: {deal.validTill}</div>
          </div>
        ))}
      </div>
    </div>
  </>
);

export default SuperSaver;