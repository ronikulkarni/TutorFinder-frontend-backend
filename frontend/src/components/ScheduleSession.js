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
import "../styles/style.css";
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

const ScheduleSession = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const accData = location.state?.accData; // ✅ Extract accData safely
  console.log(accData);
  const [courses, setCourses] = useState([]);
  const [tutors, setTutors] = useState([]);
  const [availability, setAvailability] = useState([]);
  const [scheduledSessions, setScheduledSessions] = useState([]);
  const [scheduledStudentSessions, setScheduledStudentSessions] = useState([]);

  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedTutor, setSelectedTutor] = useState(null);
  const [sessionDate, setSessionDate] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/courses`)
      .then((res) => res.json())
      .then((data) => setCourses(data))
      .catch(() => message.error("Failed to load courses"));
  }, []);

  const fetchTutors = (courseId) => {
    setSelectedCourse(courseId);
    setTutors([]);
    setAvailability([]);
    setScheduledSessions([]);
    setScheduledStudentSessions([]);

    fetch(`${API_URL}/tutorsforcourse`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ course: courseId }),
    })
      .then((res) => res.json())
      .then((data) => setTutors(data))
      .catch(() => message.error("Failed to load tutors"));
  };

  const fetchTutorDetails = (tutorId) => {
    setSelectedTutor(tutorId);
    setAvailability([]);
    setScheduledSessions([]);

    fetch(`${API_URL}/tutorAvailabilities`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ accountId: tutorId }),
    })
      .then((res) => res.json())
      .then((data) => setAvailability(data))
      .catch(() => message.error("Failed to load availability"));

    fetch(`${API_URL}/sessions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ accountId: tutorId, accountType: 'tutor' }),
    })
      .then((res) => res.json())
      .then((data) => setScheduledSessions(data))
      .catch(() => message.error("Failed to load scheduled sessions"));

      fetch(`${API_URL}/sessions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accountId: accData.accountId, accountType: 'student' }),
      })
        .then((res) => res.json())
        .then((data) => setScheduledStudentSessions(data))
        .catch(() => message.error("Failed to load scheduled student sessions"));
  };

  const handleScheduleSession = (selectedStart, selectedEnd) => {
    if (!selectedCourse || !selectedTutor || !selectedStart || !selectedEnd) {
        message.warning("Please fill all fields before scheduling");
        return;
    }

    const TIMEZONE = "America/New_York";

    // ✅ Convert selected times to EST explicitly before extracting the date
    let sessionDateEST = selectedStart.tz(TIMEZONE, true).format("YYYY-MM-DD");
    let startTimeEST = selectedStart.tz(TIMEZONE, true).format("HH:mm:ss");
    let endTimeEST = selectedEnd.tz(TIMEZONE, true).format("HH:mm:ss");

    console.log("Session Date (EST):", sessionDateEST);
    console.log("Start Time (EST):", startTimeEST);
    console.log("End Time (EST):", endTimeEST);

    const newSession = {
        tutorId: selectedTutor,
        studentId: accData.accountId,
        courseId: selectedCourse,
        sessionDate: sessionDateEST, // ✅ Corrected Date
        startTime: startTimeEST, // ✅ Corrected Start Time
        endTime: endTimeEST, // ✅ Corrected End Time
    };
    console.log(newSession);
    fetch(`${API_URL}/addSession`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSession),
    })
    .then((res) => res.json())
    .then(() => {
        message.success("Session scheduled successfully!");
        setScheduledSessions(prev => [...prev, newSession]);
    })
    .catch(() => message.error("Failed to schedule session"));
};

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
  
    if (title === "Tutor Booked" || title === "Student Booked") {
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
    }
  
   // ✅ For available slot – show confirm modal and set values on OK
    Modal.confirm({
      title: "Confirm Session Slot",
      content: (
        <div>
          <p><strong>Start:</strong> {start.format("YYYY-MM-DD hh:mm A")}</p>
          <p><strong>End:</strong> {end.format("YYYY-MM-DD hh:mm A")}</p>
        </div>
      ),
      okText: "OK",
      cancelText: "Cancel",
      onOk: () => {
        setSessionDate(start);
        setStartTime(start);
        setEndTime(end);
      },
    });
  };
  


const sessionEvents = scheduledSessions.map((session) => ({
    title: "Tutor Booked",
    start: `${session.sessionDate}T${session.startTime}`,
    end: `${session.sessionDate}T${session.endTime}`,
    color: "red",
}));

const studentSessionEvents = scheduledStudentSessions.map((session) => ({
  title: "Student Booked",
  start: `${session.sessionDate}T${session.startTime}`,
  end: `${session.sessionDate}T${session.endTime}`,
  color: "orange",
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

        // ✅ Get tutor booked sessions on this specific day
        const bookedTimes = scheduledSessions
            .filter(session => session.sessionDate === availableDate.format("YYYY-MM-DD"))
            .map(session => ({
                start: dayjs(`${session.sessionDate}T${session.startTime}`).tz("America/New_York"),
                end: dayjs(`${session.sessionDate}T${session.endTime}`).tz("America/New_York")
            }))
            .sort((a, b) => a.start - b.start); // ✅ Sort booked slots in order


         // ✅ Get student booked sessions on this specific day
         const studentBookedTimes = scheduledStudentSessions
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

            // ✅ Skip this slot if it overlaps with a booked session
            const isSlotBookedByStudent = studentBookedTimes.some(booked => 
              currentStart.isBefore(booked.end) && nextSlot.isAfter(booked.start)
            );
            if (!isSlotBooked && !isSlotBookedByStudent ) {
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
          <Link to="/studentdashboard" state={{ accData }}>Dashboard</Link>
        </li>
        <li className="active">
            <a href="/schedulesession" class="nav-link current" onclick="return false;">Schedule Session</a>
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
      <h1>Schedule a session</h1>
      <br></br>
      <form style={{ width: "100%", margin: "0 auto" }}>
      <div  style={{ width: "50%"}}>
      <label htmlFor="course-input"><img src={bookIcon} alt="Course" /></label>
      <Select
        placeholder="Select a course"
        style={{ width: "100%", marginBottom: "10px" }}
        onChange={fetchTutors}
      >
        {courses.map((course) => (
          <Option key={course.courseId} value={course.courseId}>{course.courseName}</Option>
        ))}
      </Select>
      </div>

      {tutors.length > 0 && (
        <>
          <div style={{ width: "50%"}}> 
          <label htmlFor="tutor-input"><img src={personIcon} alt="Tutor" /></label>
          <Select
            placeholder="Select a tutor"
            style={{ width: "100%", marginBottom: "10px" }}
            onChange={fetchTutorDetails}
          >
            {tutors.map((tutor) => (
              <Option key={tutor.accountId} value={tutor.accountId}>{tutor.firstName} {tutor.lastName}</Option>
            ))}
          </Select>
          </div>
        </>
      )}
       <div style={{ width: "50%"}}> 
      <label htmlFor="sessiondate-input"><img src={calendarIcon} alt="Cal" /></label>
      <input
      style={{ width: "100%" }}
      value={sessionDate ? dayjs(sessionDate).format("YYYY-MM-DD") : ""}
      placeholder="No date selected"
      disabled/>
      </div>
      <div style={{ width: "50%"}}> 
      <label htmlFor="startTime-input"><img src={timeIcon} alt="Time" /></label>
      <input
      style={{ width: "100%" }}
      value={startTime ? dayjs(startTime).format("HH:mm:ss") : ""}
      placeholder="No time selected"
      disabled
      />
      </div>

      <div style={{ width: "50%"}}> 
      <label htmlFor="endTime-input"><img src={timeIcon} alt="Time" /></label>
      <input
      style={{ width: "100%" }}
      value={endTime ? dayjs(endTime).format("HH:mm:ss") : ""}
      placeholder="No time selected"
      disabled
      /></div>
       <div style={{ width: "50%"}}> 
      <Button type="primary" onClick={() => handleScheduleSession(startTime, endTime)} block>
          Schedule Session
      </Button></div>
     
      {selectedTutor && (
        <div style={{ width: "100%", maxWidth: "100%", margin: "0 auto" }}>
  <Card title="Tutor's Weekly Schedule" style={{ width: "100%" }}>
      <FullCalendar
    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
    initialView="timeGridWeek"
    events={[
        ...availabilityEvents, // ✅ Available slots
        ...scheduledSessions.map(session => ({ // ✅ Booked sessions
            title: "Tutor Booked",
            start: `${session.sessionDate}T${session.startTime}`,
            end: `${session.sessionDate}T${session.endTime}`,
            color: "red",
        })), 
        ...scheduledStudentSessions.map(session => ({ // ✅ Booked sessions
          title: "Student Booked",
          start: `${session.sessionDate}T${session.startTime}`,
          end: `${session.sessionDate}T${session.endTime}`,
          color: "orange",
      })), 
    ]}
    validRange={{
        start: dayjs().format("YYYY-MM-DD"), // ✅ Starts today
        end: dayjs().add(14, "day").format("YYYY-MM-DD"), // ✅ Ends in 14 days
    }}
    eventClick={handleSlotClick} // ✅ Ensure this function is used correctly
    height="400px"
/>

        </Card></div>
      )}

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

export default ScheduleSession;
