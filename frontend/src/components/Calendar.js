import React, { useState } from 'react';
import '../styles/style2.css';
import { Link } from 'react-router-dom';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { API_URL } from "../config";

const Calendar = () => {
  const [events, setEvents] = useState([
    { title: 'Math Tutoring', date: '2025-03-15' },
    { title: 'English Session', date: '2025-03-18' }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: '', date: '', time: '' });

  const handleDateClick = (info) => {
    setNewEvent({ ...newEvent, date: info.dateStr });
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    setNewEvent({ ...newEvent, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newEvent.title && newEvent.date) {
      setEvents([...events, { title: `${newEvent.title} (${newEvent.time})`, date: newEvent.date }]);
      setShowModal(false);
      setNewEvent({ title: '', date: '', time: '' });
    }
  };

  return (
    <div className="dashboard-wrapper">
      <aside id="sidebar">
        <ul>
          <li className="logo">
            <span>TutorFinder</span>
            <button onClick={toggleSidebar} id="toggle-btn">
              <i className="fa-solid fa-bars"></i>
            </button>
          </li>
          <li><Link to="/studentdashboard">Dashboard</Link></li>
          <li><Link to="/profile">Profile</Link></li>
          <li><Link to="/calendar">Calendar</Link></li>
          <li><Link to="/messages">Messages</Link></li>
          <li><Link to="/tutorsearch">Tutor Search</Link></li>
          <li><Link to="/settings">Settings</Link></li>
        </ul>
      </aside>

      <main className="dashboard-main">
        <nav className="navbar">
          <button className="theme-toggle" onClick={toggleTheme}>
            <i className="fa-regular fa-moon"></i>
            <i className="fa-regular fa-sun"></i>
          </button>
        </nav>

        <section className="content">
          <h1>Calendar</h1>
          <h2>Click on a Date to Schedule a Tutoring Session</h2>

          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            events={events}
            dateClick={handleDateClick} // Enables clicking on a date to schedule a session
          />
        </section>
      </main>

      {/* Session Scheduling Modal */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Schedule a Tutoring Session</h2>
            <form onSubmit={handleSubmit}>
              <label>Session Title:</label>
              <input type="text" name="title" value={newEvent.title} onChange={handleInputChange} required />

              <label>Time:</label>
              <input type="time" name="time" value={newEvent.time} onChange={handleInputChange} required />

              <p><strong>Date:</strong> {newEvent.date}</p>

              <button type="submit">Add Session</button>
              <button type="button" onClick={() => setShowModal(false)}>Cancel</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// Sidebar & Theme Toggles
const toggleSidebar = () => {
  document.getElementById('sidebar').classList.toggle('collapsed');
};

const toggleTheme = () => {
  document.querySelector('.dashboard-wrapper').classList.toggle('dark-theme');
};

export default Calendar;
