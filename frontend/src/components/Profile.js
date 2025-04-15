import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { API_URL } from "../config";
import "../styles/style2.css"; 
import "../styles/style.css"; 
import personIcon from "../assets/person.svg";
import lockIcon from "../assets/lock.svg";
import phoneIcon from "../assets/phone.svg";
import bookIcon from "../assets/book.svg";
import { Link } from "react-router-dom";

const Profile = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { accData } = location.state || {};
  const [errors, setErrors] = useState([]);
  const [availability, setAvailability] = useState([]);
  const [formData, setFormData] = useState({
    email: accData?.emailId || "",
    phoneNumber: accData?.phoneNumber || "",
    password: "",
    course: accData?.course ? accData.course.split(",") : [],
    avatar: accData?.avatarURL || "",
    profilePic: accData?.profileURL || "",
  });

  const [allCourses, setAllCourses] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/courses`)
      .then((res) => res.json())
      .then((data) => setAllCourses(data))
      .catch((err) => console.error("Failed to load courses", err));
  }, []);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleCourseChange = (e) => {
    const selected = Array.from(e.target.selectedOptions, (o) => o.value);
    setFormData((prev) => ({ ...prev, course: selected }));
  };

  const handleFileUpload = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;
  
    // Preview file locally
    const localPreview = URL.createObjectURL(file);
  
    // Simulate where the file would be stored on your dev server
    const simulatedURL = `/uploads/${file.name}`;
  
    // For preview: you can show the preview URL
    // For saving: use the simulated URL (manually place file in /public/uploads/)
    setFormData((prev) => ({
      ...prev,
      [type]: simulatedURL,
    }));
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    let aErrors = [];
    const updatePayload = {
        emailId: formData.email,
        phoneNumber: formData.phoneNumber,
        password: formData.password || undefined,
        course: formData.course.join(","),
        avatarURL: formData.avatar,
        profileURL: formData.profilePic,
        };

    const res = await fetch(`${API_URL}/account/${accData.accountId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatePayload),
    });

    if (!res.ok) {
        console.error("Error Response:", res.status, res.statusText);
        return;
    }

    let accountjson = null;
    // Await text() to get the actual response content
    const text = await res.text();
    console.log("API Response:", text);
    accountjson = text ? JSON.parse(text) : null; // ✅ Convert only if not empty
    console.log(accountjson);
    if (accountjson.accountId === -1)
    {
      aErrors.push("Error updating account");
      setErrors(aErrors);
      return;
    }
    else {
      navigate(accountjson.accountType === "student" ? "/studentdashboard" : "/tutordashboard", {
            state: { accData: accountjson },
      });
    }
  };

  return (

    <div className="dashboard-wrapper">
    {/* Sidebar */}
    <aside id="sidebar">
      <ul>
        <li className="logo">
          <span>TutorFinder</span>
          <button onClick={toggleSidebar} id="toggle-btn">
            <i className="fa-solid fa-bars"></i>
          </button>
        </li>
     
        <li className="active">
        {accData?.accountType === "tutor" ? (
           <Link to="/tutordashboard" state={{ accData }}>Dashboard</Link>
          ) : (
           <Link to="/studentdashboard" state={{ accData }}>Dashboard</Link>
          )} 
        </li>
        {accData?.accountType === "student" && (
          <li>
              <Link to="/schedulesession" state={{ accData }}>Schedule Session</Link>
          </li>
        )}
         <li>
            <Link to="/messages" state={{ accData }}>View Messages</Link>   
          </li>
         <li>
            <Link to="/calendar" state={{ accData }}>Check Calendar</Link>
          </li>
          <li>
          {accData?.accountType === "student" ? (
            <Link to="/tutorsearch" state={{ accData }}>Tutor Search</Link>
          ) : (
            <Link to="/availability" state={{ accData, availabilityData: availability}}>Manage Availability</Link>
          )}
         </li> 
          <li>
              <a href="/profile" class="nav-link current" onclick="return false;">Manage Profile</a>
          </li>
          <li >
              <Link to="/login" onClick={() => { navigate("/login", { state: null });}}>Sign out</Link>
          </li>
      </ul>
    </aside>

     {/* Main Content */}
     <main className="dashboard-main">
      <nav className="navbar">
        <button className="theme-toggle" onClick={toggleTheme}>
          <i className="fa-regular fa-moon"></i>
          <i className="fa-regular fa-sun"></i>
        </button>
        <div className="user-profile">
            {accData?.profileURL ? (
              <img src={accData.profileURL} alt="Avatar" className="avatar" />
            ) : accData?.avatarURL ? (
              <img src={accData.avatarURL} alt="Avatar" className="avatar" />
            ) : (
              <div className="profile-placeholder">
                {accData?.accountType === "student" ? "Student Profile" : "Tutor Profile"}
              </div>
            )}
          </div>
      </nav>

      <section className="content">
      <h1>Edit Profile</h1>
    
      <form onSubmit={handleSubmit}>
         <div>
         <label htmlFor="email-input">@</label>
         <input type="email" id="email" placeholder="Enter Email" value={formData.email} onChange={handleInputChange} />
         </div>

         <div>
         <label htmlFor="phonenumber-input"><img src={phoneIcon} alt="Phone" /></label>
         <input type="phoneNumber" id="phoneNumber" placeholder="Enter Email" value={formData.phoneNumber} onChange={handleInputChange} />
         </div>

         <div>
         <label htmlFor="password-input"><img src={lockIcon} alt="Lock" /></label>
         <input type="password" id="password" placeholder="Leave blank to keep current" value={formData.password} onChange={handleInputChange} />
         </div>

         <div>
          <label htmlFor="course-input"><img src={bookIcon} alt="Course" /></label>
          <select className="large-dropdown" id="course-input" multiple value={formData.course} onChange={handleCourseChange}>
            {allCourses.map((course) => (
              <option key={course.courseId} value={course.courseId}>
                {course.courseName}
              </option>
            ))}
          </select>

    
          </div>
          <br></br><br></br>
      
          <div><h3>Choose Avatar Picture</h3> </div>
          <div>
          <label htmlFor="avatar-input"><img src={personIcon} alt="Avatar" /></label>
          <input type="file" placeholder="Choose Avatar picture" onChange={(e) => handleFileUpload(e, "avatar")} />
            {formData.avatar && <img src={formData.avatar} alt="Avatar" width={80} />}
          </div>
          <br></br><br></br>

          <div><h3>Choose Profile Picture</h3> </div>
          <div>
          <label htmlFor="profilepic-input"><img src={personIcon} alt="PP" /></label>
          <input type="file" placeholder="Choose Profile picture" onChange={(e) => handleFileUpload(e, "profilePic")} />
          {formData.profilePic && <img src={formData.profilePic} alt="Profile" width={100} />}
          </div>
          
          <button type="submit">Save Changes</button>

      </form>
    </section>
    </main>
    </div>
  );
};


// Sidebar toggle function
const toggleSidebar = () => {
    document.getElementById("sidebar").classList.toggle("collapsed");
  };
  
  // Theme Toggle (Only affects dashboard)
  const toggleTheme = () => {
    document.querySelector(".dashboard-wrapper").classList.toggle("dark-theme");
  };

export default Profile;
