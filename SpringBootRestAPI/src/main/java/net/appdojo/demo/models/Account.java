package net.appdojo.demo.models;

public class Account {

    int accountId;
    String firstName;
    String lastName;
    String emailId;
    String password;
    String phoneNumber;
    int failedAttempts;
    String lockTime; // "YYYY-MM-DD HH:MM:SS"
    String accountType;
    int major;
    String course;
    
    public int getAccountId() {
        return accountId;
    }
    public void setAccountId(int accountId) {
        this.accountId = accountId;
    }
    public String getFirstName() {
        return firstName;
    }
    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }
    public String getLastName() {
        return lastName;
    }
    public void setLastName(String lastName) {
        this.lastName = lastName;
    }
    public String getEmailId() {
        return emailId;
    }
    public void setEmailId(String emailId) {
        this.emailId = emailId;
    }
    public String getPassword() {
        return password;
    }
    public void setPassword(String password) {
        this.password = password;
    }
    public String getPhoneNumber() {
        return phoneNumber;
    }
    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }
    public int getFailedAttempts() {
        return failedAttempts;
    }
    public void setFailedAttempts(int failedAttempts) {
        this.failedAttempts = failedAttempts;
    }
    public String getLockTime() {
        return lockTime;
    }
    public void setLockTime(String lockTime) {
        this.lockTime = lockTime;
    }
    public String getAccountType() {
        return accountType;
    }
    public void setAccountType(String accountType) {
        this.accountType = accountType;
    }
    public int getMajor() {
        return major;
    }
    public void setMajor(int major) {
        this.major = major;
    }
    public String getCourse() {
        return course;
    }
    public void setCourse(String course) {
        this.course = course;
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append("Account{");
        sb.append("accountId=").append(accountId);
        sb.append(", firstName=").append(firstName);
        sb.append(", lastName=").append(lastName);
        sb.append(", emailId=").append(emailId);
        sb.append(", password=").append(password);
        sb.append(", phoneNumber=").append(phoneNumber);
        sb.append(", failedAttempts=").append(failedAttempts);
        sb.append(", lockTime=").append(lockTime);
        sb.append(", accountType=").append(accountType);
        sb.append(", major=").append(major);
        sb.append(", course=").append(course);
        sb.append('}');
        return sb.toString();
    }

    
}
