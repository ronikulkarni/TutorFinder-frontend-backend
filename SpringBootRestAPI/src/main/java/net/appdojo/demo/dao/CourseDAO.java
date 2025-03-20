package net.appdojo.demo.dao;

import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Component;

import net.appdojo.demo.models.Course;

@Component
public class CourseDAO extends Database {

	public static void main(String[] args) {
		CourseDAO dao = new CourseDAO();
		dao.getCourses();
		// testAddUser();
	}

	public List<Course> getCourses() {
		try {
			Database db = new Database();
			ResultSet rs = db.getResultSet("SELECT * FROM Course order by CourseName asc");

			if (rs == null || !rs.next()) {
				System.err.println("Query failed");
				return null;
			}

			List<Course> courses = new ArrayList<Course>();

			do {

				Course course = new Course();
				course.setCourseId(rs.getInt("CourseID"));
				course.setCourseName(rs.getString("CourseName"));

				courses.add(course);
			}
			while (rs.next());

			return courses;

		}
		catch (Exception e) {
			e.printStackTrace();
			return null;
		}
	}

}
