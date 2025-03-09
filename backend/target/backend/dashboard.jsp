<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%@ page import="java.sql.*"%>
<%
    String accountId = (String)session.getAttribute("accountId");
    String courses = (String)session.getAttribute("courses");
    String accType = (String)session.getAttribute("accType");
    
    String[] courseArray = {};
    if (courses != null && !courses.isEmpty()) {
        // Split the string using comma as a delimiter
        courseArray = courses.split(",");

        // Optionally trim whitespace from each value
        for (int i = 0; i < courseArray.length; i++) {
            courseArray[i] = courseArray[i].trim();
        }

    }

    Class.forName("com.mysql.jdbc.Driver");
    Connection conn = DriverManager.getConnection("jdbc:mysql://localhost:3306/TutorFinder", "root", "Rohan02**"); 
            
    StringBuilder sql = new StringBuilder("SELECT * FROM account WHERE (");
    for (int i = 0; i < courseArray.length; i++) {
        sql.append("FIND_IN_SET(?, Course) > 0");
        if (i < courseArray.length - 1) {
            sql.append(" OR ");
        }
    }
    sql.append (") AND AccType = 'tutor'");
    PreparedStatement pstmt  = conn.prepareStatement(sql.toString());
             
    // Set the parameters in the PreparedStatement from the coursesToFind array
    for (int i = 0; i < courseArray.length; i++) {
            pstmt.setString(i + 1, courseArray[i]);
    }
  
    ResultSet rs = pstmt.executeQuery();

   
%>

<!DOCTYPE html>

<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard</title>
    <style>
        table {
            width: 100%;
            border-collapse: collapse;
        }
        table, th, td {
            border: 1px solid #333;
        }
        th, td {
            padding: 8px;
            text-align: left;
        }
    </style>
</head>
<body>
    <p id="hello-message">
        <% 
          String helloMessage = "Hi, " + (String) session.getAttribute("firstName") + " !" ;
          if (helloMessage != null) {
        %>
              <div style="color: blue;" class="hello-message">
                  <%= helloMessage %>
              </div>
        <% } %>
  
      </p>



    <div class="wrapper">
      <h1>DASHBOARD</h1>
    </div>

    <h2>Your upcoming sessions</h2>

    <h3>You have no scheduled upcoming sessions.</h3>

    <% if (accType != null && accType.equals("student")) { %>
        <h2>Tutor List</h2>
        <table>
            <thead>
                <tr>
                    <th>Tutor Name</th>
                    <th>Email ID</th>
                    <th>Phone Number</th>
                    <th>Rating</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                <%
                    while (rs.next()) {
                        // Change the column names if necessary
                        String tutorName = rs.getString("FirstName") + " " + rs.getString("LastName");
                        String emailId = rs.getString("EmailID");
                        String phoneNumber = rs.getString("PhoneNumber");
                        
                %>
                <tr>
                    <td><%= tutorName %></td>
                    <td><%= emailId %></td>
                    <td><%= phoneNumber %></td>
                    <td>* * * *</td>
                    <td><I><a href="schedule.jsp">Schedule a session<link></I></td>
                </tr>
                <%
                    }
                %>
            </tbody>
        </table>
    <% } %>
</body>    
</html>
