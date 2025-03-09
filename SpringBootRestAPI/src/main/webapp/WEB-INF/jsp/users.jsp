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
        	let name = "";
            function getTableRow(user) {
                const tr = `<tr>
        			<td>${user.userId}</td>
        			<td>${user.username}</td>
        			<td>${user.email}</td>
        			<td>${user.fullName}</td>
        			<td>${user.roleId}</td>
        			<td>${user.status}</td>
        		</tr>`

                return `<tr><td>${user.userId}</td><td>${user.username}</td><td>${user.email}</td><td>${user.fullName}</td><td>${user.roleId}</td><td>${user.status}</td></tr>`
              }
        </script>
    </head>
    <body>
    	<h1>Welcome to JSP</h1>
    	<h2>${test }</h2>
    	<table class="table table-bordered">
            	<tr>
            		<th>Id</th>
            		<th>Username</th>
            		<th>Email</th>
            		<th>Full Name</th>
            		<th>Role</th>
            		<th>Status</th>

            	</tr>

            	<c:forEach var="user" items="${userList}">
                    <tr>
                		<td>${user.userId}</td>
                		<td>${user.username}</td>
                		<td>${user.email}</td>
                		<td>${user.fullName}</td>
                		<td>${user.roleId}</td>
                		<td>${user.status}</td>
                		
                	</tr>

            	</c:forEach>

            </table>
    </body>
</html>