package pl.ceveme.application.dto.course;

import java.time.LocalDate;

public record CourseRequest(
        String email,
        String courseName,
        LocalDate dateOfCourse,
        String courseDescription
) {
}
