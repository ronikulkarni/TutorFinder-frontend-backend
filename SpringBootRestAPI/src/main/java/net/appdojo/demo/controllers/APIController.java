package net.appdojo.demo.controllers;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import net.appdojo.demo.models.Account;
import net.appdojo.demo.models.Session;
import net.appdojo.demo.models.Course;
import net.appdojo.demo.models.Message;
import net.appdojo.demo.models.OtpRequest;
import net.appdojo.demo.models.Rating;
import net.appdojo.demo.models.TutorAvailability;
import net.appdojo.demo.models.User;
import net.appdojo.demo.services.MainService;

@CrossOrigin(origins = "*")
@RestController()
@RequestMapping("/api")
public class APIController {

	@Autowired
	MainService service;

	@PostMapping("/auth")
	@CrossOrigin()
	public Account auth(@RequestBody Account account) {
		try {
			System.out.printf("1. post auth: \n%s\n", account);
			Account authAcct = service.auth(account.getEmailId(), account.getPassword());

			System.out.printf("2. post auth: \n%s\n", authAcct);
			if (authAcct == null) {
				authAcct.setAccountId(0);

				return authAcct;
			}
			return authAcct;
		}
		catch (Exception ex) {
			System.err.println("post auth error:" + ex);
			account.setAccountId(-1);

			return account;
		}
	}


	@PostMapping("/sendOTP")
	public boolean sendOTP(@RequestBody OtpRequest request) {
		boolean success = false;
		try {
			success = service.sendOTP(request.getEmail());
			return success;
		}
		catch (Exception ex) {
			System.err.println("post sendOTP error:" + ex);
			return success;
		}
	}

	@PostMapping("/verifyOTP")
	public boolean verifyOTP(@RequestBody OtpRequest request) {
		boolean success = false;
		try {
			success = service.verifyOTP(request.getEmail(), request.getOTP());
			return success;
		}
		catch (Exception ex) {
			System.err.println("post verifyOTP error:" + ex);
			return success;
		}
	}

	@PostMapping("/user")
	public User postUser(@RequestBody User user) {
		try {
			service.save(user);
			return user;
		}
		catch (Exception ex) {
			System.err.println("post auth error:" + ex);
			user.setStatus(-1);
			user.setUserId(0);
			user.setRoleId(0);
			user.setFullName("error:" + ex.getMessage());
			return user;
		}
	}

	@GetMapping("/user")
	public User getUser() {
		User user = new User(1, "testerb", "Test1234", "testerb@test.com", "Bob Tester", 2, 1);
		return user;
	}

	@GetMapping("/user/{id}")
	public User getUser(@PathVariable int id) {
		User user = new User();

		try {
			user = service.getUser(id);
			System.out.println(user);
			return user;
		}
		catch (Exception ex) {
			return user;
		}
	}

	@GetMapping("/accounts")
	@CrossOrigin()
	public List<Account> getUsers() {
		System.out.println("api/get/users");
		try {
			List<Account> accounts = service.getAccounts();
			return accounts;
		}
		catch (Exception ex) {
			return null;
		}

	}

	@PostMapping("/tutorsforcourse")
	public List<Account> getTutorsForCourse(@RequestBody Account account) {
		List<Account> tutorAccts = new ArrayList<Account>();
		try {
			System.out.printf("1. getTutorsForCourse \n%s\n", account);
			tutorAccts = service.getTutorsForCourse(account.getCourse());

			System.out.printf("2. post getTutorsForCourse: \n%s\n", tutorAccts);
			return tutorAccts;
		}
		catch (Exception ex) {
			System.err.println("post auth error:" + ex);
			return tutorAccts;
		}
	}

	@PostMapping("/sessions")
	public List<Session> getSessions(@RequestBody Account account) {
		List<Session> sessions = new ArrayList<Session>();
		try {
			System.out.printf("1. sessions \n%s\n", account);
			sessions = service.getSessions(account.getAccountId(), account.getAccountType());

			System.out.printf("2. post sessions: \n%s\n", sessions);
			return sessions;
		}
		catch (Exception ex) {
			System.err.println("post auth error:" + ex);
			return sessions;
		}
	}

	@GetMapping("/courses")
	public List<Course> getCourses() {
		List<Course> courses = new ArrayList<Course>();
		try {
			System.out.printf("1. courses ");
			courses = service.getCourses();

			System.out.printf("2. post courses: \n%s\n", courses);
			return courses;
		}
		catch (Exception ex) {
			System.err.println("post auth error:" + ex);
			return courses;
		}
	}

	@PostMapping("/tutorAvailabilities")
	public List<TutorAvailability> getAvailability(@RequestBody Account account) {
		List<TutorAvailability> tAvailabilities = new ArrayList<TutorAvailability>();
		try {
			System.out.printf("1. availabilities \n%s\n", account);
			tAvailabilities = service.getAvailability(account.getAccountId());

			System.out.printf("2. post availability: \n%s\n", tAvailabilities);
			return tAvailabilities;
		}
		catch (Exception ex) {
			System.err.println("post auth error:" + ex);
			return tAvailabilities;
		}
	}

	@PostMapping("/addAvailability")
	public List<TutorAvailability> addAvailability(@RequestBody TutorAvailability tAvailability) {
		List<TutorAvailability> tAvailabilities = new ArrayList<TutorAvailability>();
		try {
			System.out.printf("1. Add availabilities \n%s\n", tAvailability);
			tAvailabilities = service.addAvailability(tAvailability);

			System.out.printf("2. post add availability: \n%s\n", tAvailabilities);
			return tAvailabilities;
		}
		catch (Exception ex) {
			System.err.println("post auth error:" + ex);
			return tAvailabilities;
		}
	}

	@DeleteMapping("/deleteAvailability/{availabilityId}/{tutorID}")
	public List<TutorAvailability> deleteAvailability(@PathVariable Long availabilityId, @PathVariable Long tutorID) {
		List<TutorAvailability> tAvailabilities = new ArrayList<TutorAvailability>();
		try {
			System.out.printf("1. Delete availabilities \n%s\n", availabilityId);
			tAvailabilities = service.deleteAvailability(availabilityId, tutorID);

			System.out.printf("2. post delete availability: \n%s\n", tAvailabilities);
			return tAvailabilities;
		}
		catch (Exception ex) {
			System.err.println("post auth error:" + ex);
			return tAvailabilities;
		}
	}

	@GetMapping("/searchtutors")
	public List<Account> getSearchTutors(@RequestParam(required = false) Integer courseId,
			@RequestParam(required = false) String firstName, @RequestParam(required = false) String lastName) {
		List<Account> tutorAccts = new ArrayList<Account>();
		try {
			System.out.printf("1. getSearchTutors ");

			tutorAccts = service.getSearchTutors(courseId, firstName, lastName);
			System.out.printf("2. post getSearchTutors: \n%s\n", tutorAccts);
			return tutorAccts;
		}
		catch (Exception ex) {
			System.err.println("post getSearchTutors error:" + ex);
			return tutorAccts;
		}
	}

	@PostMapping("/addAccount")
	public Account addAccount(@RequestBody Account account) {
		Account acc = null;
		try {
			System.out.printf("1. Add account \n%s\n", account);
			acc = service.addAccount(account);

			System.out.printf("2. post add account: \n%s\n", acc);
			return acc;
		}
		catch (Exception ex) {
			System.err.println("post auth error:" + ex);
			return acc;
		}
	}

	@PutMapping("/account/{accountId}")
	public Account updateAccount(@PathVariable Long accountId, @RequestBody Account account) {
		Account acc = null;
		try {
			System.out.printf("1. Update account \n%s\n", account);
			acc = service.updateAccount(accountId, account);

			System.out.printf("2. post update account: \n%s\n", acc);
			return acc;
		}
		catch (Exception ex) {
			System.err.println("post update error:" + ex);
			return acc;
		}
	}

	@PostMapping("/addSession")
	public List<Session> addSession(@RequestBody Session session) {
		List<Session> sessions = new ArrayList<Session>();
		try {
			System.out.printf("1. Add session \n%s\n", session);
			sessions = service.addSession(session);

			System.out.printf("2. post add session: \n%s\n", session);
			return sessions;
		}
		catch (Exception ex) {
			System.err.println("post auth error:" + ex);
			return sessions;
		}
	}

	@DeleteMapping("/deleteSession/{sessionId}/{studentID}")
	public List<Session> deleteSession(@PathVariable Long sessionId, @PathVariable Long studentID) {
		List<Session> sessions = new ArrayList<Session>();
		try {
			System.out.printf("1. Delete sessions \n%s\n", sessionId);
			sessions = service.deleteSession(sessionId, studentID);

			System.out.printf("2. post delete sessions: \n%s\n", sessions);
			return sessions;
		}
		catch (Exception ex) {
			System.err.println("post auth error:" + ex);
			return sessions;
		}
	}

	@PostMapping("/addRating")
	public boolean addRating(@RequestBody Rating rating) {
		boolean success = false;
		try {
			System.out.printf("1. Add rating \n%s\n", rating);
			success = service.addRating(rating);

			System.out.printf("2. post add rating: \n%s\n", success);
			return success;
		}
		catch (Exception ex) {
			System.err.println("post auth error:" + ex);
			return success;
		}
	}

	@GetMapping("/getRating/{tutorID}")
	public int getRating(@PathVariable Long tutorID) {
		int rating = -1;
		try {
			System.out.printf("1. Get rating \n%s\n", tutorID);
			rating = service.getRating(tutorID);

			System.out.printf("2. post get rating: \n%s\n", rating);
			return rating;
		}
		catch (Exception ex) {
			System.err.println("post auth error:" + ex);
			return rating;
		}
	}

	

	@GetMapping("/tutorreviews/{tutorID}")
	public  List<Rating> getTutorReviews(@PathVariable Long tutorID) {
		List<Rating> reviews = new ArrayList<Rating>();
		try {
			System.out.printf("1. Get reviews \n%s\n", tutorID);
			reviews = service.getTutorReviews(tutorID);

			System.out.printf("2. post get review: \n%s\n", reviews);
			return reviews;
		}
		catch (Exception ex) {
			System.err.println("post auth error:" + ex);
			return reviews;
		}
	}
	
	@PostMapping("/messages/send")
	public boolean sendMessage(@RequestBody Message msg) {
		try {
			System.out.printf("1. Send message \n%s\n", msg);
			boolean result = service.sendMessage(msg);
			System.out.printf("2. post send message: %s\n", result);
			return result;
		} catch (Exception ex) {
			System.err.println("post send message error:" + ex);
			return false;
		}
	}
	
	@GetMapping("/messages/thread/{user1}/{user2}")
	public List<Message> getConversation(@PathVariable int user1, @PathVariable int user2) {
		List<Message> messages = new ArrayList<>();
		try {
			System.out.printf("1. Get conversation for users %d and %d\n", user1, user2);
			messages = service.getConversation(user1, user2);
			System.out.printf("2. post get conversation: \n%s\n", messages);
			return messages;
		} catch (Exception ex) {
			System.err.println("get conversation error:" + ex);
			return messages;
		}
	}
	
	@GetMapping("/messages/partners/{userId}/{accountType}")
	public List<Account> getPartners(@PathVariable int userId, @PathVariable String accountType) {
		List<Account> partners = new ArrayList<>();
		try {
			partners = service.getMessagePartners(userId, accountType);
			System.out.printf("2. post get partners: \n%s\n", partners);
			return partners;
		} catch (Exception ex) {
			System.err.println("get partners error:" + ex);
			return partners;
		}
	}
	

}
