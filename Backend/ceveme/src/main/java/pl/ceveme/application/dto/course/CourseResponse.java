package pl.ceveme.application.dto.course;

import java.time.LocalDate;

public record CourseResponse(
        String courseName,
        LocalDate dateOfCourse,
        String message
) {
}
