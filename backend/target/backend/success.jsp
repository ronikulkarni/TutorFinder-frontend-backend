<%
    if ((session.getAttribute("userId") == null) || (session.getAttribute("userId") == "")) {
%>
You are not logged in<br/>
<a href="index.jsp">Please Login</a>
<%} else {
%>
Welcome <%=session.getAttribute("userId")%>
<a href='logout.jsp'>Log out</a>
<%
    }
%>