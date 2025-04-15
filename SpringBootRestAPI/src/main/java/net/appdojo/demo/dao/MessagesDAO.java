package net.appdojo.demo.dao;

import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Component;

import net.appdojo.demo.models.Account;
import net.appdojo.demo.models.Message;

@Component
public class MessagesDAO extends Database {

    public int sendMessage(Message msg) {
        try {
            String sql = "INSERT INTO messages (sender_id, receiver_id, message) VALUES (?, ?, ?)";
            return execute(sql, msg.getSenderId(), msg.getReceiverId(), msg.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return -1;
        }
    }

    public List<Message> getConversation(int user1, int user2) {
        List<Message> messages = new ArrayList<>();
        try {
            String sql = "SELECT * FROM messages WHERE " +
                         "(sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?) " +
                         "ORDER BY timestamp ASC";

            ResultSet rs = getResultSet(sql, user1, user2, user2, user1);
            while (rs != null && rs.next()) {
                Message msg = new Message();
                msg.setId(rs.getInt("id"));
                msg.setSenderId(rs.getInt("sender_id"));
                msg.setReceiverId(rs.getInt("receiver_id"));
                msg.setMessage(rs.getString("message"));
                msg.setTimestamp(rs.getTimestamp("timestamp"));
                msg.setReadStatus(rs.getBoolean("read_status"));
                messages.add(msg);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return messages;
    }

    public List<Account> getSessionBasedPartners(int userId, String accountType) {
        List<Account> partners = new ArrayList<>();
        try {
            String sql = "";
    
            if (accountType.equals("student")) {
                sql = "SELECT DISTINCT a.* FROM sessions s " +
                      "JOIN account a ON s.TutorID = a.AccountID " +
                      "WHERE s.StudentID = ?";
            } else if (accountType.equals("tutor")) {
                sql = "SELECT DISTINCT a.* FROM sessions s " +
                      "JOIN account a ON s.StudentID = a.AccountID " +
                      "WHERE s.TutorID = ?";
            }
    
            ResultSet rs = getResultSet(sql, userId);
            while (rs != null && rs.next()) {
                Account acc = new Account();
                acc.setAccountId(rs.getInt("AccountID"));
                acc.setFirstName(rs.getString("FirstName"));
                acc.setLastName(rs.getString("LastName"));
                acc.setEmailId(rs.getString("EmailId"));
                acc.setPhoneNumber(rs.getString("PhoneNumber"));
                acc.setAccountType(rs.getString("AccType"));
                partners.add(acc);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return partners;
    }
}
