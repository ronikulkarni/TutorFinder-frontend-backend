package net.appdojo.demo.dao;

import java.security.MessageDigest;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Connection;
import java.util.ArrayList;
import java.util.List;
import java.util.Properties;
import java.util.Random;



import org.springframework.stereotype.Component;

import net.appdojo.demo.models.Account;

import jakarta.mail.Message;
import jakarta.mail.MessagingException;
import jakarta.mail.PasswordAuthentication;
import jakarta.mail.Session;
import jakarta.mail.Transport;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;
import jakarta.mail.Authenticator;



@Component
public class AccountDAO extends Database {

	public static void main(String[] args) {

		AccountDAO dao = new AccountDAO();
		Account acct = dao.getAccount(1);
		System.out.println(acct);
		dao.getTutorsForCourse(acct.getCourse());
		// testAddUser();
	}

	public List<Account> getTutorsForCourse(String courses) {
		List<Account> accounts = new ArrayList();
		Connection conn = null;
		PreparedStatement pstmt = null;
		PreparedStatement courseStmt = null;
		ResultSet rs = null;
		ResultSet courseRs = null;
		try {

			RatingDAO ratingDAO = new RatingDAO();
			String[] courseArray = {};
			if (courses != null && !courses.isEmpty()) {
				// Split the string using comma as a delimiter
				courseArray = courses.split(",");

				// Optionally trim whitespace from each value
				for (int i = 0; i < courseArray.length; i++) {
					courseArray[i] = courseArray[i].trim();
				}

			}

			StringBuilder sql = new StringBuilder("SELECT * FROM account WHERE (");
			for (int i = 0; i < courseArray.length; i++) {
				sql.append("FIND_IN_SET(?, Course) > 0");
				if (i < courseArray.length - 1) {
					sql.append(" OR ");
				}
			}
			sql.append(") AND AccType = 'tutor'");

			System.out.print(sql);
			//Database db = new Database();
			//PreparedStatement pstmt = db.prepare(sql.toString(), false);
			conn = new Database().getConnection();
			pstmt = conn.prepareStatement(sql.toString());
			// Set the parameters in the PreparedStatement from the coursesToFind array
			for (int i = 0; i < courseArray.length; i++) {
				pstmt.setString(i + 1, courseArray[i]);
			}

			rs = pstmt.executeQuery();
			if (rs == null || !rs.next()) {
				System.err.println("Query failed");
				return null;
			}

			do {

				Account acct = new Account();

				acct.setAccountId(rs.getInt("AccountID"));
				acct.setAccountType(rs.getString("AccType"));
				acct.setCourse(rs.getString("Course"));
				acct.setEmailId(rs.getString("EmailID"));
				acct.setFailedAttempts(rs.getInt("FailedAttempts"));
				acct.setFirstName(rs.getString("FirstName"));
				acct.setLastName(rs.getString("lastName"));
				acct.setLockTime(rs.getString("LockTime"));
				acct.setMajor(rs.getInt("Major"));
				acct.setPhoneNumber(rs.getString("PhoneNumber"));


				//get course names

				String courseStr = acct.getCourse(); // e.g. "CS101, MATH201"
				String courseNames = "";
				if (courseStr != null && !courseStr.isEmpty()) {
					String[] courseIDs = courseStr.split(",");

					StringBuilder courseQuery = new StringBuilder("SELECT * FROM Course WHERE CourseID IN (");
					for (int i = 0; i < courseIDs.length; i++) {
						courseQuery.append("?");
						if (i < courseIDs.length - 1) courseQuery.append(",");
					}
					courseQuery.append(")");

					courseStmt = conn.prepareStatement(courseQuery.toString());
					for (int i = 0; i < courseIDs.length; i++) {
						courseStmt.setString(i + 1, courseIDs[i].trim());
					}

					courseRs = courseStmt.executeQuery();
					while (courseRs.next()) {
						courseNames += courseRs.getString("CourseName") + ", ";
					}
					if (courseNames.length() > 2)
						acct.setCourseNames(courseNames.substring(0, courseNames.length()-2));
					else
						acct.setCourseNames(courseNames);
				}


				int rating =  ratingDAO.getRating(acct.getAccountId());
				acct.setTutorRating(rating);

				accounts.add(acct);
			}
			while (rs.next());

			

		} catch (Exception e) {
			e.printStackTrace();
			return null;
		} finally {
			try { if (rs != null) rs.close(); } catch (SQLException e) { e.printStackTrace(); }
			try { if (courseRs != null) courseRs.close(); } catch (SQLException e) { e.printStackTrace(); }
			try { if (courseStmt != null) courseStmt.close(); } catch (SQLException e) { e.printStackTrace(); }
			try { if (pstmt != null) pstmt.close(); } catch (SQLException e) { e.printStackTrace(); }
			try { if (conn != null) conn.close(); } catch (SQLException e) { e.printStackTrace(); }
		}

		return accounts;
	}
	

	public Account getAccount(int id) {
		Connection conn = null;
		PreparedStatement stmt = null;
		ResultSet rs = null;
		Account acct = null;
		
		try {
			conn = new Database().getConnection();
			stmt = conn.prepareStatement("SELECT * FROM account WHERE AccountID=?");
			stmt.setInt(1, id);
			rs = stmt.executeQuery();


			if (rs.next()){
			acct = new Account();

			acct.setAccountId(rs.getInt("AccountID"));
			acct.setAccountType(rs.getString("AccType"));
			acct.setCourse(rs.getString("Course"));
			acct.setEmailId(rs.getString("EmailID"));
			acct.setFailedAttempts(rs.getInt("FailedAttempts"));
			acct.setFirstName(rs.getString("FirstName"));
			acct.setLastName(rs.getString("lastName"));
			acct.setLockTime(rs.getString("LockTime"));
			acct.setMajor(rs.getInt("Major"));
			acct.setPhoneNumber(rs.getString("PhoneNumber"));
			acct.setAvatarURL(rs.getString("AvatarURL"));
			acct.setProfileURL(rs.getString("ProfilePicURL"));
			}
			else {
				System.err.println("Query failed");
			}
			
		}
		catch (Exception ex) {
			System.err.println("Error in getAccount: " + ex.getMessage());
		} finally {
			try { if (rs != null) rs.close(); } catch (SQLException e) { e.printStackTrace(); }
			try { if (stmt != null) stmt.close(); } catch (SQLException e) { e.printStackTrace(); }
			try { if (conn != null) conn.close(); } catch (SQLException e) { e.printStackTrace(); }
		}

		return acct;
	}

	public Account getAccountByEmail(String emailId) {
		Connection conn = null;
		PreparedStatement stmt = null;
		ResultSet rs = null;
		Account acct = null;

		try {
			System.out.println("getAccountByEmail" + emailId);
			conn = new Database().getConnection();
			stmt = conn.prepareStatement("SELECT * FROM account WHERE EmailID=?");
			stmt.setString(1, emailId);
			rs = stmt.executeQuery();
			
			
			if (rs.next()) {
				
			 	acct = new Account();

				acct.setAccountId(rs.getInt("AccountID"));
				acct.setAccountType(rs.getString("AccType"));
				acct.setCourse(rs.getString("Course"));
				acct.setEmailId(rs.getString("EmailID"));
				acct.setFailedAttempts(rs.getInt("FailedAttempts"));
				acct.setFirstName(rs.getString("FirstName"));
				acct.setLastName(rs.getString("lastName"));
				acct.setLockTime(rs.getString("LockTime"));
				acct.setMajor(rs.getInt("Major"));
				acct.setPhoneNumber(rs.getString("PhoneNumber"));
			}
			else {
				System.err.println("Query failed");
			}

			System.out.println("getAccountByEmail returning" + acct.toString());
		}catch (Exception ex) {
			System.err.println("Error in getAccountByEmail: " + ex.getMessage());
		}finally {
			try { if (rs != null) rs.close(); } catch (SQLException e) { e.printStackTrace(); }
			try { if (stmt != null) stmt.close(); } catch (SQLException e) { e.printStackTrace(); }
			try { if (conn != null) conn.close(); } catch (SQLException e) { e.printStackTrace(); }
		}
		return acct;
	}


	public Account auth(String email, String pw) {
		Database db = new Database();
		try {
			Account acct = getAccountByEmail(email);
			if (acct == null) return null;
	
			// Check if locked
			if (acct.getFailedAttempts() >= 3 && acct.getLockTime() != null) {
				// Compare LockTime + 15 min with current time
				ResultSet rsLock = db.query("SELECT TIMESTAMPDIFF(MINUTE, LockTime, NOW()) AS minutesLocked FROM account WHERE EmailID=?", email);
				if (rsLock.next() && rsLock.getInt("minutesLocked") < 15) {
					System.out.println("Account is still locked");
					acct.setAccountId(-2);
					return acct;
				} else {
					// Unlock account
					db.execute("UPDATE account SET FailedAttempts=0, LockTime=NULL WHERE EmailID=?", email);
					acct.setFailedAttempts(0);
					acct.setLockTime(null);
				}
			}
	
			// Attempt login
			String hashPW = hashPassword(pw);
			ResultSet rs = db.query("SELECT * FROM account WHERE EmailID=? AND password=?", email, hashPW);
	
			if (rs != null && rs.next()) {
				db.execute("UPDATE account SET FailedAttempts=0, LockTime=NULL WHERE EmailID=?", email);
	
				acct.setAccountId(rs.getInt("AccountID"));
				acct.setAccountType(rs.getString("AccType"));
				acct.setCourse(rs.getString("Course"));
				acct.setEmailId(rs.getString("EmailID"));
				acct.setFirstName(rs.getString("FirstName"));
				acct.setLastName(rs.getString("lastName"));
				acct.setPhoneNumber(rs.getString("PhoneNumber"));
				acct.setAvatarURL(rs.getString("AvatarURL"));
				acct.setProfileURL(rs.getString("ProfilePicURL"));
				acct.setMajor(rs.getInt("Major"));
				acct.setLockTime(null);
				acct.setFailedAttempts(0);
				return acct;
			} else {
				int newAttempts = acct.getFailedAttempts() + 1;
				db.execute("UPDATE account SET FailedAttempts=? WHERE EmailID=?", newAttempts, email);
	
				if (newAttempts >= 3) {
					db.execute("UPDATE account SET LockTime=NOW() WHERE EmailID=?", email);
					acct.setAccountId(-2); // locked
				} else {
					acct.setAccountId(-1); // wrong password
				}
	
				return acct;
			}
		} catch (Exception ex) {
			ex.printStackTrace();
			return null;
		}
	}
	
	

	public List<Account> getAccounts() {
		//
		Database db = new Database();
		try {
			ResultSet rs = db.getResultSet("SELECT * FROM account");

			if (rs == null || !rs.next()) {
				System.err.println("Query failed");
				return null;
			}
			List<Account> accounts = new ArrayList<>();
			do {
				Account acct = new Account();

				acct.setAccountId(rs.getInt("AccountID"));
				acct.setAccountType(rs.getString("AccType"));
				acct.setCourse(rs.getString("Course"));
				acct.setEmailId(rs.getString("EmailID"));
				acct.setFailedAttempts(rs.getInt("FailedAttempts"));
				acct.setFirstName(rs.getString("FirstName"));

				acct.setLastName(rs.getString("lastName"));
				acct.setLockTime(rs.getString("LockTime"));
				acct.setMajor(rs.getInt("Major"));
				acct.setPhoneNumber(rs.getString("PhoneNumber"));
				accounts.add(acct);
			}
			while (rs.next());
			return accounts;
		}
		catch (Exception ex) {
			ex.printStackTrace();
			return null;
		}
	}

	public Account getUserByEmail(String emailId) {
		return null;
	}

	public Account save(Account acct) {
		Database db = new Database();
		try {
			String sp = "call usp_user_save";
			// db.query(sp,
			// user.getUserId(),user.getUsername(),user._pw(),user.getFullName(),user.getEmail(),"",user.getRoleId());
			return acct;
		}
		catch (Exception ex) {
			return null;
		}

	}

	public String hashPassword(String password) {
		try {
			// Hash the entered password using SHA1
			MessageDigest md = MessageDigest.getInstance("SHA-1");
			md.update(password.getBytes());
			byte[] hashedPassword = md.digest();

			// Convert byte array to hex string
			StringBuilder hexString = new StringBuilder();
			for (byte b : hashedPassword) {
				hexString.append(String.format("%02x", b));
			}
			String enteredPasswordHash = hexString.toString();
			return enteredPasswordHash;
		}
		catch (Exception ex) {
			return null;

		}
	}

	public List<Account> getSearchTutors(Integer courseId, String firstName, String lastName) {
		Database db = new Database();
		try {
			
			String query = 
			"SELECT a.*, ROUND(AVG(r.Rating)) AS AvgRating " +
			"FROM account a " +
			"LEFT JOIN Ratings r ON a.AccountID = r.TutorID " +
			"WHERE a.AccType = 'tutor' ";
			if (courseId != null)
				query = query + " AND FIND_IN_SET(" + courseId.intValue() + ", Course)";
			else if (firstName != null)
				query = query + " AND firstName LIKE '%" + firstName + "%'";
			else if (lastName != null)
				query = query + " AND lastName LIKE '%" + lastName + "%'";

			query = query + " GROUP BY a.AccountID";
			ResultSet rs = db.query(query);
			if (rs == null || !rs.next()) {
				System.err.println("Query failed");
				return null;
			}
			List<Account> accounts = new ArrayList<Account>();
			do {
				Account acct = new Account();
				acct.setAccountId(rs.getInt("AccountID"));
				acct.setAccountType(rs.getString("AccType"));
				acct.setCourse(rs.getString("Course"));
				acct.setEmailId(rs.getString("EmailID"));
				acct.setFailedAttempts(rs.getInt("FailedAttempts"));
				acct.setFirstName(rs.getString("FirstName"));
				acct.setLastName(rs.getString("lastName"));
				acct.setLockTime(rs.getString("LockTime"));
				acct.setMajor(rs.getInt("Major"));
				acct.setPhoneNumber(rs.getString("PhoneNumber"));
				acct.setTutorRating(rs.getInt("AvgRating"));
				accounts.add(acct);
			}
			while (rs.next());

			return accounts;

		}
		catch (Exception e) {
			e.printStackTrace();
			return null;
		}
	}

	public Account addAccount(Account account) {
		Account addedAcc = null;
		try {

			if (getAccountByEmail(account.getEmailId()) == null) {
				Database db = new Database();
				// SQL INSERT query using PreparedStatement
				String insertSQL = "INSERT INTO account (FirstName, LastName, EmailID, Password, PhoneNumber, AccType, Major, Course) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

				// Insert values
				int generatedId = db.execute(insertSQL, account.getFirstName(), account.getLastName(),
						account.getEmailId(), hashPassword(account.getPassword()), account.getPhoneNumber(),
						account.getAccountType(), 27647, account.getCourse());

				// Check the result
				if (generatedId != -1) {
					System.out.println("Account successfully added with ID: " + generatedId);
					addedAcc = getAccount(generatedId);
				}
				else {
					System.out.println("Insert failed.");
				}

			}
			else {
				System.out.println("Adding account id -1 since account already exists with email id");
				addedAcc = new Account();
				addedAcc.setAccountId(-1);
			}
			return addedAcc;

		}
		catch (Exception e) {
			e.printStackTrace();
			return addedAcc;
		}
	}

	public boolean sendOTP(String email) {
		String otp = String.format("%06d", new Random().nextInt(999999)); // 6-digit OTP

		// 1. Send Email
		final String senderEmail = "tutorfinder02@gmail.com";
		final String senderPassword = "tdtr qkot vuse cybd"; // Use app-specific password

		Properties props = new Properties();
		props.put("mail.smtp.auth", "true");
		props.put("mail.smtp.starttls.enable", "true");
		props.put("mail.smtp.host", "smtp.gmail.com");
		props.put("mail.smtp.port", "587");

		Session session = Session.getInstance(props, new Authenticator() {
			protected PasswordAuthentication getPasswordAuthentication() {
				return new PasswordAuthentication(senderEmail, senderPassword);
			}
		});

		try {
			Message message = new MimeMessage(session);
			message.setFrom(new InternetAddress(senderEmail));
			message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(email));
			message.setSubject("Your One-Time Access Key");
			message.setText("Your OTP is: " + otp + "\n\nThis code is valid for a limited time.");

			Transport.send(message);
			System.out.println("Email sent to " + email);

		} catch (MessagingException e) {
			e.printStackTrace();
			return false; // Fail early if email sending fails
		}

		// 2. Insert into database
		try {
			Database db = new Database(); // Your DB connection utility
			PreparedStatement pstmt = db.prepare(
				"REPLACE INTO OTP (Email, OTPCode) VALUES (?, ?)", false
			);
			pstmt.setString(1, email);
			pstmt.setString(2, otp);

			int rows = pstmt.executeUpdate();
			return rows > 0;

		} catch (SQLException e) {
			e.printStackTrace();
			return false;
		}
	}

	public boolean verifyOTP(String email, String otp) {
		
		try {
			Database db = new Database();
	
			// Step 1: Check OTP match
			PreparedStatement otpStmt = db.prepare(
				"SELECT OTPCode FROM OTP WHERE Email = ?", false
			);
			otpStmt.setString(1, email);
			ResultSet otpRs = otpStmt.executeQuery();
	
			if (!otpRs.next() || !otpRs.getString("OTPCode").equals(otp)) {
				System.out.println("OTP verification failed.");
				return false;
			}
	
			// Step 2: Generate a new temporary password
			String tempPassword = generateTempPassword();
			String hashedPassword = hashPassword(tempPassword);
	
			// Step 3: Update the user's password in the account table
			PreparedStatement updateStmt = db.prepare(
				"UPDATE account SET Password = ?, FailedAttempts = 0, LockTime = NULL WHERE EmailID = ?",
				false
			);
			updateStmt.setString(1, hashedPassword);
			updateStmt.setString(2, email);
	
			int rows = updateStmt.executeUpdate();
			if (rows == 0) {
				System.out.println("Failed to update password.");
				return false;
			}
	
			// Step 4: Send new password to user
			if (sendPasswordEmail(email, tempPassword))
				return true;
			else
				return false;
				
		} catch (Exception e) {
			e.printStackTrace();
			return false;
		}

	}

	public String generateTempPassword() {
		int length = 10;
		String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
		StringBuilder password = new StringBuilder();
		Random rnd = new Random();
		for (int i = 0; i < length; i++) {
			password.append(chars.charAt(rnd.nextInt(chars.length())));
		}
		return password.toString();
	}

	public boolean sendPasswordEmail(String email, String temppassword) {
		// 1. Send Email
		final String senderEmail = "tutorfinder02@gmail.com";
		final String senderPassword = "tdtr qkot vuse cybd"; // Use app-specific password

		Properties props = new Properties();
		props.put("mail.smtp.auth", "true");
		props.put("mail.smtp.starttls.enable", "true");
		props.put("mail.smtp.host", "smtp.gmail.com");
		props.put("mail.smtp.port", "587");

		Session session = Session.getInstance(props, new Authenticator() {
			protected PasswordAuthentication getPasswordAuthentication() {
				return new PasswordAuthentication(senderEmail, senderPassword);
			}
		});

		try {
			Message message = new MimeMessage(session);
			message.setFrom(new InternetAddress(senderEmail));
			message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(email));
			message.setSubject("Your Temporary Password");
			message.setText("Your Temporary Password is: " + temppassword + "\n\nBe sure to change the password to something you remember.");

			Transport.send(message);
			System.out.println("Email sent to " + email);
			return true;

		} catch (MessagingException e) {
			e.printStackTrace();
			return false; // Fail early if email sending fails
		}

	}

	public Account updateAccount(Long accountId, Account account) {
			Database db = new Database();
			try {
				// Build dynamic SQL
				StringBuilder sql = new StringBuilder("UPDATE account SET ");
				List<Object> params = new ArrayList<>();
		
				if (account.getEmailId() != null) {
					sql.append("EmailID=?, ");
					params.add(account.getEmailId());
				}
				if (account.getPhoneNumber() != null) {
					sql.append("PhoneNumber=?, ");
					params.add(account.getPhoneNumber());
				}
				if (account.getPassword() != null && !account.getPassword().isEmpty()) {
					sql.append("Password=?, ");
					params.add(hashPassword(account.getPassword())); //  hashed with SHA-1
				}
				if (account.getCourse() != null) {
					sql.append("Course=?, ");
					params.add(account.getCourse());
				}
				if (account.getAvatarURL() != null) {
					sql.append("AvatarURL=?, ");
					params.add(account.getAvatarURL());
				}
				if (account.getProfileURL() != null) {
					sql.append("ProfilePicURL=?, ");
					params.add(account.getProfileURL());
				}
		
				// Nothing to update
				if (params.isEmpty()) {
					System.out.println("No fields to update.");
					return getAccount(accountId.intValue());
				}
		
				// Remove trailing comma and space
				sql.setLength(sql.length() - 2);
				sql.append(" WHERE AccountID=?");
				params.add(accountId);
		
				int rowsAffected = db.execute(sql.toString(), params.toArray());
				System.out.println("rowsAffected" + rowsAffected);
				if (rowsAffected > 0) {
					return getAccount(accountId.intValue());
				} else {
					System.out.println("No rows updated.");
					return null;
				}
			} catch (Exception e) {
				e.printStackTrace();
				return null;
			}
		}
		
	
}
