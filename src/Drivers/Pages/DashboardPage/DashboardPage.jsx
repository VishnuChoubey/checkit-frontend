import React from 'react';
// import './DashboardPage.css';

const SIDEBAR_WIDTH = 120; // Match your sidebar width

const stats = [
  { title: 'Total Buses', value: 42, icon: 'bus-outline', trend: 'up' },
  { title: 'Active Drivers', value: 35, icon: 'person-outline', trend: 'up' },
  { title: 'Routes', value: 18, icon: 'navigate-outline', trend: 'steady' },
  { title: 'Emergencies', value: 2, icon: 'warning-outline', trend: 'down' },
];

const recentAlerts = [
  {
    time: "10:30 AM",
    bus: "DL 1PB 5678",
    type: "Maintenance",
    status: "Pending",
  },
  {
    time: "09:15 AM",
    bus: "DL 1PA 1234",
    type: "Delay",
    status: "Resolved",
  },
];

const DashboardPage = () => {
  return (
    <>
      <style>{`
        .dashboard {
          width: 100%;
          max-width: 80rem;
          margin: 0 auto;
          padding: 2.5rem 2rem 2rem 2rem;
          min-height: 100vh;
          background: #f3f4f6;
          margin-left: ${SIDEBAR_WIDTH}px;
          transition: margin-left 0.2s;
        }
        .cardBox {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 2rem;
          margin-bottom: 2.5rem;
        }
        .card {
          background: #fff;
          border-radius: 1.2rem;
          box-shadow: 0 2px 12px rgba(22,163,74,0.08);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 2rem 1.5rem;
          transition: box-shadow 0.2s;
          border-left: 6px solid #16a34a;
          position: relative;
        }
        .card:hover {
          box-shadow: 0 6px 24px rgba(22,163,74,0.13);
        }
        .numbers {
          font-size: 2.2rem;
          font-weight: 800;
          color: #16a34a;
          margin-bottom: 0.3rem;
        }
        .cardName {
          font-size: 1.1rem;
          color: #374151;
          font-weight: 600;
        }
        .iconBx {
          background: #bbf7d0;
          color: #16a34a;
          border-radius: 50%;
          padding: 1rem;
          font-size: 2rem;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 8px rgba(22,163,74,0.10);
        }
        .details {
          margin-top: 2.5rem;
        }
        .recentOrders {
          background: #fff;
          border-radius: 1.2rem;
          box-shadow: 0 2px 12px rgba(22,163,74,0.08);
          padding: 1.2rem 1rem;
        }
        .cardHeader h2 {
          font-size: 1.2rem;
          font-weight: 700;
          color: #16a34a;
          margin-bottom: 0.7rem;
        }
        .alerts-list {
          display: flex;
          flex-direction: column;
          gap: 0.7rem;
        }
        .alert-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #f0fdf4;
          border-radius: 0.7rem;
          padding: 0.7rem 1rem;
          font-size: 1rem;
          box-shadow: 0 1px 4px rgba(22,163,74,0.05);
        }
        .alert-row .alert-time {
          font-weight: 600;
          color: #166534;
          min-width: 80px;
        }
        .alert-row .alert-bus {
          font-weight: 500;
          color: #15803d;
          min-width: 110px;
        }
        .alert-row .alert-type {
          color: #374151;
          min-width: 110px;
        }
        .alert-row .alert-status {
          font-size: 0.98rem;
          font-weight: 600;
          border-radius: 1rem;
          padding: 0.3rem 0.9rem;
        }
        .alert-row .Pending {
          background: #fef08a;
          color: #b45309;
        }
        .alert-row .Resolved {
          background: #bbf7d0;
          color: #166534;
        }
        @media (max-width: 900px) {
          .dashboard {
            padding: 1.2rem 0.5rem;
            margin-left: 0;
          }
          .cardBox {
            gap: 1rem;
          }
          .recentOrders {
            padding: 1rem 0.5rem;
          }
          .alert-row {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.3rem;
            padding: 0.7rem 0.7rem;
          }
        }
      `}</style>
      <div className="dashboard">
        <div className="cardBox">
          {stats.map((stat, index) => (
            <div className="card" key={index}>
              <div>
                <div className="numbers">{stat.value}</div>
                <div className="cardName">{stat.title}</div>
              </div>
              <div className="iconBx">
                <ion-icon name={stat.icon}></ion-icon>
              </div>
            </div>
          ))}
        </div>

        <div className="details">
          <div className="recentOrders">
            <div className="cardHeader">
              <h2>Recent Alerts</h2>
            </div>
            <div className="alerts-list">
              {recentAlerts.map((alert, idx) => (
                <div className="alert-row" key={idx}>
                  <span className="alert-time">{alert.time}</span>
                  <span className="alert-bus">{alert.bus}</span>
                  <span className="alert-type">{alert.type}</span>
                  <span className={`alert-status ${alert.status}`}>{alert.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardPage;