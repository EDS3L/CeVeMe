package pl.ceveme.application.dto.employmentInfo;

import java.time.LocalDate;

public record EducationDto(
         String schoolName,
         String degree,
         String fieldOfStudy,
         LocalDate startingDate,
         LocalDate endDate,
         Boolean currently
) {
}
