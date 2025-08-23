package pl.ceveme.application.dto.entity.experience;

public record ExperienceResponse(
        Long id,
        String companyName,
        String positionName,
        String message
) {
}
