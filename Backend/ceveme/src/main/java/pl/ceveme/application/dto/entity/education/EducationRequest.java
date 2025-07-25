package pl.ceveme.application.dto.entity.education;

import java.time.LocalDate;

public record EducationRequest(
        Long id,
        String email,
        String schoolName,
        String degree,
        String fieldOfStudy,
        LocalDate startingDate,
        LocalDate endDate,
        Boolean currently
) {

    public EducationRequest {
        validate(
                schoolName,
                degree,
                fieldOfStudy,
                startingDate,
                endDate,
                currently
        );
    }

    private static void validate(
            String schoolName,
            String degree,
            String fieldOfStudy,
            LocalDate startingDate,
            LocalDate endDate,
            Boolean currently
    ) {
        if (schoolName.isBlank()) throw new IllegalArgumentException("School name cannot be null or blank!");
        if (degree.isBlank()) throw new IllegalArgumentException("Degree cannot be null or blank!");
        if (fieldOfStudy.isBlank()) throw new IllegalArgumentException("Field of study cannot be null or blank!");
        if (startingDate == null) throw new IllegalArgumentException("Starting date cannot be null!");

        if (currently == Boolean.TRUE && endDate != null)
            throw new IllegalArgumentException("End date cannot be present when studies are still ongoing!");

        if (currently != Boolean.TRUE && endDate == null)
            throw new IllegalArgumentException("End date must be provided if studies are not ongoing!");

        if (endDate != null && startingDate.isAfter(endDate))
            throw new IllegalArgumentException("Starting date cannot be after end date!");
    }
}
