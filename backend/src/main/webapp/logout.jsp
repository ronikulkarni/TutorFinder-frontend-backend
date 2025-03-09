<%
session.setAttribute("userId", null);
session.invalidate();
response.sendRedirect("index.jsp");
%>