import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
const Registration = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    licenseNumber: "",
    licenseExpiry: "",
    address: "",
    experience: "",
    emergencyName: "",
    emergencyRelationship: "",
    emergencyPhone: "",
    password: "",
    confirmPassword: "",
    photo: null,
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "photo") {
      setFormData((prevData) => ({
        ...prevData,
        photo: files[0],
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const {
      name,
      email,
      phone,
      licenseNumber,
      licenseExpiry,
      address,
      experience,
      emergencyName,
      emergencyRelationship,
      emergencyPhone,
      password,
      confirmPassword,
      photo,
    } = formData;

    // Validation
    if (
      !name ||
      !email ||
      !phone ||
      !licenseNumber ||
      !licenseExpiry ||
      !address ||
      !experience ||
      !emergencyName ||
      !emergencyRelationship ||
      !emergencyPhone ||
      !password ||
      !confirmPassword
    ) {
      setError("Please fill out all fields.");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Invalid email format.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setError(""); // Clear errors

    // Prepare FormData for file upload
   const registerForm = new FormData();

        const jsonPayload = {
          name,
          email,
          phone,
          licenseNumber,
          licenseExpiry: licenseExpiry ? licenseExpiry.toISOString().split("T")[0] : "",
          address,
          experience,
          emergencyName,
          emergencyRelationship,
          emergencyPhone,
          password,
        };

        registerForm.append("request", new Blob([JSON.stringify(jsonPayload)], { type: "application/json" }));

        if (photo) {
          registerForm.append("photo", photo);
        }


    try {

      console.log("Submitting registration form:");
for (let pair of registerForm.entries()) {
  console.log(pair[0] + ": ", pair[1]);
}
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE}/api/auth/registerdriver`,
        registerForm,
        {
          headers: {
           
          },
        }
      );
      if (
        response.status === 200 &&
        response.data &&
        response.data.accessToken &&
        response.data.refreshToken
      ) {
        localStorage.setItem("accessToken", response.data.accessToken);
        localStorage.setItem("refreshToken", response.data.refreshToken);
        navigate("/driverprofile");
      } else {
        setSuccess("Registration successful!");
      }
      setFormData({
        name: "",
        email: "",
        phone: "",
        licenseNumber: "",
        licenseExpiry: "",
        address: "",
        experience: "",
        emergencyName: "",
        emergencyRelationship: "",
        emergencyPhone: "",
        password: "",
        confirmPassword: "",
        photo: null,
      });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Registration failed. Please try again."
      );
    }
  };

  return (
    <>
      <style>
        {`
        .registration-bg {
           grid-template-columns: 1fr 1fr;
          gap: 3rem;
          // align-items: center;
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
     
        .registration-card {
          background: #fff;
          border-radius: 1.5rem;
          box-shadow: 0 6px 32px rgba(22,163,74,0.10), 0 1.5px 6px rgba(22,163,74,0.08);
          padding: 2rem 1.5rem 1.5rem 1.5rem;
          max-width: 850px;
          width: 100%;
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: center;
          margin-left:3.5rem;
        }
        .registration-separator {
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
        }
        .registration-title {
          font-size: 2rem;
          font-weight: 800;
          color: #16a34a;
          margin-bottom: 0.2rem;
          letter-spacing: 0.04em;
          text-align: center;
        }
        .registration-subtitle {
          font-size: 1.05rem;
          color: #4b5563;
          margin-bottom: 1.2rem;
          text-align: center;
        }
        .form-row {
          display: flex;
          gap: 0.7rem;
        }
        .form-row > .form-group {
          flex: 1;
          margin-bottom: 0.7rem;
        }
        .form-group {
          margin-bottom: 0.7rem;
          text-align: left;
          flex: 1;
        }
        .form-group label {
          display: block;
          font-weight: 600;
          margin-bottom: 0.3rem;
          color: #166534;
        }
        .form-group input {
          width: 100%;
          padding: 0.55rem;
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
          margin-bottom: 0.6rem;
          text-align: left;
        }
        .success-message {
          color: #16a34a;
          font-size: 1rem;
          margin-bottom: 0.6rem;
          text-align: left;
        }
        .register-btn {
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
        .register-btn:hover {
          background: linear-gradient(90deg, #15803d 60%, #0ea5e9 100%);
        }
       @media (max-width: 600px) {
  .registration-card {
    display: flex;
    padding: 1.2rem 0.5rem 1rem 0.5rem;
    max-width: 98vw;
    margin-left: auto;
    margin-right: auto;
  }

  .form-row {
    flex-direction: column;
    gap: 0;
  }
}

        .footer-bottom {
          text-align: center !important;
        }
        `}
      </style>
      <div className="registration-bg">
       
          <div className="registration-card">
            <div className="registration-separator"></div>
            <h2 className="registration-title">Driver Registration</h2>
            <div className="registration-subtitle">
              Create your account to start your journey with Check It
            </div>
            <form onSubmit={handleSubmit} encType="multipart/form-data" autoComplete="off">
              <div className="form-row">
                <div className="form-group">
                  <label>Name:</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Full name"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Email:</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email"
                    required
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Phone:</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Phone number"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Photo:</label>
                  <input
                    type="file"
                    name="photo"
                    accept="image/*"
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>License Number:</label>
                  <input
                    type="text"
                    name="licenseNumber"
                    value={formData.licenseNumber}
                    onChange={handleChange}
                    placeholder="DL0420211234567"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>License Expiry:</label>
                <DatePicker
                selected={formData.licenseExpiry}
                onChange={(date) =>
                  setFormData({ ...formData, licenseExpiry: date })
                }
                dateFormat="MM/yyyy"
                showMonthYearPicker
                showFullMonthYearPicker
                placeholderText="MM/YYYY"
              />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Address:</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="123 MG Road, New Delhi, India"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Experience (years):</label>
                  <input
                    type="number"
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    placeholder="0"
                    min="0"
                    required
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Emergency Contact Name:</label>
                  <input
                    type="text"
                    name="emergencyName"
                    value={formData.emergencyName}
                    onChange={handleChange}
                    placeholder="Full Name"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Relationship:</label>
                  <input
                    type="text"
                    name="emergencyRelationship"
                    value={formData.emergencyRelationship}
                    onChange={handleChange}
                    placeholder="Wife"
                    required
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Emergency Phone:</label>
                  <input
                    type="tel"
                    name="emergencyPhone"
                    value={formData.emergencyPhone}
                    onChange={handleChange}
                    placeholder="Phone number"
                    required
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Password:</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Password"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Confirm Password:</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm password"
                    required
                  />
                </div>
              </div>
              {error && <p className="error-message">{error}</p>}
              {success && <p className="success-message">{success}</p>}
              <button type="submit" className="register-btn">Register</button>
            </form>
          </div>
        </div>
   
    </>
  );
};

export default Registration;