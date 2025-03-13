
import React, { useState } from "react";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import "../styles/style.css";
import personIcon from "../assets/person.svg";
import lockIcon from "../assets/lock.svg";
import phoneIcon from "../assets/phone.svg";
import courseIcon from "../assets/book.svg";



const Register = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState("");

  const [selectedOptions, setSelectedOptions] = useState([]);
  const options = ["React", "Vue", "Angular", "Svelte"];

  const [formData, setFormData] = useState({ firstname: "", lastname: "", email: "", password: "", repeatPassword: "", phonenumber: "", course: "" });
  const [errors, setErrors] = useState([]);

  const handleChange = (e) => {
    const values = Array.from(e.target.selectedOptions, (option) => option.value);
    setSelectedOptions(values);
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleRoleSelection = (selectedRole) => {
    setRole(selectedRole);
  };

  const validateForm = () => {
    let newErrors = [];
    if (!formData.firstname.trim()) newErrors.push("First Name is required");
    if (!formData.lastname.trim()) newErrors.push("Last Name is required");
    if (!formData.email.trim()) newErrors.push("Email is required");
    if (!formData.password.trim()) newErrors.push("Password is required");
    if (formData.password.length < 8) newErrors.push("Password must have at least 8 characters");
    if (formData.password !== formData.repeatPassword) newErrors.push("Passwords do not match");
    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("User Registered", formData, role);
      // Redirect based on role
      if (role === "student") {
        navigate("/studentdashboard");
      } else if (role === "tutor") {
        navigate("/tutordashboard");
      }
    }
  };

  return (
    <div className="wrapper">
      <h1>Signup</h1>
      {errors.length > 0 && <p className="error-message">{errors.join(". ")}</p>}
      <form onSubmit={handleSubmit}>
        <div className="role-selection">
          <button type="button" className={`role-btn ${role === "student" ? "active" : ""}`} onClick={() => handleRoleSelection("student")}>
            Student
          </button>
          <button type="button" className={`role-btn ${role === "tutor" ? "active" : ""}`} onClick={() => handleRoleSelection("tutor")}>
            Tutor
          </button>
        </div>
        <input type="hidden" name="role" value={role} />
        <div>
          <label htmlFor="firstname-input"><img src={personIcon} alt="Person" /></label>
          <input type="text" id="firstname" placeholder="Enter First Name" value={formData.firstname} onChange={handleChange} />
        </div>
        <div>
          <label htmlFor="lastname-input"><img src={personIcon} alt="Person" /></label>
          <input type="text" id="lastname" placeholder="Enter Last Name" value={formData.lastname} onChange={handleChange} />
        </div>
        <div>
          <label htmlFor="email-input">@</label>
          <input type="email" id="email" placeholder="Enter Email" value={formData.email} onChange={handleChange} />
        </div>
        <div>
          <label htmlFor="password-input"><img src={lockIcon} alt="Lock" /></label>
          <input type="password" id="password" placeholder="Password" value={formData.password} onChange={handleChange} />
        </div>
        <div>
          <label htmlFor="repeatpassword-input"><img src={lockIcon} alt="Lock" /></label>
          <input type="password" id="repeatPassword" placeholder="Repeat Password" value={formData.repeatPassword} onChange={handleChange} />
        </div>
        <div>
          <label htmlFor="phonenumber-input"><img src={phoneIcon} alt="Phone" /></label>
          <input type="text" id="phonenumber" placeholder="Enter Phone Number" value={formData.phonenumber} onChange={handleChange} />
        </div>
        <div>
          <label htmlFor="courselabel"></label>
          <p>Select the courses below:</p>
        </div>
       
        <div>
        <label htmlFor="course-input"><img src={courseIcon} alt="Course" /></label>
          <Select
            isMulti
            options={options}
            value={selectedOptions}
            onChange={setSelectedOptions}
          />
          <p>Selected: {selectedOptions.map(option => option.label).join(",")}</p>
        </div>
        <button type="submit">Signup</button>
      </form>
      <p>Already have an account? <a href="/login">Login</a></p>
    </div>
  );
};

export default Register;