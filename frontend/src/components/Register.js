
import React, { useState, useEffect } from "react";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import "../styles/style.css";
import "../styles/style2.css";
import personIcon from "../assets/person.svg";
import lockIcon from "../assets/lock.svg";
import phoneIcon from "../assets/phone.svg";
import bookIcon from "../assets/book.svg";
import { API_URL } from "../config";

const Register = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState("");
  const [courses, setCourses] = useState([]); // Stores course list from API
  const [selectedCourses, setSelectedCourses] = useState([]);
 
  const [formData, setFormData] = useState({ firstname: "", lastname: "", email: "", password: "", repeatPassword: "", phonenumber: "", course: "" });
  const [errors, setErrors] = useState([]);

   // Fetch course list from API when component loads
   useEffect(() => {
    fetch(`${API_URL}/courses`)
      .then((res) => res.json())
      .then((data) => setCourses(data))
      .catch((err) => console.error("Error fetching courses:", err));
  }, []);

  const handleCourseChange = (e) => {
    const selectedValues = Array.from(e.target.selectedOptions, option => option.value);
    setSelectedCourses(selectedValues);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleRoleSelection = (selectedRole) => {
    setRole(selectedRole);
  };

  const validateForm = () => {
    let newErrors = [];
    if (!role.trim()) newErrors.push("Please select if you are a Student or a Tutor");
    if (!formData.firstname.trim()) newErrors.push("First Name is required");
    if (!formData.lastname.trim()) newErrors.push("Last Name is required");
    if (!formData.email.trim()) newErrors.push("Email is required");
    if (!formData.password.trim()) newErrors.push("Password is required");
    if (formData.password.length < 8) newErrors.push("Password must have at least 8 characters");
    if (formData.password !== formData.repeatPassword) newErrors.push("Passwords do not match");
    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit =async (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("User Registered", formData, role);
      console.log("Submitted Course IDs:", selectedCourses);


      let aErrors = [];
      try {
          
          const courseString = selectedCourses.join(",");
          const accountdata = {
              firstName: formData.firstname,
              lastName: formData.lastname,
              emailId: formData.email,
              password: formData.password,
              phoneNumber: formData.phoneNumber,
              accountType: role,
              course: courseString,
              
          }
          console.log("stringify :", JSON.stringify(accountdata))
          const accountresp =  await fetch (`${API_URL}/addAccount`,
          {
              method:"POST",
              headers:{
                  "Content-Type":"application/json"
              },
              body:JSON.stringify(accountdata)
          });
          console.log("Response Status:", accountresp.status); // Log HTTP status code
          console.log("Response OK?:", accountresp.ok); // Check if response is successful
          console.log("Full Response Object:", accountresp); // See entire response

          if (!accountresp.ok) {
            console.error("Error Response:", accountresp.status, accountresp.statusText);
            return;
        }
        let accountjson = null;
        // ✅ Await text() to get the actual response content
        const text = await accountresp.text();
        console.log("API Response:", text);
        accountjson = text ? JSON.parse(text) : null; // ✅ Convert only if not empty
        console.log(accountjson);
        if (accountjson.accountId === -1)
        {
          aErrors.push("Account with this email id already exists.");
          aErrors.push(" Please use a different email ID or recover your password.");
          setErrors(aErrors);
          return;
        }
        else {
          navigate(role === "student" ? "/studentdashboard" : "/tutordashboard", {
                state: { accData: accountjson },
          });
        }
    
    }catch (ex){
      aErrors.push("An error occurred");
      aErrors.push("Please try again later.");      
      setErrors(aErrors);
      return ;
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
          <label htmlFor="course-input"><img src={bookIcon} alt="Course" /></label>
          <select className="large-dropdown" id="course-input" multiple  value={selectedCourses} onChange={handleCourseChange} >
            <option value="">Select all your courses</option>
            {courses.map((course) => (
              <option key={course.courseId} value={course.courseId}>
                {course.courseName}
              </option>
            ))}
          </select>
        </div>

        <button type="submit">Signup</button>
      </form>
      <p>Already have an account? <a href="/login">Login</a></p>
    </div>
  );
};

export default Register;