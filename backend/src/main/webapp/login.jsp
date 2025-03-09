<%@ page import="java.sql.*"%>
<%@ page import="java.security.MessageDigest"%>
<%@ page import="java.security.NoSuchAlgorithmException"%>
<%@ page import="java.sql.*" trimDirectiveWhitespaces="true" %>
<%
    String userId = request.getParameter("userId");    
    String password = request.getParameter("password");
    //String errorMessage = "";

    // Clear out error messages
    session.setAttribute("errorMessage","");

    // Hash the entered password using SHA1
    MessageDigest md = MessageDigest.getInstance("SHA-1");
    md.update(password.getBytes());
    byte[] hashedPassword = md.digest();

    // Convert byte array to hex string
    StringBuilder hexString = new StringBuilder();
    for (byte b : hashedPassword) {
        hexString.append(String.format("%02x", b));
    }
    String enteredPasswordHash = hexString.toString();

    
    Class.forName("com.mysql.jdbc.Driver");
    Connection conn = DriverManager.getConnection("jdbc:mysql://localhost:3306/TutorFinder", "root", "Rohan02**"); 
    // MYSQL server does not appear to be requiring a password... !!!!!! XXXXXXXXX

    // Check if account exists
    String query = "SELECT * FROM account WHERE EmailID = ?";
    PreparedStatement pstmt = conn.prepareStatement(query);
    pstmt.setString(1, userId);
    ResultSet rs = pstmt.executeQuery();

    if (rs.next()) {
        int failedAttempts = rs.getInt("FailedAttempts");
        Timestamp lockTime = rs.getTimestamp("LockTime");
                    
        if (failedAttempts >= 3) {
                // Check if the account is locked
            if (lockTime != null && (System.currentTimeMillis() - lockTime.getTime()) < 15 * 60 * 1000) {
                session.setAttribute("errorMessage","Your account is locked for 15 minutes due to too many failed login attempts. Please try again later.");
                // XXXXX Have control move to index.jsp XXXXX
                response.sendRedirect("index.jsp");
                return;
            } else {
                // Unlock account after 15 minutes and reset failed attempts
                String resetQuery = "UPDATE account SET FailedAttempts = 0, LockTime = NULL WHERE EmailID = ?";
                PreparedStatement resetStmt = conn.prepareStatement(resetQuery);
                resetStmt.setString(1, userId);
                resetStmt.executeUpdate();
            }
        } 

        String storedPassword = rs.getString("Password");
        if (enteredPasswordHash.equals(storedPassword)) {
            // Reset failed attempts on successful login
            String resetFailedAttemptsQuery = "UPDATE account SET FailedAttempts = 0, LockTime = NULL WHERE EmailID = ?";
            PreparedStatement resetFailedStmt = conn.prepareStatement(resetFailedAttemptsQuery);
            resetFailedStmt.setString(1, userId);
            resetFailedStmt.executeUpdate();
            String accountId = Integer.toString(rs.getInt("AccountID"));
            String firstName = rs.getString("FirstName");
            String courses = rs.getString("Course");
            String accType = rs.getString("AccType");

            session.setAttribute("accountId",accountId);
            session.setAttribute("firstName",firstName);
            session.setAttribute("courses",courses);
            session.setAttribute("accType",accType);

            response.sendRedirect("dashboard.jsp");
            return;
        } else {
            // Incorrect password, increment failed attempts
            String updateFailedAttemptsQuery = "UPDATE account SET FailedAttempts = FailedAttempts + 1, LockTime = CASE WHEN FailedAttempts + 1 >= 3 THEN NOW() ELSE LockTime END WHERE EmailID = ?";
            PreparedStatement updateStmt = conn.prepareStatement(updateFailedAttemptsQuery);
            updateStmt.setString(1, userId);
            updateStmt.executeUpdate();
            session.setAttribute("errorMessage","Incorrect password.");
            // XXXXX Have control move to index.jsp XXXXX
            response.sendRedirect("index.jsp");
            return;
        } 
    } else {
        session.setAttribute("errorMessage","User not found.");
        response.sendRedirect("index.jsp");
        return;
    }
%>