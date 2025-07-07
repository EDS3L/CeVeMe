package pl.ceveme.application.dto.course;

import java.time.LocalDate;
import java.util.Date;

public record CourseRequest(
        String email,
        String courseName,
        LocalDate dateOfCourse,
        String courseDescription
) {


    public CourseRequest {
        validate(courseName,dateOfCourse,courseDescription);
    }

    private static void validate(String courseName,
                                 LocalDate dateOfCourse,
                                 String courseDescription) {

        if (courseName == null || courseName
                .isBlank()) throw new IllegalArgumentException("Name of certificate is null!");
        if (dateOfCourse == null) throw new IllegalArgumentException("Date of certificate is null");
        if (dateOfCourse
                .isAfter(LocalDate.now())) throw new IllegalArgumentException("Date cannot be after " + LocalDate.now());
        if (courseDescription == null || courseDescription
                .isBlank()) throw new IllegalArgumentException("Course description is null!");
    }
}
