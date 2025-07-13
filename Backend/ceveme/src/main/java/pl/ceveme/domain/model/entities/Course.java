package pl.ceveme.domain.model.entities;

import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(name = "courses")
public class Course {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private String courseName;
    private LocalDate dateOfCourse;
    @Lob
    private String courseDescription;

    @ManyToOne
    @JoinColumn(name = "employment_info_id")
    private EmploymentInfo employmentInfo;

    public Course() {
    }

    public Course(String courseName, LocalDate dateOfCourse, String courseDescription) {
        this.courseName = courseName;
        this.dateOfCourse = dateOfCourse;
        this.courseDescription = courseDescription;
    }

    public long getId() {
        return id;
    }

    public String getCourseName() {
        return courseName;
    }

    public void setCourseName(String courseName) {
        this.courseName = courseName;
    }

    public LocalDate getDateOfCourse() {
        return dateOfCourse;
    }

    public void setDateOfCourse(LocalDate dateOfCourse) {
        this.dateOfCourse = dateOfCourse;
    }

    public String getCourseDescription() {
        return courseDescription;
    }

    public void setCourseDescription(String courseDescription) {
        this.courseDescription = courseDescription;
    }

    public EmploymentInfo getEmploymentInfo() {
        return employmentInfo;
    }

    public void setEmploymentInfo(EmploymentInfo employmentInfo) {
        this.employmentInfo = employmentInfo;
    }
}
