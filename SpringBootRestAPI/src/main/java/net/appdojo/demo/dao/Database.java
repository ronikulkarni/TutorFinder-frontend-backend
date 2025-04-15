package net.appdojo.demo.dao;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

public class Database {

	private String[][] connections = {
			{ "jdbc:mysql://localhost/TutorFinder", "root", "Rohan02**", "com.mysql.cj.jdbc.Driver" },
			{
				"jdbc:mysql://database-1.clk6e26cqkln.us-east-2.rds.amazonaws.com/TutorFinder",
				"admin", "AjjiBaba2025", "com.mysql.cj.jdbc.Driver" },
	};

	int connIndex = 1;

	public Connection getConnection() throws SQLException, ClassNotFoundException {
		Class.forName(connections[connIndex][3]);
		return DriverManager.getConnection(
				connections[connIndex][0], connections[connIndex][1], connections[connIndex][2]);
	}

	public int execute(String sql, Object... values) {
		try (
			Connection conn = getConnection();
			PreparedStatement statement = sql.contains("?") ?
					conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS) :
					conn.prepareStatement(addQuestionMarks(sql, values.length), Statement.RETURN_GENERATED_KEYS)
		) {
			int row = 1;
			for (Object obj : values) {
				statement.setObject(row++, obj);
			}
			int rowsAffected = statement.executeUpdate();
			ResultSet rs = statement.getGeneratedKeys();
			if (rs.next()) {
				return rs.getInt(1);
			} else if (rowsAffected > 0)
				return rowsAffected;
		} catch (Exception e) {
			e.printStackTrace();
		}
		return -1;
	}

	public ResultSet query(String sql, Object... values) {
		try {
			Connection conn = getConnection();
			PreparedStatement statement = conn.prepareStatement(sql);
			int row = 1;
			for (Object obj : values) {
				statement.setObject(row++, obj);
			}
			return statement.executeQuery();
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}
	}

	public ResultSet getResultSet(String query, Object... values) {
		try {
			Connection conn = getConnection();
			if (query.indexOf("?") < 0 && values != null && values.length > 0) {
				query = addQuestionMarks(query, values.length);
			}
			PreparedStatement statement = conn.prepareStatement(query);
			int row = 1;
			for (Object obj : values) {
				statement.setObject(row++, obj);
			}
			return statement.executeQuery();
		} catch (SQLException | ClassNotFoundException e) {
			e.printStackTrace();
			return null;
		}
	}

	public PreparedStatement prepare(String sql, boolean returnId) {
		try {
			Connection conn = getConnection();
			if (returnId) {
				return conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
			} else {
				return conn.prepareStatement(sql);
			}
		} catch (SQLException | ClassNotFoundException e) {
			e.printStackTrace();
			return null;
		}
	}

	public PreparedStatement prepare(String sql) {
		try {
			Connection conn = getConnection();
			return conn.prepareStatement(sql);
		} catch (SQLException | ClassNotFoundException e) {
			e.printStackTrace();
			return null;
		}
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
