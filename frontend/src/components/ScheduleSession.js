import React, { useState, useEffect } from "react";
import { Select, DatePicker, TimePicker, Button, Card, message } from "antd";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { useLocation } from 'react-router-dom';
import { API_URL } from "../config";
import "../styles/style.css";

dayjs.extend(utc);
dayjs.extend(timezone);

// Define EST explicitly
const TIMEZONE = "America/New_York";

const { Option } = Select;

const ScheduleSession = () => {
  const location = useLocation();
  const { accData } = location.state || {};

  const [courses, setCourses] = useState([]);
  const [tutors, setTutors] = useState([]);
  const [availability, setAvailability] = useState([]);
  const [scheduledSessions, setScheduledSessions] = useState([]);

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
  };

  const handleScheduleSession = (selectedStart, selectedEnd) => {
    if (!selectedCourse || !selectedTutor || !selectedStart || !selectedEnd) {
        message.warning("Please fill all fields before scheduling");
        return;
    }

    const newSession = {
        tutorId: selectedTutor,
        studentId: 1,
        courseId: selectedCourse,
        sessionDate: selectedStart.format("YYYY-MM-DD"),
        startTime: selectedStart.format("HH:mm:ss"),
        endTime: selectedEnd.format("HH:mm:ss"),
    };

    fetch(`${API_URL}/addSession`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSession),
    })
    .then((res) => res.json())
    .then(() => {
        message.success("Session scheduled successfully!");

        // ✅ Update booked sessions in state
        setScheduledSessions(prev => [...prev, newSession]);

        // ✅ Trigger re-filtering of availability
        setAvailability(prev => [...prev]);  // Forces a re-render
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

const availabilityEvents = availability.flatMap((slot) => {
    return Array.from({ length: 14 }, (_, i) => { // ✅ Loop over the next 14 days
        const availableDate = dayjs().add(i, "day").tz("America/New_York");

        // ✅ Check if the day matches the tutor's available day (Monday, Tuesday, etc.)
        if (availableDate.day() !== dayOfWeekMap[slot.dayOfWeek]) {
            return []; // Skip if it's not a matching day
        }

        const slotStart = availableDate.format(`YYYY-MM-DDT${slot.startTime}`);
        const slotEnd = availableDate.format(`YYYY-MM-DDT${slot.endTime}`);

        // ✅ Get booked sessions on this specific day
        const bookedTimes = scheduledSessions
            .filter(session => session.sessionDate === availableDate.format("YYYY-MM-DD"))
            .map(session => ({
                start: dayjs(`${session.sessionDate}T${session.startTime}`).tz("America/New_York"),
                end: dayjs(`${session.sessionDate}T${session.endTime}`).tz("America/New_York")
            }))
            .sort((a, b) => a.start - b.start); // ✅ Sort booked slots in order

        let availableSlots = [];
        let currentStart = dayjs(slotStart).tz("America/New_York");

        // ✅ Split the availability into sections based on booked sessions
        for (let booked of bookedTimes) {
            if (currentStart.isBefore(booked.start)) {
                // ✅ Available slot before a booked session
                availableSlots.push({
                    title: "Available Slot",
                    start: currentStart.format(),
                    end: booked.start.format(),
                    color: "green",
                    extendedProps: {
                        sessionDate: availableDate.format("YYYY-MM-DD"),
                        startTime: currentStart.format("HH:mm:ss"),
                        endTime: booked.start.format("HH:mm:ss"),
                    },
                });
            }
            // ✅ Move currentStart to the end of the booked session
            currentStart = booked.end;
        }

        // ✅ If time remains after the last booked session, add it
        if (currentStart.isBefore(dayjs(slotEnd).tz("America/New_York"))) {
            availableSlots.push({
                title: "Available Slot",
                start: currentStart.format(),
                end: dayjs(slotEnd).format(),
                color: "green",
                extendedProps: {
                    sessionDate: availableDate.format("YYYY-MM-DD"),
                    startTime: currentStart.format("HH:mm:ss"),
                    endTime: dayjs(slotEnd).format("HH:mm:ss"),
                },
            });
        }

        return availableSlots;
    }).flat(); // ✅ Flatten the results into a single array
});



const sessionEvents = scheduledSessions.map((session) => ({
    title: "Booked Session",
    start: `${session.sessionDate}T${session.startTime}`,
    end: `${session.sessionDate}T${session.endTime}`,
    color: "red",
}));


const handleSlotClick = (info) => {
    const TIMEZONE = "America/New_York"; // ✅ Use EST

    // ✅ Extract the exact clicked time from the event
    let selectedStart = dayjs(info.event.start).tz(TIMEZONE);

    console.log("Clicked Event Start Time (EST):", selectedStart.format());

    // ✅ Correctly round down to the nearest 30-minute mark
    let roundedStart = selectedStart.minute(Math.floor(selectedStart.minute() / 30) * 30).second(0);

    // ✅ Set the session end time as 30 minutes after the rounded start
    let roundedEnd = roundedStart.add(30, "minute");

    // ✅ Debugging: Show corrected time values before confirming
    alert(`Rounded Start Time (EST): ${roundedStart.format("YYYY-MM-DD hh:mm:ss A")} EST`);
    alert(`Rounded End Time (EST): ${roundedEnd.format("YYYY-MM-DD hh:mm:ss A")} EST`);

    // ✅ Ask user for confirmation
    const confirmSession = window.confirm(
        `Confirm session time:\nDate: ${roundedStart.format("YYYY-MM-DD")}\nTime: ${roundedStart.format("hh:mm:ss A")} - ${roundedEnd.format("hh:mm:ss A")} EST`
    );

    // ✅ If confirmed, store & submit session (using extracted event time)
    if (confirmSession) {
        handleScheduleSession(roundedStart, roundedEnd);
    }
};

  return (
    <Card title="Schedule a Tutoring Session">
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
      <label>Session Date:</label>
      <input
      style={{ width: "100%" }}
      value={sessionDate ? dayjs(sessionDate).format("YYYY-MM-DD") : ""}
      placeholder="No date selected"
      disabled/>

      <label>Start Time:</label>
      <input
      style={{ width: "100%" }}
      value={startTime ? dayjs(startTime).format("HH:mm:ss") : ""}
      placeholder="No time selected"
      disabled
      />

      <label>End Time:</label>
      <input
      style={{ width: "100%" }}
      value={endTime ? dayjs(endTime).format("HH:mm:ss") : ""}
      placeholder="No time selected"
      disabled
    />
      {selectedTutor && (
        <Card title="Tutor's Weekly Schedule">
      <FullCalendar
    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
    initialView="timeGridWeek"
    events={[
        ...availabilityEvents, // ✅ Available slots
        ...scheduledSessions.map(session => ({ // ✅ Booked sessions
            title: "Booked Session",
            start: `${session.sessionDate}T${session.startTime}`,
            end: `${session.sessionDate}T${session.endTime}`,
            color: "red",
        }))
    ]}
    validRange={{
        start: dayjs().format("YYYY-MM-DD"), // ✅ Starts today
        end: dayjs().add(14, "day").format("YYYY-MM-DD"), // ✅ Ends in 14 days
    }}
    eventClick={handleSlotClick} // ✅ Ensure this function is used correctly
    height="400px"
/>

        </Card>
      )}


    </Card>
  );
};

export default ScheduleSession;
