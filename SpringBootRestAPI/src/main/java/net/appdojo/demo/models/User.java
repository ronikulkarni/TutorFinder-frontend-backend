package net.appdojo.demo.models;

public class User {

	/*
	 * CREATE TABLE `account` ( `AccountID` int NOT NULL AUTO_INCREMENT, `FirstName`
	 * varchar(10) NOT NULL, `LastName` varchar(15) NOT NULL, `EmailID` varchar(50) NOT
	 * NULL, `Password` char(40) NOT NULL, `PhoneNumber` varchar(15) DEFAULT NULL,
	 * `FailedAttempts` int DEFAULT NULL, `LockTime` datetime DEFAULT NULL, `AccType`
	 * varchar(15) NOT NULL, `Major` int NOT NULL, `Course` varchar(100) DEFAULT NULL,
	 * PRIMARY KEY (`AccountID`), UNIQUE KEY `AccountID` (`AccountID`,`EmailID`) )
	 * ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
	 *
	 */
	int userId;

	private String username;

	private String password;

	private String email;

	private String fullName;

	private int roleId;

	private int status;

	public User() {
		this.userId = 0;

	}

	public User(int userId, String username, String password, String email, String fullName, int roleId, int status) {
		super();
		this.userId = userId;
		this.username = username;
		this.fullName = fullName;
		this.password = password;
		this.email = email;
		this.roleId = roleId;
		this.status = status;
	}

	private static String TO_STRING = "{userId:%d, username:'%s', email:'%s',fullName:'%s',roleId:%d, status:%d}";

	@Override
	public String toString() {
		return String.format(TO_STRING, this.userId, this.username, this.email, this.fullName, this.roleId,
				this.status);
	}

	private static String JSON = "{'userId':%d, 'username':'%s', 'email':'%s','fullName':'%s','roleId':%d, 'status':%d}";

	public String getJson() {
		return String.format(JSON, this.userId, this.username, this.email, this.fullName, this.roleId, this.status);
	}

	public Object[] getValues() {
		Object[] values = { this.userId, this.username, this.password, this.email, this.fullName, this.roleId,
				this.status };
		return values;
	}

	public int getUserId() {
		return this.userId;
	}

	public void setUserId(int userId) {
		this.userId = userId;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getFullName() {
		return fullName;
	}

	public void setFullName(String fullName) {
		this.fullName = fullName;
	}

	public String getPassword() {
		return "*********";
	}

	public String _pw() {
		return this.password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public int getRoleId() {
		return roleId;
	}

	public void setRoleId(int roleId) {
		this.roleId = roleId;
	}

	public int getStatus() {
		return status;
	}

	public void setStatus(int status) {
		this.status = status;
	}

}
