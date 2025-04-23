import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config";
import "../styles/style2.css";

const Messages = () => {
  const location = useLocation();
  const { accData } = location.state || {};
  const [partners, setPartners] = useState([]);
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const navigate = useNavigate();
  const [availability, setAvailability] = useState([]);
  useEffect(() => {
    const fetchPartners = async () => {
      const res = await fetch(`${API_URL}/messages/partners/${accData.accountId}/${accData.accountType}`);
      const data = await res.json();
      setPartners(data);
    };
    fetchPartners();
  }, [accData.accountId]);

  useEffect(() => {
    if (!selectedPartner) return;
    const fetchMessages = async () => {
      const res = await fetch(`${API_URL}/messages/thread/${accData.accountId}/${selectedPartner.accountId}`);
      const data = await res.json();
      setMessages(data);
    };
    fetchMessages();
  }, [selectedPartner, accData.accountId]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    const payload = {
      senderId: accData.accountId,
      receiverId: selectedPartner.accountId,
      message: newMessage,
    };
    const res = await fetch(`${API_URL}/messages/send`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      setMessages([...messages, { ...payload, timestamp: new Date().toISOString() }]);
      setNewMessage("");
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
          <li>
              <a href="/messages" class="nav-link current" onclick="return false;">View Message</a>
          </li>
          <li>
            <Link to="/calendar" state={{ accData }}>Check Calendar</Link>
          </li>
          <li>
          {accData?.accountType === "student" ? (
            <Link to="/tutorsearch" state={{ accData }}>Tutor Search</Link>
          ) : (
            <Link to="/availability" state={{ accData, availabilityData: availability}}>Manage Availability</Link>
          )}
          </li> 
          <li>
            <Link to="/profile" state={{ accData }}>Manage Profile</Link>
          </li>
          <li>
            <Link to="/login" onClick={() => { navigate("/login", { state: null });}}>Sign out</Link>
          </li>
          </ul>
      </aside>

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
          <h1>Messages</h1>
          <div className="card" style={{ display: "flex", gap: "20px" }}>
            <div style={{ flex: "1", borderRight: "1px solid #ccc" }}>
              <h3>Conversations</h3>
              <ul style={{ listStyle: "none", paddingLeft: 0 }}>
                {partners.map((partner) => (
                <li
                  key={partner.accountId}
                  onClick={() => setSelectedPartner(partner)}
                  style={{
                    cursor: "pointer",
                    padding: "10px",
                    borderBottom: "1px solid #eee",
                    backgroundColor: selectedPartner?.accountId === partner.accountId ? "#f0f0f0" : "black",
                    color: selectedPartner?.accountId === partner.accountId ? "black" : "white"
                  }}
                  >
                  {partner.firstName} {partner.lastName}
                </li>
                ))}
              </ul>
            </div>

            <div style={{ flex: "3" }}>
              {selectedPartner ? (
                <>
                  <h3>Chat with {selectedPartner.firstName} {selectedPartner.lastName}</h3>
                  <div
                    style={{
                      border: "1px solid #ddd",
                      padding: "10px",
                      height: "300px",
                      overflowY: "scroll",
                      background: "#fafafa",
                    }}
                  >
                    {Array.isArray(messages) && messages.map((msg, index) => (
                      <div key={index} style={{ marginBottom: "10px", color: "black" }}>
                        <strong style={{ color: "black" }}>
                          {msg.senderName} ➝ {msg.recieverName}:
                        </strong>
                        <p style={{ margin: 0, color: "black" }}>{msg.message}</p>
                        <small style={{ color: "gray" }}>
                          {new Date(msg.timestamp).toLocaleString()}
                        </small>
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type a message..."
                      style={{ flex: 1, padding: "10px", borderRadius: "4px", border: "1px solid #ccc" }}
                    />
                    <button
                      onClick={handleSendMessage}
                      style={{ padding: "10px 15px", background: "#007bff", color: "white", border: "none", borderRadius: "4px" }}
                    >
                      Send
                    </button>
                  </div>
                </>
              ) : (
                <p>Select a conversation to begin.</p>
              )}
            </div>
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

export default Messages;
