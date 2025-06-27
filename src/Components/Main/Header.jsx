import React from "react";

const Header = () => (
  <>
    <style>{`
      .main-header {
        background: #16a34a;
        color: #fff;
        padding: 1.5rem 0;
        border-radius: 0 0 1.5rem 1.5rem;
        box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 1.5rem;
      }
      .main-header .checkit-title {
        font-size: 2.5rem;
        font-weight: 900;
        letter-spacing: 0.08em;
        text-shadow: 0 2px 8px rgba(0,0,0,0.10);
        display: flex;
        align-items: center;
        gap: 0.75rem;
      }
      .main-header .bus-icon {
        font-size: 2.5rem;
        margin-right: 0.5rem;
      }
      @media (max-width: 600px) {
        .main-header .checkit-title {
          font-size: 1.5rem;
        }
        .main-header {
          padding: 1rem 0;
        }
      }
    `}</style>
    <header className="main-header">
      <span className="checkit-title">
        <ion-icon name="bus-outline" class="bus-icon"></ion-icon>
        Check It
      </span>
    </header>
  </>
);

export default Header;