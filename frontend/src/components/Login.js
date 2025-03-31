import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/style.css";
import lockIcon from "../assets/lock.svg";
import { API_URL } from "../config";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState([]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const validateForm = () => {
    let newErrors = [];
    if (!formData.email.trim()) newErrors.push("Email is required");
    if (!formData.password.trim()) newErrors.push("Password is required");
    setErrors(newErrors);
    return newErrors.length === 0;
  };
  
  const handleSubmit =async (e) => {
    e.preventDefault();
    setErrors([]); // Clear previous errors

    if (validateForm()) {
      console.log("Login Submitted", formData);
    } else
      return;
    let aErrors = [];
    try {
        const data = {
          emailId:formData.email,
          password:formData.password
        }
        console.log("API_URL:",API_URL)
        console.log("login:",data);
        console.log("stringify 1:", JSON.stringify(data))
        const resp = await fetch (`${API_URL}/auth`,
          {
          method:"POST",
          headers:{
            "Content-Type":"application/json"
          },
          body:JSON.stringify(data)
        }
        );
        const json = await resp.json();
        console.log(json);
        console.log(json.accountId );
        
        if (json.accountId === -1){
          aErrors.push("Invalid login credentials or account does not exist");
          aErrors.push("Please try again later.");      
          setErrors(aErrors);
          return;
        }else{

          // Redirect user based on role
          if (json.accountType === "student") {
            navigate("/studentdashboard", { state: { accData: json} });
          } else if (json.accountType === "tutor") {
            navigate("/tutordashboard", { state: { accData: json} });
          }
        }

    }catch (ex){
      aErrors.push("An error occurred");
      aErrors.push("Please try again later.");      
      setErrors(aErrors);
      return ;
    }
  };

  return (
    <div className="wrapper">
      <h1>Tutor Finder</h1>
      {errors.length > 0 && <p className="error-message">{errors.join(". ")}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email-input">@</label>
          <input type="email" id="email" placeholder="Enter email" value={formData.email} onChange={handleChange} />
        </div>
        <div>
          <label htmlFor="password-input"><img src={lockIcon} alt="Lock" /></label>
          <input type="password" id="password" placeholder="Password" value={formData.password} onChange={handleChange} />
        </div>
        <button type="submit">Login</button>
      </form>
      <p>First Time User? <a href="/register">Signup</a></p>
      <br></br>
      <p>Forgot Password? <a href="/forgotpassword">Retrieve</a></p>
    </div>
  );
};

export default Login;
