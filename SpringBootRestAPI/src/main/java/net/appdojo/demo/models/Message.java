package net.appdojo.demo.models;


import java.sql.Timestamp;

public class Message {

    private int id;
    private int senderId;
    private int receiverId;
    private String message;
    private Timestamp timestamp;
    private boolean readStatus;

    
    @Override
    public String toString() {
        return "Message [id=" + id + ", senderId=" + senderId + ", receiverId=" + receiverId + ", message=" + message
                + ", timestamp=" + timestamp + ", readStatus=" + readStatus + "]";
    }
    public int getId() {
        return id;
    }
    public void setId(int id) {
        this.id = id;
    }
    public int getSenderId() {
        return senderId;
    }
    public void setSenderId(int senderId) {
        this.senderId = senderId;
    }
    public int getReceiverId() {
        return receiverId;
    }
    public void setReceiverId(int receiverId) {
        this.receiverId = receiverId;
    }
    public String getMessage() {
        return message;
    }
    public void setMessage(String message) {
        this.message = message;
    }
    public Timestamp getTimestamp() {
        return timestamp;
    }
    public void setTimestamp(Timestamp timestamp) {
        this.timestamp = timestamp;
    }
    public boolean isReadStatus() {
        return readStatus;
    }
    public void setReadStatus(boolean readStatus) {
        this.readStatus = readStatus;
    }

    // Getters and Setters
    // ...
}
