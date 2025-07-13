package pl.ceveme.application.dto.entity.education;

public record EducationResponse(
        String schoolName,
        String degree,
        String fieldOfStudy,
        String message
) {
}
