import React, { useEffect, useState }  from "react";
import "../styles/style2.css"; 
import { Link } from "react-router-dom";
import { useLocation } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import { ReactComponent as TrashIcon } from "../assets/trash.svg";
import { API_URL } from "../config";
import StarRating from "./StarRating";


const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { accData } = location.state || {}; 
  console.log(accData);
  const [sessionsData, setData1] = useState(null);
  const scheduledSessions = sessionsData?.filter(session => session.status === "Scheduled") || [];
  const completedSessions = sessionsData?.filter(session => session.status === "Completed") || [];
  const [tutorsData, setData2] = useState(null);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

const [showModal, setShowModal] = useState(false);
const [selectedSession, setSelectedSession] = useState(null);

const [reviewsModalOpen, setReviewsModalOpen] = useState(false);
const [selectedTutorReviews, setSelectedTutorReviews] = useState([]);
const [selectedTutorName, setSelectedTutorName] = useState("");

  
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
        if (sessionsresp.ok) { // 
          const text = await sessionsresp.text(); // Read response as text
          sessionsjson = text ? JSON.parse(text) : null; //
          console.log(sessionsjson);
          // Dynamically update statuses based on current time
          const now = new Date();
          const updatedSessions = sessionsjson.map(session => {
            const start = new Date(`${session.sessionDate}T${session.startTime}`);
            const end = new Date(`${session.sessionDate}T${session.endTime}`);
            let status = session.status;

            if (status === "Scheduled") {
              if (now > end) {
                status = "Completed";
              } else if (now >= start && now <= end) {
                status = "In Progress";
              }
            }

            return { ...session, status };
          });

          setData1(updatedSessions);

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

const handleShowDetails = (session) => {
  setSelectedSession(session);
  setShowModal(true);
};

const handleCloseModal = () => {
  setShowModal(false);
  setSelectedSession(null);
};

const fetchTutorReviews = async (tutorId, tutorName) => {
  try {
    const response = await fetch(`${API_URL}/tutorreviews/${tutorId}`);
    if (!response.ok) throw new Error("Failed to fetch reviews");

    const reviews = await response.json();
    setSelectedTutorReviews(reviews);
    setSelectedTutorName(tutorName);
    setReviewsModalOpen(true);
  } catch (error) {
    console.error("Error fetching tutor reviews:", error);
    alert("Unable to load reviews for this tutor.");
  }
};

const closeReviewsModal = () => {
  setReviewsModalOpen(false);
  setSelectedTutorReviews([]);
  setSelectedTutorName("");
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
            <Link to="/messages" state={{ accData }}>View Messages</Link>   
          </li>
          <li>
            <Link to="/calendar" state={{ accData }}>Check Calendar</Link>
          </li>
          <li>
            <Link to="/tutorsearch" state={{ accData }}>Tutor Search</Link>
          </li>
          <li>
            <Link to="/profile" state={{ accData }}>Manage Profile</Link>
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
          <h1>{location.state.accData?.firstName || "Guest"}, welcome to Your Dashboard</h1>
          <p>Manage your tutoring sessions, schedule, and more.</p>


          <div className="card">
          {scheduledSessions && scheduledSessions.length > 0 ? (
                 <h3>{scheduledSessions.length} Upcoming session(s)</h3>
              ) : (
                <h3>No Upcoming Sessions.</h3>
              ) }
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
                  <th>Details</th>
                  <th></th>
  
                </tr>
              </thead>
              
            <tbody>
            {scheduledSessions && scheduledSessions.length > 0 ? (
              scheduledSessions.map((session, index) => (
                <tr key={session.sessionId}>
                  <td>{session.sessionId}</td>
                  <td>{session.studentName}</td>
                  <td>{session.tutorName}</td>
                  <td>{session.courseName}</td>
                  <td>{session.sessionDate}</td>
                  <td>{session.startTime}</td>
                  <td>{session.endTime}</td>
                  <td>
                    <button
                      onClick={() => handleShowDetails(session)}
                      style={{ background: "none", border: "none", cursor: "pointer", color: "#007bff", textDecoration: "underline", marginLeft: "10px" }}
                    >
                      Details
                    </button>
                  </td>
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
            <h3>Completed Sessions</h3>
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
                  <th>Rating</th>
                  <th></th>
  
                </tr>
              </thead>
              
            <tbody>
            {completedSessions && completedSessions.length > 0 ? (
              completedSessions.map((session, index) => (
                <tr key={session.sessionId}>
                  <td>{session.sessionId}</td>
                  <td>{session.studentName}</td>
                  <td>{session.tutorName}</td>
                  <td>{session.courseName}</td>
                  <td>{session.sessionDate}</td>
                  <td>{session.startTime}</td>
                  <td>{session.endTime}</td>
                  <td>
                     <Link
                      to={{
                        pathname: `/rating/${session.tutorId}/${session.studentId}/${session.tutorName}`,
                      }}
                      state={{ accData }}
                      style={{ textDecoration: "none", color: "#007bff" }}
                    >
                    Rate Tutor
                    </Link>
                  </td>
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
                  <th>Tutoring for</th>
                  <th>Rating</th>
                </tr>
              </thead>
              
            <tbody>
            {tutorsData && tutorsData.length > 0 ? (
              tutorsData.map((tutor, index) => (
                <tr key={tutor.accountId}>
                  <td>{tutor.firstName} {tutor.lastName}</td>
                  <td>{tutor.emailId}</td>
                  <td>{tutor.phoneNumber}</td>
                  <td>{tutor.courseNames}</td>
                  <td>
                    {tutor.tutorRating > 0 ? (
                      <>
                        {"⭐".repeat(tutor.tutorRating)} &nbsp;&nbsp;&nbsp;
                        <button
                          onClick={() => fetchTutorReviews(tutor.accountId, `${tutor.firstName} ${tutor.lastName}`)}
                          style={{
                            border: "none",
                            background: "none",
                            color: "#007bff",
                            textDecoration: "underline",
                            cursor: "pointer",
                            marginTop: "5px",
                          }}
                        >
                          View Reviews
                        </button>
                      </>
                    ) : (
                      "No Rating"
                    )}
                  </td>               
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


        {showModal && selectedSession && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Session Details</h2>
            <div className="modal-content">
              <div className="detail-row"><span>Session ID:</span> {selectedSession.sessionId}</div>
              <div className="detail-row"><span>Student:</span> {selectedSession.studentName}</div>
              <div className="detail-row"><span>Tutor:</span> {selectedSession.tutorName}</div>
              <div className="detail-row"><span>Course:</span> {selectedSession.courseName}</div>
              <div className="detail-row"><span>Date:</span> {selectedSession.sessionDate}</div>
              <div className="detail-row"><span>Start Time:</span> {selectedSession.startTime}</div>
              <div className="detail-row"><span>End Time:</span> {selectedSession.endTime}</div>
              {selectedSession.zoomLink && (
                <div className="detail-row"><span>Zoom Link:</span> 
                  <a href={selectedSession.zoomLink} target="_blank" rel="noopener noreferrer">{selectedSession.zoomLink}</a>
                </div>
              )}
              {selectedSession.notes && (
                <div className="detail-row"><span>Notes:</span> {selectedSession.notes}</div>
              )}
            </div>
            <div className="modal-actions">
              <button className="modal-close" onClick={handleCloseModal}>Close</button>
            </div>
          </div>
        </div>
      )}

      {reviewsModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Reviews for {selectedTutorName}</h2>
            {selectedTutorReviews.length > 0 ? (
              <div className="modal-content">
                {selectedTutorReviews.map((review, index) => (
                  <div key={index} className="review-box">
                    <p><strong>Rating:</strong> {"⭐".repeat(review.rating)}</p>
                    <p><strong>Comment:</strong> {review.comment || "No comment provided."}</p>
                    <p><strong>Student:</strong> {review.studentName}</p>
                    <p><strong>Date:</strong> {review.createdAt}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p>No reviews available for this tutor.</p>
            )}
            <div className="modal-actions">
              <button className="modal-close" onClick={closeReviewsModal}>Close</button>
            </div>
          </div>
        </div>
      )}
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
