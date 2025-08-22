package pl.ceveme.application.dto.entity.education;

public record EducationResponse(
        Long itemId,
        String schoolName,
        String degree,
        String fieldOfStudy,
        String message
) {
}