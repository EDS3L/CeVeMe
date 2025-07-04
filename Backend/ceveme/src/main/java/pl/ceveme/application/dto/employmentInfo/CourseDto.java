package pl.ceveme.application.dto.employmentInfo;

import java.time.LocalDate;

public record CourseDto(String courseName,
                        LocalDate dateOfCourse,
                        String courseDescription) {}
