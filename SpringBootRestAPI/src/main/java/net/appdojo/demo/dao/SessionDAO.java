package net.appdojo.demo.dao;

import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Component;

import net.appdojo.demo.models.Account;
import net.appdojo.demo.models.Session;

@Component
public class SessionDAO extends Database{
	public static void main (String[]args)
	{
		AccountDAO dao = new AccountDAO();
		Account acct=dao.getAccount(1);
		System.out.println(acct);
		SessionDAO sessiondao = new SessionDAO();
		sessiondao.getSessions(acct.getAccountId(), acct.getAccountType());
		//testAddUser();
	}
	public List<Session> getSessions (int acctId, String acctType)
	{
		try {
			System.out.println("getsessions acctId " + acctId);

    		Database db = new Database();
			//ResultSet rs = db.getResultSet("SELECT * FROM sessions WHERE StudentID= " + acctId + " order by sessiondate asc, starttime asc");
        	ResultSet rs = null;
			
			if (acctType.equals("student"))
				rs = db.getResultSet("SELECT s.*, CONCAT(t.firstname,' ',  t.lastname) as TutorName, CONCAT(st.firstname,' ',st.lastname) as StudentName, c.coursename FROM sessions s LEFT JOIN account t ON s.TutorID = t.AccountID LEFT JOIN account st ON s.StudentID = st.AccountID LEFT JOIN course c ON s.CourseID = c.CourseID where StudentID = " + acctId + " order by sessiondate asc, starttime asc");
			else
				rs = db.getResultSet("SELECT s.*, CONCAT(t.firstname,' ',  t.lastname) as TutorName, CONCAT(st.firstname,' ',st.lastname) as StudentName, c.coursename FROM sessions s LEFT JOIN account t ON s.TutorID = t.AccountID LEFT JOIN account st ON s.StudentID = st.AccountID LEFT JOIN course c ON s.CourseID = c.CourseID where TutorID = " + acctId + " order by sessiondate asc, starttime asc");
			
			if (rs==null||!rs.next())
        	{
        		System.err.println ("Query failed");
        		return null;
        	}

        	List<Session> sessions = new ArrayList<Session>();

        	do {

				Session session = new Session();
				session.setStudentId(rs.getInt("StudentID"));
				session.setTutorId(rs.getInt("TutorID"));
				session.setCourseId(rs.getInt("CourseID"));
				session.setSessionDate(rs.getDate("SessionDate"));
				session.setStartTime(rs.getTime("StartTime"));
				session.setEndTime(rs.getTime("EndTime"));
				session.setStudentName(rs.getString("StudentName"));
				session.setTutorName(rs.getString("TutorName"));
				session.setCourseName(rs.getString("CourseName"));
				


                sessions.add(session);
        	}while (rs.next());

			
        	return sessions;		
		
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}
	}


	
}
