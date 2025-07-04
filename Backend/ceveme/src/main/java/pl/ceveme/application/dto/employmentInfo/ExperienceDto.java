package pl.ceveme.application.dto.employmentInfo;

import java.util.Date;

public record ExperienceDto(String companyName,
                            Date startingDate,
                            Date endDate,
                            Boolean currently,
                            String positionName,
                            String jobDescription,
                            String jobAchievements) {}
