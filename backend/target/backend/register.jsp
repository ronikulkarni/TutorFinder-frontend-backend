<%@ page import="java.sql.*"%>
<%@ page import="java.security.MessageDigest"%>
<%@ page import="java.security.NoSuchAlgorithmException"%>
<%
    String accType = request.getParameter("acctype");   
    String firstName = request.getParameter("firstname");
    String lastName = request.getParameter("lastname");
    String emailId = request.getParameter("email");
    String passWord = request.getParameter("password");
    String phoneNumber = request.getParameter("phonenumber");
    String major = request.getParameter("major");
    String courses = request.getParameter("courses");
    
    // Hash the entered password using SHA1
    MessageDigest md = MessageDigest.getInstance("SHA-1");
    md.update(passWord.getBytes());
    byte[] hashedPassword = md.digest();

    // Convert byte array to hex string
    StringBuilder hexString = new StringBuilder();
    for (byte b : hashedPassword) {
        hexString.append(String.format("%02x", b));
    }
    String enteredPasswordHash = hexString.toString();
    
    Class.forName("com.mysql.jdbc.Driver");
    Connection conn = DriverManager.getConnection("jdbc:mysql://localhost:3306/TutorFinder", "root", "Rohan02**"); 
    String query = "INSERT INTO account (FirstName, LastName, EmailID, Password, PhoneNumber, AccType, Major, Course) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    PreparedStatement pstmt = conn.prepareStatement(query);
    pstmt.setString(1, firstName);
    pstmt.setString(2, lastName);
    pstmt.setString(3, emailId);
    pstmt.setString(4, enteredPasswordHash);
    pstmt.setString(5, phoneNumber);
    pstmt.setString(6, accType);
    pstmt.setInt(7, Integer.parseInt(major));
    pstmt.setString(8, courses);
    int rowsAffected = pstmt.executeUpdate();

    if (rowsAffected > 0) {
       session.setAttribute("firstName",firstName);
       session.setAttribute("lastName",lastName);
       session.setAttribute("courses",courses);
       session.setAttribute("accType",accType);
       
       response.sendRedirect("dashboard.jsp");
       return;
    } else {
        session.setAttribute("errorMessage","Account creation failed.");
        response.sendRedirect("signup.jsp");
        return;
    }
%>