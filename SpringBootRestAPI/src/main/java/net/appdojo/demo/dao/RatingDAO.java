package net.appdojo.demo.dao;


import java.sql.ResultSet;

import org.springframework.stereotype.Component;

import net.appdojo.demo.models.Rating;

@Component
public class RatingDAO extends Database{

    
    public boolean addRating(Rating rating) {
        boolean success = false;
		try {
			
			System.out.println(" addrating tutorid " + rating.getTutorId());
			System.out.println(" addRating studentid " + rating.getStudentId());
			System.out.println(" addRating rating " + rating.getRating());

			
			Database db = new Database();

			// SQL INSERT query using PreparedStatement
			String insertSQL = "INSERT INTO Ratings (TutorID, StudentID, Rating, Comment) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE  Rating = VALUES(Rating), \n" + //
								" Comment = VALUES(Comment),  CreatedAt = CURRENT_TIMESTAMP";

			// Insert values
			int generatedId = db.execute(insertSQL, rating.getTutorId(), rating.getStudentId(), rating.getRating(), rating.getComment());

			// Check the result
			if (generatedId != -1) {
				System.out.println("Rating successfully with ID: " + generatedId);
				success = true;
			}
			else {
				System.out.println("Insert failed.");
			}

			return success;

		}
		catch (Exception e) {
			e.printStackTrace();
			return success;
		}

	}


    public int getRating(int tutorId) {
        int rating = -1;
		try {
			System.out.println("getrating tutorId " + tutorId);

			Database db = new Database();
			// ResultSet rs = db.getResultSet("SELECT * FROM sessions WHERE StudentID= " +
			// acctId + " order by sessiondate asc, starttime asc");
			ResultSet rs = null;

		
			rs = db.getResultSet("SELECT TutorID, round(AVG(Rating)) AS AvgRating\n" + //
                "FROM Ratings where TutorID = " + tutorId + " \n" +//
                "GROUP BY TutorID");
		
			if (rs == null || !rs.next()) {
				System.err.println("Query failed");
				return rating;
			}

			rating = rs.getInt("AvgRating");

			return rating;

		}
		catch (Exception e) {
			e.printStackTrace();
			return rating;
		}
	}
}
