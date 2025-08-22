package pl.ceveme.application.dto.entity.course;

import java.time.LocalDate;

public record CourseResponse(
        Long id,
        String courseName,
        LocalDate dateOfCourse,
        String message
) {
}