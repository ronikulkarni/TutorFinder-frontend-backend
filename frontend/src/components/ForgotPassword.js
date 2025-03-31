import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/style.css";
import lockIcon from "../assets/lock.svg";
import { API_URL } from "../config";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1); // 1: enter email, 2: enter otp
  const [message, setMessage] = useState("");


  const handleSendOtp = async (e) => {
    e.preventDefault();
    try {
      console.log(JSON.stringify({ email }))  ;
      const response = await fetch(`${API_URL}/sendOTP`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const result = await response.json();

      if (result === true) {
        setStep(2);
        setMessage("Access key sent to your email.");
      } else {
        setMessage(result.message || "Failed to send access key.");
      }
    } catch (err) {
      setMessage("Error contacting server.");
      console.error(err);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/verifyOTP`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      const result = await response.json();

      if (result === true) {
        setMessage("Your password has been emailed to you.");
        setStep(3);
      } else {
        setMessage(result.message || "Invalid access key.");
      }
    } catch (err) {
      setMessage("Error verifying access key.");
      console.error(err);
    }
  };


  return (
    <div className="wrapper">
      <h1>Forgot Password</h1>
      {step === 1 && (

      <form onSubmit={handleSendOtp}>
        <div>
          <label htmlFor="email-input">@</label>
          <input type="email" id="email" placeholder="Enter email"  onChange={(e) => setEmail(e.target.value)} />
        </div>
        <button type="submit">Send Access Key</button>
      </form>
    )}
    {step === 2 && (

        <form onSubmit={handleVerifyOtp}>
        <div>
          <label htmlFor="otp-input"><img src={lockIcon} alt="Lock" /></label>
          <input type="otp" id="otp" placeholder="Enter Access Key" onChange={(e) => setOtp(e.target.value)} />
        </div>
        <button type="submit">Verify</button>
        </form>
     )}
      
      {step === 3 && (
        <div>
          <p>Your password has been sent to <strong>{email}</strong>.</p>
          <p>Please check your inbox.</p>
        </div>
      )}
      {message && <p style={{ marginTop: "1rem", color: "green" }}>{message}</p>}
      <p>Back to Login? <a href="/login">Login</a></p>
    </div>
  );
};

export default ForgotPassword;
