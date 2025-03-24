import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import "../styles/style2.css"; 
import "../styles/style.css"; 
import { Link } from "react-router-dom";
import searchIcon from "../assets/search.svg";
import bookIcon from "../assets/book.svg";
import personIcon from "../assets/person.svg";
import { API_URL } from "../config";

const Search = () => {

  const location = useLocation();
  const navigate = useNavigate();
  const { accData } = location.state || {}; 
  const [searchType, setSearchType] = useState(""); // Selected search type
  const [courses, setCourses] = useState([]); // Stores course list from API
  const [selectedCourse, setSelectedCourse] = useState(""); // Selected course
  const [searchQuery, setSearchQuery] = useState(""); // First or Last Name
  const [results, setResults] = useState([]); // Stores search results
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch course list from API when component loads
  useEffect(() => {
    fetch(`${API_URL}/courses`)
      .then((res) => res.json())
      .then((data) => setCourses(data))
      .catch((err) => console.error("Error fetching courses:", err));
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResults([]);

    let queryParam = "";
    console.log("searchType", searchType);
    if (searchType === "Course") {
      console.log("selectedCourse", selectedCourse);
      queryParam = `courseId=${selectedCourse}`;
    } else if (searchType === "First Name") {
      queryParam = `firstName=${searchQuery}`;
    } else if (searchType === "Last Name") {
      queryParam = `lastName=${searchQuery}`;
    }

    try {
      const response = await fetch(`${API_URL}/searchtutors?${queryParam}`);
      if (!response.ok) throw new Error("Failed to fetch tutors");
      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
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
            <a href="/tutorsearch" class="nav-link current" onclick="return false;">Tutor Search</a>
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
      <h1>Search for Tutors</h1>
      <form onSubmit={handleSubmit}>

      {/* Dropdown to Select Search Type */}
      <div>
      <label htmlFor="searchby-input"><img src={searchIcon} alt="Search By" /></label>
      <select value={searchType} onChange={(e) => setSearchType(e.target.value)}>
        <option value="">Select an option</option>
        <option value="Course">Course</option>
        <option value="First Name">First Name</option>
        <option value="Last Name">Last Name</option>
      </select>
      </div>

      {/* Conditional Input Based on Selection */}
      {searchType === "Course" && (
        <div>
          <label htmlFor="course-input"><img src={bookIcon} alt="Course" /></label>
          <select id="course-input" value={selectedCourse} onChange={(e) => {
                            setSelectedCourse(e.target.value);
                            console.log("Selected Course:", e.target.value); // Debugging
                        }}>
            <option value="">Select a course</option>
            {courses.map((course) => (
              <option key={course.courseId} value={course.courseId}>
                {course.courseName}
              </option>
            ))}
          </select>
        </div>
      )}

      {(searchType === "First Name" || searchType === "Last Name") && (
        <div>
          <label htmlFor="name-input"><img src={personIcon} alt="Name" /></label>
          <input
            id="name"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Enter ${searchType}`}
          />
        </div>
      )}
      <button type="submit">Submit</button>
      </form>

    
      {/* Display Search Results */}
      <div className="card">
            <h3>Results</h3>
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
            {results && results.length > 0 ? (
              results.map((tutor, index) => (
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
                  No tutors found for your search criteria.
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

export default Search;
