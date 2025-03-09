<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
	pageEncoding="ISO-8859-1"%>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>

<!DOCTYPE html>

<html>
    <head>
        <title>Welcome to JSP</title>
        <link href="/static/css/style.css" rel="stylesheet">
        <script>
        	const user = ${user.json};
        	console.log ("user:",user);
        </script>
    </head>
    <body>
    	<h1>User Dashboard</h1>
    	<h3>Welcome ${user.fullName }</h3>
    </body>
</html>