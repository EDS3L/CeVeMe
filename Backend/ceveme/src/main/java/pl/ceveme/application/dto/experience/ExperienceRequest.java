package pl.ceveme.application.dto.experience;

import java.time.LocalDate;


public record ExperienceRequest(
        String email,
        String companyName,
        LocalDate startingDate,
        LocalDate endDate,
        Boolean currently,
        String positionName,
        String jobDescription,
        String jobAchievements
) {


    public ExperienceRequest {
        validate( companyName,
                                  startingDate,
                                  endDate,
                                  currently,
                                  positionName,
                                  jobDescription,
                                  jobAchievements);
    }

    private static void validate(String companyName,
                                 LocalDate startingDate,
                                 LocalDate endDate,
                                 Boolean currently,
                                 String positionName,
                                 String jobDescription,
                                 String jobAchievements) {

        if(companyName.isBlank()) throw new IllegalArgumentException("Company name cannot be null!");
        if(positionName.isBlank()) throw new IllegalArgumentException("Position name name cannot be null!");
        if(jobDescription.isBlank()) throw new IllegalArgumentException("Job description cannot be null!");
        if(jobAchievements.isBlank()) throw new IllegalArgumentException("Job achievements cannot be null!");
        if(startingDate.isAfter(endDate)) throw new IllegalArgumentException("Starting date cannot be after end date!");
        if(currently == true && endDate != null)  throw new IllegalArgumentException("End date cannot be present when still working!");

    }
}
