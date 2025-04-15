package net.appdojo.demo.services;

import java.security.MessageDigest;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import net.appdojo.demo.dao.AccountDAO;
import net.appdojo.demo.dao.CourseDAO;
import net.appdojo.demo.dao.MessagesDAO;
import net.appdojo.demo.dao.RatingDAO;
import net.appdojo.demo.dao.SessionDAO;
import net.appdojo.demo.dao.TutorAvailabilityDAO;
import net.appdojo.demo.models.Account;
import net.appdojo.demo.models.Course;
import net.appdojo.demo.models.Message;
import net.appdojo.demo.models.Rating;
import net.appdojo.demo.models.Session;
import net.appdojo.demo.models.TutorAvailability;
import net.appdojo.demo.models.User;

@Service
public class MainService {

	@Autowired
	AccountDAO accountDAO;

	SessionDAO sessionDAO;

	CourseDAO courseDAO;

	RatingDAO ratingDAO;

	MessagesDAO messagesDAO;

	TutorAvailabilityDAO tutorAvailabilityDAO;

	public User getUser(int id) {
		return null;
	}

	public Account auth(String un, String pw) {
		Account account = accountDAO.auth(un, pw);
		return account;
	}

	public List<Account> getAccounts() {
		return accountDAO.getAccounts();
	}

	public List<Account> getTutorsForCourse(String course) {
		return accountDAO.getTutorsForCourse(course);
	}

	public List<Session> getSessions(int accountId, String accType) {
		sessionDAO = new SessionDAO();
		return sessionDAO.getSessions(accountId, accType);

	}

	public User save(User user) {
		return null;
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

	public List<TutorAvailability> getAvailability(int accountId) {
		tutorAvailabilityDAO = new TutorAvailabilityDAO();
		return tutorAvailabilityDAO.getAvailability(accountId);

	}

	public List<TutorAvailability> addAvailability(TutorAvailability tAvailability) {
		tutorAvailabilityDAO = new TutorAvailabilityDAO();
		return tutorAvailabilityDAO.addAvailability(tAvailability);

	}

	public List<Course> getCourses() {
		courseDAO = new CourseDAO();
		return courseDAO.getCourses();

	}

	public List<Account> getSearchTutors(Integer courseId, String firstName, String lastName) {
		return accountDAO.getSearchTutors(courseId, firstName, lastName);
	}

	public List<Session> addSession(Session session) {
		sessionDAO = new SessionDAO();
		return sessionDAO.addSession(session);
	}

	public List<TutorAvailability> deleteAvailability(Long availabilityId, Long tutorID) {
		tutorAvailabilityDAO = new TutorAvailabilityDAO();
		return tutorAvailabilityDAO.deleteAvailability(availabilityId, tutorID);

	}

	public List<Session> deleteSession(Long sessionId, Long studentID) {
		sessionDAO = new SessionDAO();
		return sessionDAO.deleteSession(sessionId, studentID);
	}

	public Account addAccount(Account account) {
		accountDAO = new AccountDAO();
		return accountDAO.addAccount(account);
	}

    public boolean addRating(Rating rating) {
        ratingDAO = new RatingDAO();
		return ratingDAO.addRating(rating);
    }

    public int getRating(Long tutorID) {
        ratingDAO = new RatingDAO();
		return ratingDAO.getRating(tutorID.intValue());
    }

    public boolean sendOTP(String email) {
		accountDAO = new AccountDAO();
		return accountDAO.sendOTP(email);
        
    }

    public boolean verifyOTP(String email, String otp) {
        accountDAO = new AccountDAO();
		return accountDAO.verifyOTP(email, otp);
    }

    public List<Rating> getTutorReviews(Long tutorID) {
		ratingDAO = new RatingDAO();
		return ratingDAO.getTutorReviews(tutorID);
    }

    public Account updateAccount(Long accountId, Account account) {
		accountDAO = new AccountDAO();
		return accountDAO.updateAccount(accountId, account);
    }

	public boolean sendMessage(Message msg) {
		messagesDAO = new MessagesDAO();
		int result = messagesDAO.sendMessage(msg);
		return result != -1;
	}

	public List<Message> getConversation(int user1, int user2) {
		messagesDAO = new MessagesDAO();
		return messagesDAO.getConversation(user1, user2);
	}

	public List<Account> getMessagePartners(int userId, String accType) {
		messagesDAO = new MessagesDAO();
		return messagesDAO.getSessionBasedPartners(userId, accType);  // sessions only
	}

}
