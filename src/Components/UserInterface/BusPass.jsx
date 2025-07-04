import React from "react";
import { FaArrowLeft, FaTicketAlt, FaBus, FaStar, FaInfoCircle, FaWallet, FaGift } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Navbar from "../Main/Navbar";

const products = [
  {
    title: "Super Saver Plan",
    desc: "Cheapest way to travel Delhi buses. Save up to 40% on daily commutes.",
    available: true,
    icon: <FaStar className="text-yellow-500 text-xl mr-2" />,
  },
  {
    title: "One Day Ticket",
    desc: "Unlimited rides in a day across all DTC and Cluster buses.",
    available: true,
    icon: <FaTicketAlt className="text-blue-500 text-xl mr-2" />,
  },
  {
    title: "Monthly Bus Pass",
    desc: "Best for regular commuters. Valid for all routes in Delhi.",
    available: true,
    icon: <FaBus className="text-green-600 text-xl mr-2" />,
  },
  {
    title: "Welcome Offer ₹59",
    desc: "Special for first-time users. Get 10 trips at less than ₹6/trip.",
    available: false,
    icon: <FaGift className="text-pink-500 text-xl mr-2" />,
    note: "Currently not available for purchase",
  },
  {
    title: "Student Pass",
    desc: "Discounted monthly pass for students. ID required.",
    available: false,
    icon: <FaStar className="text-yellow-400 text-xl mr-2" />,
    note: "Coming soon for Delhi schools & colleges",
  },
];

const BusPass = () => {
  const navigate = useNavigate();
  const goBack = () => {
    navigate(-1);
  };

  return (
    <>
      <style>{`
        .buspass-main-bg {
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
        .buspass-navbar-space {
          width: 240px;
          flex-shrink: 0;
        }
        .buspass-content {
          flex: 1;
          padding: 2.5rem 2rem 2rem 2rem;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .buspass-header {
          display: flex;
          align-items: center;
          background: #fff;
          box-shadow: 0 2px 8px rgba(0,0,0,0.06);
          padding: 1.2rem 1.5rem 1.2rem 0.5rem;
          border-radius: 1.2rem;
          margin-bottom: 2rem;
          width: 100%;
          max-width: 700px;
        }
        .buspass-header h1 {
          font-size: 1.5rem;
          font-weight: 700;
          color: #166534;
          margin-left: 0.7rem;
        }
        .buspass-info-section {
          background: #f0fdf4;
          border-radius: 1.1rem;
          box-shadow: 0 2px 12px rgba(22,163,74,0.08);
          padding: 1.2rem 1.5rem;
          margin-bottom: 2rem;
          width: 100%;
          max-width: 700px;
          display: flex;
          align-items: flex-start;
          gap: 2rem;
        }
        .buspass-info-section .info-icon {
          font-size: 2.2rem;
          color: #16a34a;
          margin-right: 1rem;
        }
        .buspass-info-section .info-content {
          flex: 1;
        }
        .buspass-info-section h2 {
          font-size: 1.15rem;
          font-weight: 700;
          color: #166534;
          margin-bottom: 0.3rem;
        }
        .buspass-info-section ul {
          margin: 0.5rem 0 0 1.2rem;
          color: #374151;
          font-size: 1rem;
        }
        .buspass-list {
          width: 100%;
          max-width: 700px;
        }
        .buspass-card {
          background: #fff;
          border-radius: 1.1rem;
          box-shadow: 0 2px 12px rgba(22,163,74,0.08);
          padding: 1.3rem 1.2rem;
          margin-bottom: 1.1rem;
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          cursor: pointer;
          transition: box-shadow 0.18s, background 0.18s;
        }
        .buspass-card:hover {
          box-shadow: 0 6px 24px rgba(22,163,74,0.13);
          background: #f0fdf4;
        }
        .buspass-card.unavailable {
          cursor: not-allowed;
          opacity: 0.6;
          background: #f3f4f6;
        }
        .buspass-card .buspass-info h2 {
          font-size: 1.1rem;
          font-weight: 700;
          color: #166534;
          margin-bottom: 0.2rem;
        }
        .buspass-card .buspass-info h2.unavailable {
          color: #a1a1aa;
        }
        .buspass-card .buspass-info p {
          color: #374151;
          font-size: 0.98rem;
        }
        .buspass-card .buspass-info p.unavailable {
          color: #bdbdbd;
        }
        .buspass-note {
          background: #fef3c7;
          color: #b45309;
          border-radius: 0.7rem;
          padding: 0.6rem 1rem;
          display: flex;
          align-items: center;
          gap: 0.7rem;
          margin-top: 0.7rem;
          font-size: 0.97rem;
        }
        .buspass-note .note-icon {
          background: #fde68a;
          border-radius: 50%;
          padding: 0.3rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        @media (max-width: 900px) {
          .buspass-main-bg {
            flex-direction: column;
          }
          .buspass-navbar-space {
            width: 100vw;
          }
          .buspass-content {
            padding: 1.2rem 0.5rem;
          }
        }
        @media (max-width: 600px) {
          .buspass-header {
            padding: 1rem 0.5rem;
          }
          .buspass-list {
            padding: 0 0.2rem;
          }
          .buspass-card {
            padding: 1rem 0.7rem;
          }
          .buspass-info-section {
            flex-direction: column;
            gap: 1rem;
            padding: 1rem 0.7rem;
          }
        }
      `}</style>
      <div className="buspass-main-bg">
       
        <div className="buspass-content">
          <div className="buspass-header">
            <FaArrowLeft className="text-xl cursor-pointer" onClick={goBack} />
            <h1>Bus Pass & Ticket Products</h1>
          </div>
          <div className="buspass-info-section">
            <FaWallet className="info-icon" />
            <div className="info-content">
              <h2>Why buy a Bus Pass?</h2>
              <ul>
                <li>Save money on daily commutes in Delhi.</li>
                <li>Unlimited rides with select passes.</li>
                <li>Easy to purchase and renew online.</li>
                <li>Special discounts for students and first-time users.</li>
                <li>Accepted on all DTC and Cluster buses.</li>
              </ul>
            </div>
          </div>
          <div className="buspass-list">
            {products.map((prod, idx) => (
              <div
                key={idx}
                className={`buspass-card${!prod.available ? " unavailable" : ""}`}
                tabIndex={prod.available ? 0 : -1}
                aria-disabled={!prod.available}
                onClick={() => prod.available && alert(`Selected: ${prod.title}`)}
              >
                {prod.icon}
                <div className="buspass-info">
                  <h2 className={prod.available ? "" : "unavailable"}>{prod.title}</h2>
                  <p className={prod.available ? "" : "unavailable"}>{prod.desc}</p>
                  {prod.note && (
                    <div className="buspass-note">
                      <span className="note-icon">
                        <FaInfoCircle className="text-yellow-500 text-base" />
                      </span>
                      <span>{prod.note}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default BusPass;