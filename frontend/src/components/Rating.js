import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import "../styles/style2.css"; 
import "../styles/style.css"; 
import { Link } from "react-router-dom";
import searchIcon from "../assets/search.svg";
import bookIcon from "../assets/book.svg";
import personIcon from "../assets/person.svg";
import starIcon from "../assets/star.svg";

import { API_URL } from "../config";
import StarRating from "./StarRating"; 


const Rating = () => {

  // Grab URL params
  const { tutorId, studentId, tutorName } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { accData } = location.state || {}; 
  console.log("accData", accData);
  const [formData, setFormData] = useState({ rating: "", comment: "" });
  const [errors, setErrors] = useState([]);
 
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const validateForm = () => {
    let newErrors = [];

    if (!formData.rating || formData.rating < 1 || formData.rating > 5) {
      newErrors.push("Please select a rating between 1 and 5");
    }
    setErrors(newErrors);
    return newErrors.length === 0;
  };
  
  const handleSubmit =async (e) => {
    e.preventDefault();
    setErrors([]); // Clear previous errors

    if (validateForm()) {
      console.log("Rating Submitted", formData);
    } else
      return;
    let aErrors = [];
    try {
        const data = {
          tutorId: tutorId,
          studentId: studentId, 
          rating: formData.rating,
          comment: formData.comment
        }
        console.log("rating:",data);
        console.log("stringify 1:", JSON.stringify(data))
        const resp = await fetch (`${API_URL}/addRating`,
          {
          method:"POST",
          headers:{
            "Content-Type":"application/json"
          },
          body:JSON.stringify(data)
        }
        );
        const success = await resp.json(); // expect a boolean: true or false
        console.log("Rating success:", success);

        if (success) {
          navigate("/studentdashboard", { state: { accData: accData} });
        } else {
            aErrors.push("Failed to submit rating.");
            setErrors(aErrors);
            return;
        }

    }catch (ex){
      aErrors.push("An error occurred");
      aErrors.push("Please try again later.");      
      setErrors(aErrors);
      return ;
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
          <Link to="/studentdashboard" state={{ accData }}>Dashboard</Link>
        </li>
        <li className="active">
           <Link to="/schedulesession" state={{ accData }}>Schedule Session</Link>
         </li>
         <li>
            <Link to="/messages" state={{ accData }}>View Messages</Link>   
          </li>
         <li>
            <Link to="/calendar" state={{ accData }}>Check Calendar</Link>
          </li>
          <li>
            <Link to="/search" state={{ accData }}>Tutor Search</Link>
          </li>
        <li>
            <a href="/rating" class="nav-link current" onclick="return false;">Rate Tutor</a>
        </li>
        <li>
            <Link to="/profile" state={{ accData }}>Manage Profile</Link>
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
          <img src="/assets/profile.jpg" alt="Profile" className="avatar" />
        </div>
      </nav>

      <section className="content">
      <h1>Rate Your Tutor</h1>
      {errors.length > 0 && <p className="error-message">{errors.join(". ")}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="tutor-input"><img src={personIcon} alt="Tutor" /></label>
          <input value={tutorName} disabled/>
        </div>
        <div>
          <label htmlFor="rating-input"><img src={starIcon} alt="Rating" /></label>
          <div className="star-input-wrapper">
          <StarRating
            totalStars={5}
            onRatingChange={(star) => setFormData({ ...formData, rating: star })}
          /></div>
        </div>
        <div>
          <label htmlFor="comment-input"><img src={bookIcon} alt="Comment" /></label>
          <textarea
            id="comment"
            placeholder="Enter Comment"
            value={formData.comment}  onChange={handleChange}
            rows={4} // Optional: controls height
            cols={34} // Optional: controls width
        />
        </div>
      
      <button type="submit">Submit</button>
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

export default Rating;
