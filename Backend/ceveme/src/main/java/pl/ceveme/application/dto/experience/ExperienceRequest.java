package pl.ceveme.application.dto.experience;

import java.util.Date;

public record ExperienceRequest(
        String email,
        String companyName,
        Date startingDate,
        Date endDate,
        Boolean currently,
        String positionName,
        String jobDescription,
        String jobAchievements
) {
}
