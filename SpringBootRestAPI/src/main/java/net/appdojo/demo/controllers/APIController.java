package net.appdojo.demo.controllers;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import net.appdojo.demo.models.Account;
import net.appdojo.demo.models.Session;
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
		} catch (Exception ex) {
			System.err.println("post auth error:" + ex);
			account.setAccountId(-1);
			
			return account;
		}
	}

	@PostMapping("/user")
	public User postUser(@RequestBody User user) {
		try {
			service.save(user);
			return user;
		} catch (Exception ex) {
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
		} catch (Exception ex) {
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
		} catch (Exception ex) {
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
		} catch (Exception ex) {
			System.err.println("post auth error:" + ex);
			account.setAccountId(-1);
			
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
		} catch (Exception ex) {
			System.err.println("post auth error:" + ex);
			account.setAccountId(-1);
			
			return sessions;
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
		} catch (Exception ex) {
			System.err.println("post auth error:" + ex);
			account.setAccountId(-1);
			
			return tAvailabilities;
		}
	}

	// Another syntax to implement a
	// GET method
	@GetMapping("/info")
	public String info() {
		String str2 = "<html><body><font color=\"green\">" + "<h2>GeeksForGeeks is a Computer"
				+ " Science portal for Geeks. " + "This portal has been " + "created to provide well written, "
				+ "well thought and well explained " + "solutions for selected questions."
				+ "</h2></font></body></html>";
		return str2;
	}
}
