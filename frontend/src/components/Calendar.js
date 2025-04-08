import React, { useState, useEffect } from "react";
import { Select, DatePicker, TimePicker, Button, Card, message } from "antd";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { useLocation, useNavigate } from 'react-router-dom';
import { API_URL } from "../config";
import "../styles/style2.css";
import personIcon from "../assets/person.svg";
import bookIcon from "../assets/book.svg";
import calendarIcon from "../assets/calendar.svg";
import timeIcon from "../assets/time.svg";
import { Link } from "react-router-dom";
import { Modal } from "antd";

dayjs.extend(utc);
dayjs.extend(timezone);

// Define EST explicitly
const TIMEZONE = "America/New_York";

const { Option } = Select;

const Calendar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const accData = location.state?.accData; // ✅ Extract accData safely
  console.log(accData);
  const [availability, setAvailability] = useState([]);
  const [scheduledSessions, setScheduledSessions] = useState([]);
  
  useEffect(() => {
    setAvailability([]);
    setScheduledSessions([]);

    if (accData?.accountType === "tutor") {
      fetch(`${API_URL}/tutorAvailabilities`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accountId: accData.accountId }),
      })
        .then((res) => res.json())
        .then((data) => setAvailability(data))
        .catch(() => message.error("Failed to load availability"));
    }

    fetch(`${API_URL}/sessions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ accountId: accData.accountId, accountType: accData.accountType }),
    })
      .then((res) => res.json())
      .then((data) => setScheduledSessions(data))
      .catch(() => message.error("Failed to load scheduled sessions"));

  }, []);

  
  const dayOfWeekMap = {
    Sunday: 0,
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6,
  };

  const handleSlotClick = (info) => {
    const TIMEZONE = "America/New_York";
  
    const start = dayjs(info.event.start).tz(TIMEZONE);
    const end = dayjs(info.event.end).tz(TIMEZONE);
    const title = info.event.title;
  
      // ✅ Show read-only popup
      Modal.info({
        title: `${title} Session`,
        content: (
          <div>
            <p><strong>Start:</strong> {start.format("YYYY-MM-DD hh:mm A")}</p>
            <p><strong>End:</strong> {end.format("YYYY-MM-DD hh:mm A")}</p>
          </div>
        ),
        okText: "Close", // Only one button
      });
      return; // ⛔ Don't allow scheduling on these
  };
  


const sessionEvents = scheduledSessions.map((session) => ({
    title: "Booked",
    start: `${session.sessionDate}T${session.startTime}`,
    end: `${session.sessionDate}T${session.endTime}`,
    color: "red",
}));


const availabilityEvents = availability.flatMap((slot) => {
    return Array.from({ length: 14 }, (_, i) => { // ✅ Loop over the next 14 days
        const availableDate = dayjs().add(i, "day").tz("America/New_York");

        // ✅ Check if the day matches the tutor's available day (Monday, Tuesday, etc.)
        if (availableDate.day() !== dayOfWeekMap[slot.dayOfWeek]) {
            return []; // Skip if it's not a matching day
        }

        const slotStart = dayjs(`${availableDate.format("YYYY-MM-DD")}T${slot.startTime}`).tz("America/New_York");
        const slotEnd = dayjs(`${availableDate.format("YYYY-MM-DD")}T${slot.endTime}`).tz("America/New_York");

        // ✅ Get  booked sessions on this specific day
        const bookedTimes = scheduledSessions
            .filter(session => session.sessionDate === availableDate.format("YYYY-MM-DD"))
            .map(session => ({
                start: dayjs(`${session.sessionDate}T${session.startTime}`).tz("America/New_York"),
                end: dayjs(`${session.sessionDate}T${session.endTime}`).tz("America/New_York")
            }))
            .sort((a, b) => a.start - b.start); // ✅ Sort booked slots in order


        let availableSlots = [];
        let currentStart = slotStart;

        // ✅ Generate 30-minute time slots within the availability window
        while (currentStart.isBefore(slotEnd)) {
            let nextSlot = currentStart.add(30, "minute");

            // ✅ Skip this slot if it overlaps with a booked session
            const isSlotBooked = bookedTimes.some(booked => 
                currentStart.isBefore(booked.end) && nextSlot.isAfter(booked.start)
            );

            
            if (!isSlotBooked) {
                availableSlots.push({
                    title: "Available Slot",
                    start: currentStart.format(),
                    end: nextSlot.format(),
                    color: "green",
                    extendedProps: {
                        sessionDate: availableDate.format("YYYY-MM-DD"),
                        startTime: currentStart.format("HH:mm:ss"),
                        endTime: nextSlot.format("HH:mm:ss"),
                    },
                });
            }

            // ✅ Move to the next 30-minute interval
            currentStart = nextSlot;
        }

        return availableSlots;
    }).flat(); // ✅ Flatten the results into a single array
});


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
        <li className="active">
            <a href="/calendar" class="nav-link current" onclick="return false;">Calendar</a>
        </li>
        <li>
          {accData?.accountType === "student" ? (
            <Link to="/tutorsearch" state={{ accData }}>Tutor Search</Link>
          ) : (
            <Link to="/availability" state={{ accData, availabilityData: availability}}>My availability</Link>
          )}
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
    
      <form style={{ width: "100%", margin: "0 auto" }}>
      
      
      <div style={{ width: "100%", margin: "0 auto" }}>
      <Card style={{ width: "100%" }}>
          <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        events={[
            ...availabilityEvents, // ✅ Available slots
            ...scheduledSessions.map(session => ({ // ✅ Booked sessions
                title: "Booked",
                start: `${session.sessionDate}T${session.startTime}`,
                end: `${session.sessionDate}T${session.endTime}`,
                color: "red",
            })), 
        ]}
        validRange={{
            start: dayjs().format("YYYY-MM-DD"), // ✅ Starts today
            end: dayjs().add(14, "day").format("YYYY-MM-DD"), // ✅ Ends in 14 days
        }}
        eventClick={handleSlotClick} // ✅ Ensure this function is used correctly
        height="800px"
      
      />

        </Card></div>
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

export default Calendar;
