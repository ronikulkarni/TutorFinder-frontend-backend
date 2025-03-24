import React, { useEffect, useState }  from "react";
import "../styles/style2.css"; 
import { Link } from "react-router-dom";
import { useLocation } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import { ReactComponent as TrashIcon } from "../assets/trash.svg";
import { API_URL } from "../config";

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { accData } = location.state || {}; 
  console.log(accData);
  const [sessionsData, setData1] = useState(null);
  const [tutorsData, setData2] = useState(null);
  
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
      
      //get list of tutors
      const coursedata = {
        course:accData.course
      }
      console.log("stringify 3:", JSON.stringify(coursedata))
      const tutorsresp = await fetch (`${API_URL}/tutorsforcourse`,
      {
          method:"POST",
          headers:{
             "Content-Type":"application/json"
          },
         body:JSON.stringify(coursedata)
      });

      let tutorsjson = null;
      if (tutorsresp.ok) { // ✅ Check if the response is successful
        const text = await tutorsresp.text(); // Read response as text
        tutorsjson = text ? JSON.parse(text) : null; // ✅ Convert only if not empty
        console.log(tutorsjson);
        setData2(tutorsjson);
      }
      
  }catch (ex){
    return ;
  }};
  fetchData();
}, []);

const handleDelete = async (sessionId, studentId) => {
  const isConfirmed = window.confirm("Are you sure you want to delete this item?");
  
  if (!isConfirmed) return; // Stop if user cancels

  try {
      const response = await fetch(`${API_URL}/deleteSession/${sessionId}/${studentId}`, {
          method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete");
      else{
          navigate("/studentdashboard", { state: {accData } });
          window.location.reload();
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
            <a href="/studentdashboard" class="nav-link current" onclick="return false;">Dashboard</a>
          </li>
          <li>
            <Link to="/schedulesession" state={{ accData }}>Schedule Session</Link>
               
          </li>
          <li>
            <Link to="/calendar" state={{ accData }}>Calendar</Link>
          </li>
          <li>
            <Link to="/tutorsearch" state={{ accData }}>Tutor Search</Link>
          </li>
          <li>
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

              <p>Upcoming Sessions</p>
            </div>
          </div>

          <div className="card">
            <h3>Upcoming Sessions</h3>
            <table>
              <thead>
                <tr>
                  <th>Id</th>
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
                <tr key={session.sessionId}>
                  <td>{session.sessionId}</td>
                  <td>{session.studentName}</td>
                  <td>{session.tutorName}</td>
                  <td>{session.courseName}</td>
                  <td>{session.sessionDate}</td>
                  <td>{session.startTime}</td>
                  <td>{session.endTime}</td>
                  <td>
                  <button onClick={() => handleDelete(session.sessionId, session.studentId)} 
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
                  No upcoming sessions. Please schedule sessions with  recommended tutors below or by searching for tutors.
                </td>
              </tr>
            )}
          </tbody>


            </table>
          </div>


       

          <div className="card">
            <h3>Recommended Tutors</h3>
            <table>
              <thead>
                <tr>
                  <th>Tutor</th>
                  <th>Email ID</th>
                  <th>Phone Number</th>
                  <th>Rating</th>
                </tr>
              </thead>
              
            <tbody>
            {tutorsData && tutorsData.length > 0 ? (
              tutorsData.map((tutor, index) => (
                <tr key={tutor.id}>
                  <td>{tutor.firstName} {tutor.lastName}</td>
                  <td>{tutor.emailId}</td>
                  <td>{tutor.phoneNumber}</td>
                  <td>{tutor.rating || "N/A"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: "center", fontStyle: "italic" }}>
                  No recommended tutors available for the courses you selected.
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
