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
    	const errorMessage = "${errorMessage}";
    	if (errorMessage)
    	{
    		document.getElementById ("divMessage").innerHTML = "<font color='red'>"+errorMessage+"</font>";	
    	}
    	const auth = async()=>{
    		const data = {
    			username: document.getElementById("username").value,
    			password: document.getElementById("password").value
    		}
    		const resp = await fetch ("/api/auth",{
    			method:"POST",
    			headers:{
    				'Content-Type': 'application/json'
    			},
    			body:JSON.stringify(data)
    		});
    		const json=await resp.json();
    		console.log ("auth",json)
    	}
    </script>
    </head>
    <body>
    	<h1>Welcome to JSP</h1>
    	<form action="auth" method="post">
    		<p>Username: <input type='text' name='username' id='username'/></p>
    		<p>Password: <input type="password" name="password" id='password'/></p>
    		<div><button>Login</button></div>
    	</form>
    	<div><button onClick='auth()'>Login API</button></div>
    	
    	<div id='divMessage'></div>
    </body>
	<script src="/static/scripts/main.js"></script>
</html>