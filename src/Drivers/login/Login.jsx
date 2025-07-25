import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;

    // Simple validation
    if (!email || !password) {
      setError("Please fill out all fields.");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Invalid email format.");
      return;
    }

    setError(""); // Clear errors

    try {
      const response = await fetch("http://localhost:8080/api/auth/authenticateDriver", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.accessToken && data.refreshToken) {
          localStorage.setItem("accessToken", data.accessToken);
          localStorage.setItem("refreshToken", data.refreshToken);
          navigate("/driverprofile");
        } else {
          setError("Login failed: Invalid response from server.");
        }
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Invalid email or password.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <>
      <style>{`
                .home-card {
          display: flex;
  
          gap: 3rem;
          align-items: center;
          background: #fff;
          border-radius: 2rem;
          box-shadow: 0 8px 32px rgba(22,163,74,0.13), 0 2px 8px rgba(22,163,74,0.08);
          padding: 2rem 2rem 2rem 2rem;
          margin-top: 0;
          margin-bottom: 0.5rem;
          margin-left: 0.4rem;
          margin-right: 0.4rem;
          background: linear-gradient(90deg, #f0fdf4 60%, #bbf7d0 100%);
          align-self: center;
        }
         .user-login-card {
          background: linear-gradient(90deg, #f0fdf4 60%, #bbf7d0 100%);
          border-radius: 1.5rem;
          box-shadow: 0 6px 32px rgba(22,163,74,0.10), 0 1.5px 6px rgba(22,163,74,0.08);
          padding: 2.5rem 2rem 2rem 2rem;
          max-width: 370px;
          width: 100%;
          position: relative;
         margin: 0 auto;
        }
        .user-login-separator {
          position: absolute;
          left: 50%;
          top: -18px;
          transform: translateX(-50%);
          width: 60px;
          height: 7px;
          background: #4ade80;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(22,163,74,0.15);
          border: 1.5px solid #16a34a;
          align-self: center;
        }
        .user-login-title {
          font-size: 2rem;
          font-weight: 800;
          color: #16a34a;
          margin-bottom: 0.2rem;
          letter-spacing: 0.04em;
          text-align: center;
        }
        .user-login-subtitle {
          font-size: 1.05rem;
          color: #4b5563;
          margin-bottom: 1.5rem;
          text-align: center;
        }
        .form-group {
          margin-bottom: 1.2rem;
          text-align: left;
        }
        .form-group label {
          display: block;
          font-weight: 600;
          margin-bottom: 0.4rem;
          color: #166534;
        }
        .form-group input {
          width: 100%;
          padding: 0.65rem;
          border: 1.5px solid #bbf7d0;
          border-radius: 0.5rem;
          font-size: 1rem;
          background: #f0fdf4;
          transition: border-color 0.2s;
        }
        .form-group input:focus {
          outline: none;
          border-color: #16a34a;
          background: #fff;
        }
        .error-message {
          color: #dc2626;
          font-size: 0.97rem;
          margin-bottom: 0.7rem;
          text-align: left;
        }
        .user-login-btn {
          width: 100%;
          padding: 0.7rem;
          background: linear-gradient(90deg, #16a34a 60%, #22d3ee 100%);
          color: #fff;
          border: none;
          border-radius: 0.7rem;
          font-size: 1.1rem;
          font-weight: 700;
          cursor: pointer;
          margin-top: 0.2rem;
          margin-bottom: 0.7rem;
          box-shadow: 0 2px 8px rgba(22,163,74,0.10);
          transition: background 0.2s;
        }
        .user-login-btn:hover {
          background: linear-gradient(90deg, #15803d 60%, #0ea5e9 100%);
        }
        .user-options {
          margin-top: 0.7rem;
          display: flex;
          justify-content: space-between;
          font-size: 0.98rem;
        }
        .user-options a {
          color: #16a34a;
          text-decoration: none;
          font-weight: 600;
          transition: color 0.2s;
        }
        .user-options a:hover {
          color: #0ea5e9;
          text-decoration: underline;
        }
     
       @media (max-width: 600px) {
          .home-card {
            flex-direction: column;
            gap: 1rem;
            padding: 1rem;
          }

          .user-login-card {
            padding: 1.5rem 1rem;
            max-width: 95%;
          }

          .user-login-title {
            font-size: 1.5rem;
          }

          .user-login-subtitle {
            font-size: 1rem;
          }

  .user-login-btn {
    font-size: 1rem;
    padding: 0.6rem;
  }

  .form-group input {
    font-size: 0.95rem;
  }
}


      `}</style>
      <div className="home-card">
        <div className="user-login-card">
          <div className="user-login-separator"></div>
          <h2 className="user-login-title">Bus Driver Login</h2>
          <div className="user-login-subtitle">
            Sign in to access your Check It account
          </div>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
              />
            </div>
            <div className="form-group">
              <label>Password:</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
              />
            </div>
            {error && <p className="error-message">{error}</p>}
            <button type="submit" className="user-login-btn">
              Login
            </button>
          </form>
          <div className="user-options">
            <a href="/forgot-password">Forgot Password?</a>
            <Link to="/Registration">Register</Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;