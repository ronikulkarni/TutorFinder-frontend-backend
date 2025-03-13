package net.appdojo.demo.dao;

import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Component;

import net.appdojo.demo.models.Account;
import net.appdojo.demo.models.Session;
import net.appdojo.demo.models.TutorAvailability;

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
				session.setSessionId(rs.getInt("SessionID"));
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

    public List<Session> addSession(Session session) {
        try {
			System.out.println("papoosi addavailability tutorid " + session.getTutorId());
			System.out.println("papoosi addavailability tutorid " + session.getStudentId());
			System.out.println("papoosi addavailability tutorid " + session.getCourseId());
			System.out.println("papoosi addavailability tutorid " + session.getSessionDate());
			
            List<Session> sessions = new ArrayList<Session>();
    		Database db = new Database();

             // SQL INSERT query using PreparedStatement
            String insertSQL = "INSERT INTO session (tutorid, studentid, courseid, sessiondate, starttime, endtime) VALUES (?, ?, ?, ?, ?, ?)";

			// Insert values
            int generatedId = db.execute(insertSQL, session.getTutorId(), session.getStudentId(), session.getCourseId(), session.getSessionDate(), session.getStartTime(), session.getEndTime());

            // Check the result
            if (generatedId != -1) {
                System.out.println("Session successfully with ID: " + generatedId);
                sessions = getSessions(session.getStudentId(), "student");
            } else {
                System.out.println("Insert failed.");
            }


        	return sessions;		
		
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		} 
        
    }
	
	public List<Session> deleteSession(Long sessionId, Long studentID) {
		try {
			System.out.println("papoosi delete session sessionid " + sessionId);
		
            List<Session> sessions = new ArrayList<Session>();
    		Database db = new Database();

             // SQL DELETE query using PreparedStatement
            String deleteSQL = "DELETE FROM Sessions WHERE sessionID = " + sessionId.intValue();

			// Insert values
            int result = db.execute(deleteSQL);

            // Check the result
            if (result != -1) {
                System.out.println("Session successfully deleted with ID: " + result);
                sessions = getSessions(studentID.intValue(), "student");
            } else {
                System.out.println("Delete failed.");
            }
        	return sessions;		
		
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		} 
	}
}
