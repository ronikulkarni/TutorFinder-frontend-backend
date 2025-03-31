package net.appdojo.demo.models;

public class Rating {

    private int RatingId;

	private int tutorId;

	private int studentId;

	private int rating;

    private String comment;

    public int getRatingId() {
        return RatingId;
    }

    public void setRatingId(int ratingId) {
        RatingId = ratingId;
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

    public int getRating() {
        return rating;
    }

    public void setRating(int rating) {
        this.rating = rating;
    }

    @Override
    public String toString() {
        return "Rating [RatingId=" + RatingId + ", tutorId=" + tutorId + ", studentId=" + studentId + ", rating="
                + rating + "]";
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }
    
    
    
    
}
