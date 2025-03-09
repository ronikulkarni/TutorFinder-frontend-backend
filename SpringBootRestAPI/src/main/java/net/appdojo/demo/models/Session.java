package net.appdojo.demo.models;

import java.sql.Date;
import java.sql.Time;

public class Session {

    private int sessionId;
    private int tutorId;
    private int studentId;
    private int courseId;
    private Date sessionDate;
    private Time startTime; 
    private Time endTime;
    private String studentName;
    private String tutorName;
    private String courseName;
    


    public int getSessionId() {
        return sessionId;
    }
    public void setSessionId(int sessionId) {
        this.sessionId = sessionId;
    }
    public int getTutorId() {
        return tutorId;
    }
    public void setTutorId(int tutorId) {
        this.tutorId = tutorId;
    }
    public int getStudentId() {
        return studentId;
    }
    public void setStudentId(int studentId) {
        this.studentId = studentId;
    }
    public int getCourseId() {
        return courseId;
    }
    public void setCourseId(int courseId) {
        this.courseId = courseId;
    }
    public Date getSessionDate() {
        return sessionDate;
    }
    public void setSessionDate(Date sessionDate) {
        this.sessionDate = sessionDate;
    }
    public Time getStartTime() {
        return startTime;
    }
    public void setStartTime(Time startTime) {
        this.startTime = startTime;
    }
    public Time getEndTime() {
        return endTime;
    }
    public void setEndTime(Time endTime) {
        this.endTime = endTime;
    }

    public String getStudentName() {
        return studentName;
    }

    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }

    public String getTutorName() {
        return tutorName;
    }

    public void setTutorName(String tutorName) {
        this.tutorName = tutorName;
    }

    public String getCourseName() {
        return courseName;
    }

    public void setCourseName(String courseName) {
        this.courseName = courseName;
    }

    @Override
    public String toString() {
        return "Session [sessionId=" + sessionId + ", tutorId=" + tutorId + ", studentId=" + studentId + ", courseId="
                + courseId + ", sessionDate=" + sessionDate + ", startTime=" + startTime + ", endTime=" + endTime + "]";
    } 

   
    
    
}
