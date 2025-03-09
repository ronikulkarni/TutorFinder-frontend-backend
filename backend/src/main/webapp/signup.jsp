<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%@ page import="java.sql.*"%>
<%
   
    Class.forName("com.mysql.jdbc.Driver");
    Connection conn = DriverManager.getConnection("jdbc:mysql://localhost:3306/TutorFinder", "root", "Rohan02**"); 
            
    String majorSql = "SELECT * FROM Major";
    Statement majorStmt =  conn.createStatement();
    ResultSet majorsRS = majorStmt.executeQuery(majorSql);


    String courseSql = "SELECT * FROM Course";
    Statement courseStmt =  conn.createStatement();
    ResultSet courseRS = courseStmt.executeQuery(courseSql);

%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Signup</title>
</head>
<body>
    <div class="wrapper">
      <h1>Signup</h1>
      <p id="error-message">
        <% 
          String errorMessage = (String) session.getAttribute("errorMessage");
          if (errorMessage != null) {
        %>
              <div style="color: red;" class="error-message">
                  <%= errorMessage %>
              </div>
        <% } %>
  
      </p>
      <form id="form" action="register.jsp" method="post">
        <form>

        <input type="radio" name="acctype" value="student" placeholder="Student">Student
        <input type="radio" name="acctype" value="tutor" placeholder="Tutor">Tutor
               
          <div>
            <label for="firstname-input">
              <img src="resources/img/person.svg" alt="Person">
            </label>
              <input type="firstname" name="firstname" class="form-control" id="firstname-input" placeholder="Enter First Name"> 
          </div>
          <div>
            <label for="lastname-input">
              <img src="resources/img/person.svg" alt="Person">
            </label>
              <input type="lastname" name="lastname" class="form-control" id="lastname-input" placeholder="Enter Last Name"> 
          </div>
            <div> 
              <label for="email-input">
                <span>@</span>
              </label>
              <input type="email" name="email" class="form-control" id="email-input" placeholder="Enter email">  
            </div>

            <div>
              <label for="password-input">
                <img src="resources/img/lock.svg" alt="Lock">
              </label>
              <input type="password" name="password"  class="form-control" id="password-input" placeholder="Password">
            </div>

            <div>
              <label for="repeatpassword-input">
                <img src="resources/img/lock.svg" alt="Lock">
              </label>
                <input type="password" class="form-control" id="repeatpassword-input" placeholder="Repeat Password">
            </div>

            <div>
                <label for="phonenumber-input">
                <span>Ph:</span>
                </label>
                  <input type="phonenumber" name="phonenumber" class="form-control" id="phonenumber-input" placeholder="Phone Number">
            </div>

            <div>
                <label for="major-input">
                <span></span>
                </label>
                <select id="dropdown" name="major">
                  <%
                      // Iterate over the ResultSet and create an option for each row
                      while (majorsRS.next()) {
                          int id = majorsRS.getInt("MajorID");
                          String name = majorsRS.getString("MajorName");
                      %>
                      <option value="<%= id %>"><%= name %></option>
                    <%
                      }
                    %>
              </select>
            </div>

            <div>
                <label for="courses-input">
                <span></span>
                </label>
                <select id="course" name="course" multiple>
                  <%
                      // Iterate over the ResultSet and create an option for each row
                      while (courseRS.next()) {
                          int id = courseRS.getInt("CourseID");
                          String name = courseRS.getString("CourseName");
                      %>
                      <option value="<%= id %>"><%= name %></option>
                    <%
                      }
                    %>
              </select>
              <input type="hidden" id="courses" name="courses" value="" />
            </div>
    
            <button type="submit" class="btn btn-primary">Signup</button>
          </form>
          <p>Already have an account? <a href="index.jsp">Login</a></p>
    </form> 
    </div>
    <script>
      // Before form submission, combine selected values into a comma-separated string.
      document.getElementById("form").addEventListener("submit", function(event) {
          var select = document.getElementById("course");
          var selectedValues = [];
          // Loop over selected options and push their values into an array.
          for (var i = 0; i < select.options.length; i++) {
              if (select.options[i].selected) {
                  selectedValues.push(select.options[i].value);
              }
          }
          // Join the array into a comma-separated string.
          document.getElementById("courses").value = selectedValues.join(",");
      });
  </script>

</body>
</html>