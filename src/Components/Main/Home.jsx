import React from "react";
import { useNavigate } from "react-router-dom";
import Footer from "./Footer";

const Home = () => {
  const navigate = useNavigate();

  const handleFindBuses = () => {
    navigate("app-features");
  };

  const handleDriverLogin = () => {
    navigate("Login");
  };

  const handleUserLogin = () => {
    navigate("LoginUser");
  };

  return (
    <>
   <style>{`
.home-card-container {
  max-width: 1200px;
  margin: 0.2rem 0.4rem 0.5rem 0.4rem;
  position: relative;
  box-sizing: border-box;
  width: 100%;
  padding: 0 1rem;
}

.home-sep-bar {
  position: absolute;
  left: 50%;
  top: -20px;
  transform: translateX(-50%);
  width: 96px;
  height: 12px;
  border-radius: 9999px;
  background: #4ade80;
  box-shadow: 0 4px 12px 0 rgba(22,163,74,0.15);
  border: 1.5px solid #166534;
  z-index: 10;
}

.home-card {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  align-items: center;
  background: linear-gradient(90deg, #f0fdf4 60%, #bbf7d0 100%);
  border-radius: 2rem;
  box-shadow: 2px 4px 16px rgba(22, 163, 74, 0.15);
  padding: 2rem;
  width: 100%;
  box-sizing: border-box;
}

.home-img {
  border-radius: 1rem;
  box-shadow: 0 4px 16px rgba(22,163,74,0.13);
  max-width: 400px;
  width: 100%;
  border: 4px solid #166534;
  margin: 0 auto;
  display: block;
}

.home-main-title {
  font-size: 4rem;
  font-weight: 800;
  color: #166534;
  margin-bottom: 0rem;
  line-height: 1;
}

.home-main-subtitle {
  font-size: 2rem;
  font-weight: 700;
  color: #374151;
  margin-bottom: 0rem;
}

.home-main-desc {
  color: #4b5563;
  font-size: 1.1rem;
  margin-bottom: 1.5rem;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
}

.home-why-title {
  font-size: 2rem;
  font-weight: 700;
  color: #166534;
  margin-bottom: 1rem;
  text-align: center;
}

.home-why-list {
  list-style: disc inside;
  color: #374151;
  font-size: 1.2rem;
  padding-left: 2rem;
  margin-left: 0;
}

.home-btn-group {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
}

.home-btn {
  font-size: 1.15rem;
  font-weight: 600;
  border: none;
  border-radius: 9999px;
  padding: 1rem 2.5rem;
  box-shadow: 0 2px 8px rgba(22,163,74,0.10);
  transition: background 0.2s, color 0.2s;
  cursor: pointer;
}

.home-btn-find {
  background: linear-gradient(90deg, #22c55e 60%, #166534 100%);
  color: #fff;
}

.home-btn-find:hover {
  background: linear-gradient(90deg, #16a34a 60%, #15803d 100%);
}

.home-btn-driver {
  background: linear-gradient(90deg, #1f2937 60%, #111827 100%);
  color: #fff;
}

.home-btn-driver:hover {
  background: linear-gradient(90deg, #166534 60%, #15803d 100%);
}

.home-btn-user {
  background: linear-gradient(90deg, #4ade80 60%, #16a34a 100%);
  color: #fff;
}

.home-btn-user:hover {
  background: linear-gradient(90deg, #16a34a 60%, #15803d 100%);
}

/* Tablet */
@media (max-width: 900px) {
  .home-card {
    gap: 2rem;
  }

  .home-main-title {
    font-size: 3rem;
    text-align: center;
  }

  .home-main-subtitle {
    text-align: center;
  }

  .home-why-list {
    padding-left: 2rem;
    font-size: 1.1rem;
  }
}

/* Mobile */
@media (max-width: 600px) {
  .home-card {
    padding: 1.5rem;
    gap: 1.5rem;
    display: flex;
  }

  .home-main-title {
    font-size: 2.2rem;
  }

  .home-main-subtitle {
    font-size: 1.3rem;
  }

  .home-main-desc {
    font-size: 1rem;
    padding: 0 0.5rem;
  }

  .home-img {
    max-width: 100%;
  }

  .home-btn {
    font-size: 1rem;
    padding: 0.8rem 2rem;
  }

  .home-why-list {
    font-size: 1rem;
    padding-left: 1.5rem;
  }
}
`}</style>

      <>

          <div className="home-card-container">
            {/* <div className="home-sep-bar"></div> */}
            <div className="home-card">
              {/* Left Side: Image and Content */}
              <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <img
                    className="home-img"
                    alt="Delhi Bus Travel"
                    src="https://th.bing.com/th/id/OIP.3wUDnBXkPJCzBzTkrV2ZZgHaET?w=550&h=280&c=7&r=0&o=5&dpr=1.5&pid=1.7"
                  />
                </div>
                <div>
                  <h3 className="home-why-title">Why Choose Check It?</h3>
                  <ul className="home-why-list">
                    <li>Find the fastest and most convenient routes.</li>
                    <li>Access real-time bus availability and schedules.</li>
                    <li>Manage tickets and passes with ease.</li>
                    <li>Seamless experience for drivers and passengers alike.</li>
                  </ul>
                </div>
              </div>
              {/* Right Side: Main Content */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", gap: "2rem" }}>
                <h1 className="home-main-title">Welcome to Check It</h1>
                <h2 className="home-main-subtitle">Delhi Awaits You!</h2>
                <p className="home-main-desc">
                  Experience seamless bus travel across Delhi with Check It. Log in to
                  access exclusive features or explore routes with ease.
                </p>
                <div className="home-btn-group">
                  <button
                    onClick={handleFindBuses}
                    className="home-btn home-btn-find"
                  >
                    Find Buses
                  </button>
                  <button
                    onClick={handleDriverLogin}
                    className="home-btn home-btn-driver"
                  >
                    Driver Login
                  </button>
                  <button
                    onClick={handleUserLogin}
                    className="home-btn home-btn-user"
                  >
                    User Login
                  </button>
                </div>
              </div>
            </div>
          </div>
       
        {/* Footer */}

      </>
    </>
  );
};

export default Home;