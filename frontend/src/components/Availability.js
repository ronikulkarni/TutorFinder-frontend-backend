import React from "react";
import { useEffect } from "react";
import "../styles/style2.css"; 
import { Link } from "react-router-dom";
import { useLocation } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import calendarIcon from "../assets/calendar.svg";
import timeIcon from "../assets/time.svg";
import { ReactComponent as TrashIcon } from "../assets/trash.svg";
import { API_URL } from "../config";

const Availability = () => {
  const location = useLocation();
  const { accData, availabilityData} = location.state || {}; 

  useEffect(() => {
    console.log("Received data in Availability:", location.state);
  }, [location.state]);

  console.log("accData", accData);
  console.log(availabilityData);
  //console.log(sessionsData);

  const navigate = useNavigate();
  const [formData, setFormData] = useState({ dayOfWeek: "", startTime: "", endTime: "" });
  const [errors, setErrors] = useState([]);
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const validateForm = () => {
    let newErrors = [];
    if (!formData.dayOfWeek.trim()) newErrors.push("Day of week is required");
    if (!formData.startTime.trim()) newErrors.push("Start time is required");
    if (!formData.endTime.trim()) newErrors.push("End time is required");
    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit =async (e) => {
    e.preventDefault();
    setErrors([]); // Clear previous errors

    if (validateForm()) {
      console.log("Availability Submitted", formData);
    } else
      return;

    let aErrors = [];
    try {
        
        //get list of availability
        const availabilitydata = {
            tutorId: accData.accountId,
            dayOfWeek: formData.dayOfWeek,
            startTime: formData.startTime,
            endTime: formData.endTime,
            
        }
        console.log("stringify 3:", JSON.stringify(availabilitydata))
        const availabilityresp = await fetch (`${API_URL}/addAvailability`,
        {
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(availabilitydata)
        }
        );
        let availabilityjson = null;
        if (availabilityresp.ok) { // ✅ Check if the response is successful
            const text = await availabilityresp.text(); // Read response as text
            availabilityjson = text ? JSON.parse(text) : null; // ✅ Convert only if not empty
            console.log(availabilityjson);
        }
        //console.log(availabilityjson);
        navigate("/availability", { state: {accData, availabilityData: availabilityjson} });
    }catch (ex){
        aErrors.push("An error occurred");
        aErrors.push("Please try again later.");      
        setErrors(aErrors);
        return ;
    }     
  };

  const handleDelete = async (availabilityId, tutorId) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this item?");
    
    if (!isConfirmed) return; // Stop if user cancels

    try {
        const availabilityresp = await fetch(`${API_URL}/deleteAvailability/${availabilityId}/${tutorId}`, {
            method: "DELETE",
        });

        if (!availabilityresp.ok) throw new Error("Failed to delete");
        else{
            alert("Item deleted successfully!");
            let availabilityjson = null;
            const text = await availabilityresp.text(); // Read response as text
            availabilityjson = text ? JSON.parse(text) : null; // ✅ Convert only if not empty
            console.log(availabilityjson);
            navigate("/availability", { state: {accData, availabilityData: availabilityjson} });

        }
       
    } catch (error) {
        console.error("Delete Error:", error);
        alert("Failed to delete the item.");
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
           <Link to="/tutordashboard" state={{ accData }}>Dashboard</Link>
        </li>
        <li>
            <Link to="/calendar" state={{ accData }}>Calendar</Link>
          </li>
        <li className="active">
           <a href="/availability" class="nav-link current" onclick="return false;">My Availability</a>
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
          <h1>Please update your availability.</h1>
            <form onSubmit={handleSubmit}>
            <div>
            <label htmlFor="dayofweek-input"><img src={calendarIcon} alt="Day" /></label>
            <input type="text" id="dayOfWeek" placeholder="Enter day of week" value={formData.password} onChange={handleChange} />
            </div>
            <div>
            <label htmlFor="starttime-input"><img src={timeIcon} alt="Start" /></label>
            <input type="text" id="startTime" placeholder="Enter start time (24 hour format)" value={formData.password} onChange={handleChange} />
            </div>
            <div>
            <label htmlFor="dayofweek-input"><img src={timeIcon} alt="End" /></label>
            <input type="text" id="endTime" placeholder="Enter end time (24 hour format)" value={formData.password} onChange={handleChange} />
            </div>
            <button type="submit">Submit</button>
            </form>
          <div className="card">
            <h3>Your availability</h3>
            <table>
              <thead>
                <tr>
                  <th>Day of the Week</th>
                  <th>Start Time</th>
                  <th>End Time</th>
                  <th></th>
                </tr>
              </thead>
              
            <tbody>
            {availabilityData && availabilityData.length > 0 ? (
              availabilityData.map((availability, index) => (
                <tr key={availability.availabilityId}>
                  <td>{availability.dayOfWeek}</td>
                  <td>{availability.startTime}</td>
                  <td>{availability.endTime}</td>
                  <td>
                  <button onClick={() => handleDelete(availability.availabilityId, availability.tutorId)} 
                style={{ background: "none", border: "none", cursor: "pointer" }}
                 >
                <TrashIcon width={24} height={24} fill="red" />
                </button>
                </td>

                  
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: "center", fontStyle: "italic" }}>
                  Availability not provided. 
                </td>
              </tr>
            )}
          </tbody>


            </table>
          </div>


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

export default Availability;
