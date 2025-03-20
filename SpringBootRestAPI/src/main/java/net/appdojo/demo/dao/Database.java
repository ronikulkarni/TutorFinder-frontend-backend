package net.appdojo.demo.dao;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

public class Database {

	private String jdbcURL = "jdbc:mysql://localhost/test";

	private String jdbcUsername = "root";

	private String jdbcPassword = "";

	private String[][] connections = {
			{ "jdbc:mysql://localhost/TutorFinder", "root", "Rohan02**", "com.mysql.cj.jdbc.Driver" },
			{ "jdbc:mysql://database-1.clk6e26cqkln.us-east-2.rds.amazonaws.com/TutorFinder", "admin", "AjjiBaba2025",
					"com.mysql.cj.jdbc.Driver" }, };

	int connIndex = 1;

	String memoryURL = "jdbc:sqlite::memory:";

	private Connection conn;

	public static void main(String[] args) {
		// Database db = new Database();
		testUser();
		// System.out.println(Database.addQuestionMarks("call test", 3));
	}

	public static void testUser() {
		Database db = new Database();
		try {
			ResultSet rs = db.getResultSet("SELECT * FROM items");

			if (rs == null || !rs.next()) {
				System.err.println("Query failed!");
				return;
			}
			do {
				System.out.println(rs.getString(3));
			}
			while (rs.next());
		}
		catch (Exception ex) {
			ex.printStackTrace();
		}
		finally {
			db.close();
		}
	}

	public boolean resetPassword(int id, String password, int userType) {
		Database db = new Database();
		try {
			String sql = "UPDATE users SET password=? WHERE user_id=?";

			PreparedStatement ps = db.prepare(sql);
			ps.setString(1, password);
			ps.setInt(2, id);
			ps.execute();

			return true;
		}
		catch (Exception ex) {
			ex.printStackTrace();

			return false;
		}
		finally {
			db.close();
		}
	}

	// *****************************
	public boolean isEmailInUse(String userEmail) {
		try {
			String query = "SELECT COUNT(*) FROM users WHERE email = ?";
			PreparedStatement ps = prepare(query);
			ps.setString(1, userEmail);
			ResultSet rs = ps.executeQuery();

			if (rs.next()) {
				int count = rs.getInt(1);
				return count > 0; // If count > 0, the email is in use
			}
		}
		catch (SQLException e) {
			e.printStackTrace();
		}

		return false;
	}
	// ******************************

	public static int parseInt(String val, int alt) {
		try {
			return Integer.parseInt(val);
		}
		catch (NumberFormatException ex) {
			return alt;
		}
	}

	public Connection getConnection() {
		try {
			if (conn != null)
				return conn;
			// Class.forName("com.mysql.cj.jdbc.Driver");
			Class.forName(connections[connIndex][3]);
			conn = DriverManager.getConnection(connections[connIndex][0], connections[connIndex][1],
					connections[connIndex][2]);
		}
		catch (SQLException e) {
			e.printStackTrace();
		}
		catch (ClassNotFoundException e) {
			e.printStackTrace();
		}
		return conn;
	}

	public int execute(String sql) {
		try {
			if (conn == null)
				getConnection();

			PreparedStatement statement = conn.prepareStatement(sql);
			return statement.executeUpdate();
		}
		catch (SQLException e) {

		}
		finally {
			close();
		}

		return -1;
	}

	public int execute(String sql, Object... values) {
		try {
			if (conn == null)
				getConnection();
			if (sql.indexOf("?") < 0 && values != null && values.length > 0) {
				sql = addQuestionMarks(sql, values.length);
			}
			PreparedStatement statement = prepare(sql, true);
			int row = 1;
			for (Object obj : values) {
				statement.setObject(row++, obj);
			}
			statement.executeUpdate();
			ResultSet rs = statement.getGeneratedKeys();
			if (rs.next()) {
				int newId = rs.getInt(1);
				return newId;
			}
		}
		catch (SQLException e) {
			e.printStackTrace();
		}
		finally {
			close();
		}

		return -1;
	}

	public ResultSet query(String sql, Object... values) {
		try {
			if (conn == null)
				getConnection();
			if (sql.indexOf("?") < 0 && values != null && values.length > 0) {
				sql = addQuestionMarks(sql, values.length);
			}
			PreparedStatement statement = conn.prepareStatement(sql);
			int row = 1;
			for (Object obj : values) {
				statement.setObject(row++, obj);
			}
			ResultSet rs = statement.executeQuery();

			return rs;
		}
		catch (SQLException e) {
			e.printStackTrace();
		}
		finally {
			// close();
		}

		return null;
	}

	public PreparedStatement prepare(String sql, boolean returnId) {
		try {
			if (conn == null)
				getConnection();

			if (returnId) {
				return conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
			}
			else {
				return conn.prepareStatement(sql);
			}

		}
		catch (SQLException e) {

		}
		finally {
			// close();
		}

		return null;
	}

	public PreparedStatement prepare(String sql) {
		try {
			if (conn == null)
				getConnection();

			return conn.prepareStatement(sql);

		}
		catch (SQLException e) {

		}
		finally {
			// close();
		}

		return null;
	}

	public ResultSet getResultSet(String query, Object... values) {
		ResultSet rs = null;
		try {
			if (conn == null)
				getConnection();
			if (query.indexOf("?") < 0 && values != null && values.length > 0) {
				query = addQuestionMarks(query, values.length);
			}
			PreparedStatement statement = conn.prepareStatement(query);
			int row = 1;
			if (values != null && values.length > 0) {
				for (Object obj : values) {
					statement.setObject(row++, obj);
				}
			}
			return statement.executeQuery();
		}
		catch (SQLException e) {
			e.printStackTrace();
		}
		finally {
			// close();
		}
		return rs;
	}

	public boolean close() {
		try {
			if (conn == null)
				return true;
			conn.close();
			conn = null;
			return true;
		}
		catch (SQLException e) {
			e.printStackTrace();
		}
		return false;
	}

	public static String addQuestionMarks(String str, int ct) {
		str += "(";
		for (int i = 0; i < ct; i++) {
			str += "?";
			if (i < ct - 1) {
				str += ",";
			}
		}
		str += ")";
		return str;

	}

}