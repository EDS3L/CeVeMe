package pl.ceveme.domain.model.entities;

import org.junit.jupiter.api.Test;
import pl.ceveme.domain.model.vo.Location;

import java.time.LocalDate;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.junit.jupiter.api.Assertions.*;

class JobOfferTest {

//      Pomysł na przyszłość --- robić metode tworzącą obiekt - zaoszczędza czas
    private JobOffer createSampleOffer() {
        return new JobOffer(
                "http://link", "Java Developer", "Company", "10k",
                new Location("Warsaw", "Poland"), "Java, Spring", "Docker",
                "Develop software", "Private healthcare", "Mid", "Full-time",
                LocalDate.of(2024, 1, 1), LocalDate.of(2024, 12, 31)
        );
    }

    @Test
    void should_createJobOffer_when_valuesAreCorrect() {
        // given
        Location location = new Location("Warsaw", "Poland");
        LocalDate dateAdded = LocalDate.of(2024, 1, 1);
        LocalDate dateEnding = LocalDate.of(2024, 12, 31);

        // when
        JobOffer offer = createSampleOffer();

        // then
        assertThat(offer.getLink()).isEqualTo("http://link");
        assertThat(offer.getTitle()).isEqualTo("Java Developer");
        assertThat(offer.getCompany()).isEqualTo("Company");
        assertThat(offer.getSalary()).isEqualTo("10k");
        assertThat(offer.getLocation().getCity()).isEqualTo(location.getCity());
        assertThat(offer.getRequirements()).isEqualTo("Java, Spring");
        assertThat(offer.getNiceToHave()).isEqualTo("Docker");
        assertThat(offer.getResponsibilities()).isEqualTo("Develop software");
        assertThat(offer.getBenefits()).isEqualTo("Private healthcare");
        assertThat(offer.getExperienceLevel()).isEqualTo("Mid");
        assertThat(offer.getEmploymentType()).isEqualTo("Full-time");
        assertThat(offer.getDateAdded()).isEqualTo(dateAdded);
        assertThat(offer.getDateEnding()).isEqualTo(dateEnding);
    }

    @Test
    void should_setValues_when_givenValues() {
        JobOffer offer = new JobOffer();
        offer.setTitle("Backend Developer");
        offer.setCompany("Example Corp");
        offer.setSalary("12k");

        assertEquals("Backend Developer", offer.getTitle());
        assertEquals("Example Corp", offer.getCompany());
        assertEquals("12k", offer.getSalary());
    }


    @Test
    void should_hashJobOffer_when_sameData() {
        // given
        JobOffer jobOffer1 = new JobOffer();
        JobOffer jobOffer2 = new JobOffer();
        // then
        assertEquals(jobOffer1,jobOffer2);
        assertEquals(jobOffer1.hashCode(),jobOffer2.hashCode());
    }

    @Test
    void should_notBeEqual_when_differentData() {
        // given
        JobOffer jobOffer1 = new JobOffer();
        JobOffer jobOffer2 = new JobOffer();

        // then
        jobOffer2.setTitle("Different Title");

        assertNotEquals(jobOffer1, jobOffer2);
    }


}