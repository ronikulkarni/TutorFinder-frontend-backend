import React, { createContext, useEffect, useContext, useState } from "react";
import "../styles/style2.css"; 
import { Link } from "react-router-dom";
import { useLocation, useNavigate } from 'react-router-dom';
import { ReactComponent as TrashIcon } from "../assets/trash.svg";
import { API_URL } from "../config";

const DataContext = createContext();

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { accData } = location.state || {}; 
  console.log(accData);
  const [sessionsData, setData1] = useState(null);
  const [availabilityData, setData2] = useState(null);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
useEffect(() => {
    const fetchData = async () => {
    try {
      //Get the upcoming tutoring sessions for both students and tutors
      const accountdata = {
        accountId:accData.accountId,
        accountType:accData.accountType
      }
      console.log("stringify 2:", JSON.stringify(accountdata))
      const sessionsresp = await fetch (`${API_URL}/sessions`,
        {
          method:"POST",
          headers:{
            "Content-Type":"application/json"
          },
          body:JSON.stringify(accountdata)
        }
      );

      let sessionsjson = null;
      if (sessionsresp.ok) { // ✅ Check if the response is successful
        const text = await sessionsresp.text(); // Read response as text
        sessionsjson = text ? JSON.parse(text) : null; // ✅ Convert only if not empty
        console.log(sessionsjson);
        setData1(sessionsjson);
      }
      
      //get list of availability
      const availabilitydata = {
        accountId:accData.accountId
      }
      console.log("stringify 3:", JSON.stringify(availabilitydata))
      const availabilityresp = await fetch (`${API_URL}/tutorAvailabilities`,
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
        setData2(availabilityjson);
      } 
      
  }catch (ex){
    return ;
  }};

  fetchData();
}, []);



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
           <a href="/tutordashboard" class="nav-link current" onclick="return false;">Dashboard</a>
        </li>
        <li>
            <Link to="/calendar" state={{ accData }}>Calendar</Link>
          </li>
        <li className="active">
           <Link to="/availability" state={{ accData, availabilityData }}>My Availability</Link>
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
            {accData.accountType}
            <img src="/assets/profile.jpg" alt="Profile" className="avatar" />
          </div>
        </nav>

        
        <section className="content">
          <h1>{location.state.accData?.firstName || "Guest"}, welcome to Your Dashboard</h1>
          <p>Manage your tutoring sessions, schedule, and more.</p>

          <div className="stats-grid">

            <div className="stat-card">
             
              {sessionsData && sessionsData.length > 0 ? (
                 <h4>{sessionsData.length} Upcoming session(s)</h4>
              ) : (
                <h4>No Upcoming Sessions.</h4>
              ) }

             </div>
          </div>

          <div className="card">
            <h3>Upcoming Sessions</h3>
            <table>
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Tutor</th>
                  <th>Course</th>
                  <th>Date</th>
                  <th>Start Time</th>
                  <th>End Time</th>
                  <th></th>
                </tr>
              </thead>
              
            <tbody>
            {sessionsData && sessionsData.length > 0 ? (
              sessionsData.map((session, index) => (
                <tr key={session.id}>
                  <td>{session.studentName}</td>
                  <td>{session.tutorName}</td>
                  <td>{session.courseName}</td>
                  <td>{session.sessionDate}</td>
                  <td>{session.startTime}</td>
                  <td>{session.endTime}</td>
                  <td>
                  <TrashIcon width={24} height={24} fill="red" />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: "center", fontStyle: "italic" }}>
                No upcoming sessions.
                </td>
              </tr>
            )}
          </tbody>


            </table>
          </div>



          <div className="card">
            <h3>Your availability</h3>
            <table>
              <thead>
                <tr>
                  <th>Day of the Week</th>
                  <th>Start Time</th>
                  <th>End Time</th>
  
                </tr>
              </thead>
              
            <tbody>

            <tr>
                <td colSpan="5" style={{ textAlign: "center", fontStyle: "italic" }}>
                <Link 
                 to={`/availability`}
                 state={{ accData, availabilityData }} // Ensure state is passed here
                 style={{ textDecoration: "none", color: "yellow", cursor: "pointer" }}
                >
                Enter or update your availability.
                </Link>
                </td>
            </tr>

            {availabilityData && availabilityData.length > 0 ? (
              availabilityData.map((availability, index) => (
                <tr key={availability.availabilityId}>
                  <td>{availability.dayOfWeek}</td>
                  <td>{availability.startTime}</td>
                  <td>{availability.endTime}</td>
                </tr>
                
                
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: "center", fontStyle: "italic" }}>
                  You must enter your availability for students to schedule sessions.
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

export default Dashboard;
