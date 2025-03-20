import React, { useState, useEffect } from "react";
import { Select, DatePicker, TimePicker, Button, Card, message, Calendar, Badge, Typography } from "antd";
import dayjs from "dayjs";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useLocation } from 'react-router-dom';
import { API_URL } from "../config";
const { Option } = Select;
const { Text } = Typography;

const ScheduleSession = () => {
  const location = useLocation();
  const { accData } = location.state || {}; 
  console.log (accData);
  const [courses, setCourses] = useState([]);
  const [tutors, setTutors] = useState([]);
  const [availability, setAvailability] = useState([]);
  const [scheduledSessions, setScheduledSessions] = useState([]);

  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedTutor, setSelectedTutor] = useState(null);
  const [sessionDate, setSessionDate] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [dayOfWeek, setDayOfWeek] = useState("");

  useEffect(() => {
    // Fetch available courses (GET request)
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

    // Fetch tutors via POST request
    fetch(`${API_URL}/tutorsforcourse`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({course:courseId}),
    })
      .then((res) => res.json())
      .then((data) => setTutors(data))
      .catch(() => message.error("Failed to load tutors"));
  };

  const fetchTutorDetails = (tutorId) => {
    setSelectedTutor(tutorId);
    setAvailability([]);
    setScheduledSessions([]);

    // Fetch tutor availability via POST request
    fetch(`${API_URL}/tutorAvailabilities`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ accountId:tutorId }),
    })
      .then((res) => res.json())
      .then((data) => setAvailability(data))
      .catch(() => message.error("Failed to load availability"));

    // Fetch already scheduled sessions via POST request
    fetch(`${API_URL}/sessions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ accountId:tutorId, accountType:'tutor'}),
    })
      .then((res) => res.json())
      .then((data) => setScheduledSessions(data))
      .catch(() => message.error("Failed to load scheduled sessions"));
  };

  const handleScheduleSession = () => {
    if (!selectedCourse || !selectedTutor || !sessionDate || !startTime || !endTime) {
      message.warning("Please fill all fields before scheduling");
      return;
    }

    const newSession = {
      tutorId: selectedTutor,
      studentId: accData.accountId,
      courseId: selectedCourse,
      sessionDate: sessionDate.format("YYYY-MM-DD"),
      startTime: startTime.format("HH:mm"),
      endTime: endTime.format("HH:mm"),
    };

    // Send session details via POST request
    fetch(`${API_URL}/addSession`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newSession),
    })
      .then((res) => res.json())
      .then(() => {
        message.success("Session scheduled successfully!");
        setScheduledSessions([...scheduledSessions, newSession]); // Update UI
      })
      .catch(() => message.error("Failed to schedule session"));
  };

  const handleDateChange = (date) => {
    setSessionDate(date);
    if (date) {
      setDayOfWeek(dayjs(date).format("dddd")); // Get full day name (e.g., "Monday")
    } else {
      setDayOfWeek("");
    }
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
  
  const availabilityEvents = availability.flatMap((slot) => {
    console.log("Availability Slot:", slot);
  
    const numericDay = dayOfWeekMap[slot.dayOfWeek]; // Convert day string to number
    if (numericDay === undefined) {
      console.error("Invalid day of week:", slot.dayOfWeek);
      return [];
    }
  
    return [0, 7].map((offset) => {
      const availableDate = dayjs().day(numericDay).add(offset, "day"); // Corrected
      return {
        title: "Available Slot",
        start: availableDate.format(`YYYY-MM-DDT${slot.startTime}`),
        end: availableDate.format(`YYYY-MM-DDT${slot.endTime}`),
        color: "green",
      };
    });
  });

  // **Convert scheduled sessions into calendar events**
  const sessionEvents = scheduledSessions.map((session) => ({
    title: "Booked Session",
    start: `${session.sessionDate}T${session.startTime}`,
    end: `${session.sessionDate}T${session.endTime}`,
    color: "red",
  }));


  return (
    <Card title="Schedule a Tutoring Session">
      {/* Course Selection */}
      <label>Course:</label>
      <Select
        placeholder="Select a course"
        style={{ width: "100%", marginBottom: "10px" }}
        onChange={fetchTutors}
      >
        {courses.map((course) => (
          <Option key={course.courseId} value={course.courseId}>{course.courseName}</Option>
        ))}
      </Select>

      {/* Tutor Selection */}
      {tutors.length > 0 && (
        <>
          <label>Tutor:</label>
          <Select
            placeholder="Select a tutor"
            style={{ width: "100%", marginBottom: "10px" }}
            onChange={fetchTutorDetails}
          >
            {tutors.map((tutor) => (
              <Option key={tutor.accountId} value={tutor.accountId}>{tutor.firstName} {tutor.lastName}</Option>
            ))}
          </Select>
        </>
      )}

      {/* Availability & Scheduled Sessions in Calendar Format */}
      {selectedTutor && (
        <Card title="Tutor's Weekly Schedule">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="timeGridWeek" // ✅ Show week view instead of full month
            events={[...availabilityEvents, ...sessionEvents]}
            validRange={{
              start: dayjs().format("YYYY-MM-DD"), // ✅ Today
              end: dayjs().add(14, "day").format("YYYY-MM-DD"), // ✅ 2 weeks from today
            }}
            height="auto"
          />
        </Card>
      )}

      {/* Schedule Session Form */}
      <label>Session Date:</label>
      <DatePicker
        style={{ width: "100%", marginBottom: "10px" }}
        onChange={(date) => setSessionDate(date)}
        disabled={!selectedTutor}
      />

      <label>Start Time:</label>
      <TimePicker
        format="HH:mm"
        style={{ width: "100%", marginBottom: "10px" }}
        onChange={(time) => setStartTime(time)}
        disabled={!selectedTutor}
      />

      <label>End Time:</label>
      <TimePicker
        format="HH:mm"
        style={{ width: "100%", marginBottom: "10px" }}
        onChange={(time) => setEndTime(time)}
        disabled={!selectedTutor}
      />

      {/* Schedule Button */}
      <Button type="primary" onClick={handleScheduleSession} block>
        Schedule Session
      </Button>
    </Card>
  );
};


export default ScheduleSession;
