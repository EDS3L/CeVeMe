package pl.ceveme.application.dto.employmentInfo;

import java.time.LocalDate;
import java.util.Date;

public record ExperienceDto(
        String companyName,
        LocalDate startingDate,
        LocalDate endDate,
        Boolean currently,
        String positionName,
        String jobDescription,
        String jobAchievements
) {
}