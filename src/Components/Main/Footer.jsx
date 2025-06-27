import React from "react";

const Footer = () => (
  <>

    <style>{`
      .main-footer {
        background: linear-gradient(90deg, #f0fdf4 60%, #bbf7d0 100%);
        color: #166534;
        border-radius: 1.2rem 1.2rem 1.2rem 1.2rem;
        box-shadow: 0 -2px 12px rgba(22,163,74,0.10);
        margin-top: 0.2rem;
        margin-left: 0.4rem;
        margin-right: 0.4rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        min-height: 110px;
        // width: 100%;
        padding: 0;
        border: 1.5px solid #e5e7eb;
      }
      .footer-card {
      
        width: 100%;
        max-width: 80rem;
        margin: 0 auto;
        padding: 1.5rem 2rem 1.2rem 2rem;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
      }
      .footer-content {
        width: 100%;
        display: flex;
        flex-direction: row;
        align-items: flex-start;
        justify-content: space-between;
        gap: 2rem;
      }
      .footer-section {
        flex: 1 1 180px;
        min-width: 150px;
      }
      .footer-section h4 {
        font-size: 1.1rem;
        font-weight: bold;
        margin-bottom: 0.5rem;
        color: #16a34a;
      }
      .footer-section ul {
        list-style: none;
        padding: 0;
        margin: 0;
      }
      .footer-section li {
        margin-bottom: 0.3rem;
      }
      .footer-section a {
        color: #166534;
        text-decoration: none;
        transition: color 0.2s;
        font-size: 0.98rem;
      }
      .footer-section a:hover {
        color: #16a34a;
      }
      .footer-about {
        font-size: 0.98rem;
        color: #374151;
        margin-bottom: 0.3rem;
      }
      .footer-bottom {
        margin-top: 1.2rem;
        text-align: center;
        font-size: 0.97rem;
        color: #166534;
        width: 100%;
      }
      @media (max-width: 900px) {
        .footer-card {
          padding: 1.5rem 1rem 1.2rem 1rem;
        }
        .footer-content {
          flex-direction: column;
          align-items: center;
          gap: 1.2rem;
        }
        .footer-section {
          min-width: 0;
          width: 100%;
          text-align: center;
        }
      }
    `}</style>

    <footer className="main-footer">
      <div className="footer-card">
        <div className="footer-content">
          <div className="footer-section">
            <h4>About</h4>
            <div className="footer-about">
              <strong>Check It</strong> helps you find, track, and plan your Delhi bus journeys with ease. 
              Enjoy real-time updates and a seamless travel experience.
            </div>
          </div>
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="/check-in-app">App</a> | <a href="/check-in-card">Card</a></li>
              <li><a href="/app-features">Features</a> | <a href="/allcities">Cities</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Contact</h4>
            <ul>
              <li>
                <a href="mailto:support@checkit.com">vishnuchoubey9939@checkit.com</a>
              </li>
              <li>
                <a href="tel:+919939940039">+91 99399 40039</a>
              </li>
              <li>
                <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer">Twitter</a>
                {" | "}
                <a href="https://facebook.com/" target="_blank" rel="noopener noreferrer">Facebook</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          &copy; {new Date().getFullYear()} Check It &mdash; Delhi Bus Route Tracker.
        </div>
      </div>
    </footer>
  </>
);

export default Footer;