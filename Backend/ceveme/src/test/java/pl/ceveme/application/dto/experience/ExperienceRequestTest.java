package pl.ceveme.application.dto.experience;

import org.junit.jupiter.api.Test;
import pl.ceveme.application.dto.entity.experience.ExperienceRequest;

import java.time.LocalDate;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.junit.jupiter.api.Assertions.*;


class ExperienceRequestTest {


    @Test
    void should_createRequest_when_valuesAreCorrect() {
        //given

        String companyName = "Sweetgallery";
        LocalDate startingDate = LocalDate.of(2024,1,1);
        LocalDate endDate = LocalDate.of(2025,1,1);
        Boolean currently = false;
        String positionName = "java";
        String jobDescription = "java developer";
        String jobAchievement = "30% boost";

        // when

        ExperienceRequest request = new ExperienceRequest(1L,"test@wp.pl",companyName,startingDate,endDate,currently,positionName,jobDescription,jobAchievement);

        // then

        assertEquals(companyName,request.companyName());
        assertEquals(startingDate,request.startingDate());
        assertEquals(endDate,request.endDate());
        assertEquals(currently, request.currently());
        assertEquals(positionName,request.positionName());
        assertEquals(jobDescription,request.jobDescription());
        assertEquals(jobAchievement,request.jobAchievements());


    }


    @Test
    void should_throw_when_companyNameIsEmpty() {
        // given
        String companyName = "";
        LocalDate startingDate = LocalDate.of(2024,1,1);
        LocalDate endDate = LocalDate.of(2025,1,1);
        Boolean currently = false;
        String positionName = "java";
        String jobDescription = "java developer";
        String jobAchievement = "30% boost";
        // when & then

        final IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () -> new ExperienceRequest(1L,"test@wp.pl",companyName,startingDate,endDate,currently,positionName,jobDescription,jobAchievement));
        assertThat(ex.getMessage()).isEqualTo("Company name cannot be null!");
    }

    @Test
    void should_throw_when_positionNameIsEmpty() {
        // given
        String companyName = "Nice Company";
        LocalDate startingDate = LocalDate.of(2024,1,1);
        LocalDate endDate = LocalDate.of(2025,1,1);
        Boolean currently = false;
        String positionName = "";
        String jobDescription = "java developer";
        String jobAchievement = "30% boost";
        // when & then

        final IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () -> new ExperienceRequest(1L,"test@wp.pl",companyName,startingDate,endDate,currently,positionName,jobDescription,jobAchievement));
        assertThat(ex.getMessage()).isEqualTo("Position name name cannot be null!");
    }

    @Test
    void should_throw_when_jobDescriptionIsEmpty() {
        // given
        String companyName = "Nice Company";
        LocalDate startingDate = LocalDate.of(2024,1,1);
        LocalDate endDate = LocalDate.of(2025,1,1);
        Boolean currently = false;
        String positionName = "Nice position";
        String jobDescription = "";
        String jobAchievement = "30% boost";
        // when & then

        final IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () -> new ExperienceRequest(1L,"test@wp.pl",companyName,startingDate,endDate,currently,positionName,jobDescription,jobAchievement));
        assertThat(ex.getMessage()).isEqualTo("Job description cannot be null!");
    }

    @Test
    void should_throw_when_jobAchievementsIsEmpty() {
        // given
        String companyName = "Nice company";
        LocalDate startingDate = LocalDate.of(2024,1,1);
        LocalDate endDate = LocalDate.of(2025,1,1);
        Boolean currently = false;
        String positionName = "java";
        String jobDescription = "java developer";
        String jobAchievement = "";
        // when & then

        final IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () -> new ExperienceRequest(1L,"test@wp.pl",companyName,startingDate,endDate,currently,positionName,jobDescription,jobAchievement));
        assertThat(ex.getMessage()).isEqualTo("Job achievements cannot be null!");
    }
    @Test
    void should_throw_when_startingDateIsAfterEndDate() {
        // given
        String companyName = "";
        LocalDate startingDate = LocalDate.of(2026,1,1);
        LocalDate endDate = LocalDate.of(2025,1,1);
        Boolean currently = false;
        String positionName = "java";
        String jobDescription = "java developer";
        String jobAchievement = "30% boost";
        // when & then

        final IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () -> new ExperienceRequest(1L,"test@wp.pl",companyName,startingDate,endDate,currently,positionName,jobDescription,jobAchievement));
        assertThat(ex.getMessage()).isEqualTo("Company name cannot be null!");
    }
    @Test
    void should_throw_when_currentlyIsTureAndEndDateIsNotNull() {
        // given
        String companyName = "Company Name";
        LocalDate startingDate = LocalDate.of(2024,1,1);
        LocalDate endDate = LocalDate.of(2025,1,1);
        Boolean currently = true;
        String positionName = "java";
        String jobDescription = "java developer";
        String jobAchievement = "30% boost";

        // when & then

        final IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () -> new ExperienceRequest(1L,"test@wp.pl",companyName,startingDate,endDate,currently,positionName,jobDescription,jobAchievement));
        assertThat(ex.getMessage()).isEqualTo("End date cannot be present when still working!");
    }


}