<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Signup</title>
    <link rel="stylesheet" href="resources/css/style.css">
    <script type="text/javascript" src="resources/js/validation.js" defer></script>
</head>
<body>
    <div class="wrapper">
      <h1>Tutor Finder</h1>
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
      <form id="form" action="login.jsp" method="post">
       
            <div> 
              <label for="email">
                <img src="resources/img/person.svg"  alt="Person">
              </label>
              <input required type="email" class="form-control" name="userId" id="email-input" placeholder="Enter email">  
            </div>

            <div>
              <label for="password">
                <img src="resources/img/lock.svg"  alt="Lock">
              </label>
              <input required type="password" class="form-control" name="password" id="password-input" placeholder="Password">
            </div>

            <button type="submit" class="btn btn-primary">Login</button>
          </form>
        <p>First Time User? <a href="signup.jsp">Signup</a></p>

    </div>
    
</body>
</html>