package net.appdojo.demo.dao;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Component;

import net.appdojo.demo.models.Account;
import net.appdojo.demo.models.TutorAvailability;

@Component
public class TutorAvailabilityDAO extends Database{
	public static void main (String[]args)
	{
		AccountDAO dao = new AccountDAO();
		Account acct=dao.getAccount(2);
		System.out.println(acct);
		TutorAvailabilityDAO tutoravailabilitydao = new TutorAvailabilityDAO();
		tutoravailabilitydao.getAvailability(acct.getAccountId());
		//testAddUser();
	}
	public List<TutorAvailability> getAvailability (int acctId)
	{
		try {
			System.out.println("getavailability acctId " + acctId);

    		Database db = new Database();
			ResultSet rs = db.getResultSet("SELECT * FROM TutorAvailability WHERE TutorID= " + acctId + " order by DayOfWeek asc, starttime asc");
        		
			if (rs==null||!rs.next())
        	{
        		System.err.println ("Query failed");
        		return null;
        	}

        	List<TutorAvailability> tAvailabilities = new ArrayList<TutorAvailability>();

        	do {

				TutorAvailability tAvailability = new TutorAvailability();
				tAvailability.setAvailabilityId(rs.getInt("AvailabilityId"));
				tAvailability.setTutorId(rs.getInt("TutorID"));
				tAvailability.setDayOfWeek(rs.getString("DayOfWeek"));
				tAvailability.setStartTime(rs.getTime("StartTime"));
				tAvailability.setEndTime(rs.getTime("EndTime"));
				
                tAvailabilities.add(tAvailability);
        	}while (rs.next());

			
        	return tAvailabilities;		
		
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}
	}
    public List<TutorAvailability> addAvailability(TutorAvailability tAvailability) {
        try {
			System.out.println("papoosi addavailability tutorid " + tAvailability.getTutorId());
			System.out.println("papoosi addavailability tutorid " + tAvailability.getDayOfWeek());
			System.out.println("papoosi addavailability tutorid " + tAvailability.getStartTime());
			System.out.println("papoosi addavailability tutorid " + tAvailability.getEndTime());
			
            List<TutorAvailability> tAvailabilities = new ArrayList<TutorAvailability>();
    		Database db = new Database();

             // SQL INSERT query using PreparedStatement
            String insertSQL = "INSERT INTO TutorAvailability (tutorid, dayofweek, starttime, endtime) VALUES (?, ?, ?, ?)";

			// Insert values
            int generatedId = db.execute(insertSQL, tAvailability.getTutorId(), tAvailability.getDayOfWeek(), tAvailability.getStartTime(), tAvailability.getEndTime());

            // Check the result
            if (generatedId != -1) {
                System.out.println("Tutor Availability successfully with ID: " + generatedId);
                tAvailabilities = getAvailability(tAvailability.getTutorId());
            } else {
                System.out.println("Insert failed.");
            }


        	return tAvailabilities;		
		
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		} 
        
    }

    public List<TutorAvailability> deleteAvailability(Long availabilityId, Long tutorId) {
        try {
			System.out.println("papoosi addavailability tutorid " + availabilityId);
		
            List<TutorAvailability> tAvailabilities = new ArrayList<TutorAvailability>();
    		Database db = new Database();

             // SQL DELETE query using PreparedStatement
            String deleteSQL = "DELETE FROM TutorAvailability WHERE AvailabilityID = " + availabilityId.intValue();

			// Insert values
            int result = db.execute(deleteSQL);

            // Check the result
            if (result != -1) {
                System.out.println("Tutor Availability successfully deleted with ID: " + result);
                tAvailabilities = getAvailability(tutorId.intValue());
            } else {
                System.out.println("Delete failed.");
            }
        	return tAvailabilities;		
		
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		} 
    }
    
	
}
