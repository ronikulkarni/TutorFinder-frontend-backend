package net.appdojo.demo.dao;

import java.security.MessageDigest;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Component;

import net.appdojo.demo.models.Account;

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
		try {

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
			Database db = new Database();
			PreparedStatement pstmt = db.prepare(sql.toString(), false);

			// Set the parameters in the PreparedStatement from the coursesToFind array
			for (int i = 0; i < courseArray.length; i++) {
				pstmt.setString(i + 1, courseArray[i]);
			}

			ResultSet rs = pstmt.executeQuery();
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

	public Account getAccount(int id) {
		Database db = new Database();
		try {
			ResultSet rs = db.getResultSet("SELECT * FROM account WHERE AccountID=" + id);

			if (rs == null || !rs.next()) {
				System.err.println("Query failed");
				return null;
			}
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

			return acct;
		}
		catch (Exception ex) {
			return null;
		}
	}

	public Account getAccountByEmail(String emailId) {
		Database db = new Database();
		try {
			System.out.println("getAccountByEmail" + emailId);
			ResultSet rs = db.getResultSet("SELECT * FROM account WHERE EmaiLID='" + emailId + "'");

			if (rs == null || !rs.next()) {
				System.err.println("Query failed");
				return null;
			}
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
			System.out.println("getAccountByEmail returning" + acct.toString());
			return acct;
		}
		catch (Exception ex) {
			return null;
		}
	}

	public Account auth(String email, String pw) {
		Database db = new Database();
		try {
			String hashPW = hashPassword(pw);
			ResultSet rs = db.query("SELECT * FROM account WHERE EmailID=? AND password=?", email, hashPW);

			if (rs == null || !rs.next()) {
				System.err.println("Query failed");
				return null;
			}

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
			return acct;
		}
		catch (Exception ex) {
			ex.printStackTrace();
			return null;
		}
		finally {
			db.close();
		}
	}

	public List<Account> getAccounts() {
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
			String query = "SELECT * FROM account where AccType = 'tutor' AND ";
			if (courseId != null)
				query = query + " FIND_IN_SET(" + courseId.intValue() + ", Course)";
			else if (firstName != null)
				query = query + " firstName LIKE '%" + firstName + "%'";
			else if (lastName != null)
				query = query + " lastName LIKE '%" + lastName + "%'";

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

}
