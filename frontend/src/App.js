import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import StudentDashboard from "./components/StudentDashboard";
import TutorDashboard from "./components/TutorDashboard";
import Availability from "./components/Availability";
import Search from "./components/Search";
import ScheduleSession from "./components/ScheduleSession";
import Calendar from "./components/Calendar";
import Rating from "./components/Rating";
import ForgotPassword from "./components/ForgotPassword";
import Profile from "./components/Profile";

const App = () => {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/studentdashboard" element={<StudentDashboard />} />
      <Route path="/tutordashboard" element={<TutorDashboard />} />
      <Route path="/tutorsearch" element={<Search />} />
      <Route path="/availability" element={<Availability />}  />
      <Route path="/search" element={<Search />}  />
      <Route path="/schedulesession" element={<ScheduleSession />}  />
      <Route path="/calendar" element={<Calendar />}  />
      <Route path="/rating/:tutorId/:studentId/:tutorName" element={<Rating />}  />
      <Route path="/forgotpassword" element={<ForgotPassword />}  />
      <Route path="/profile" element={<Profile />}  />
      <Route path="*" element={<h1>404 - Page Not Found</h1>} /> 
    </Routes>
    </BrowserRouter>
  );
};


export default App;


