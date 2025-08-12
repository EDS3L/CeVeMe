package pl.ceveme.domain.repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import pl.ceveme.domain.model.entities.JobOffer;

import java.time.LocalDate;

public interface JobOfferRepository extends JpaRepository<JobOffer, Long> {

    Page<JobOffer>
    findByTitleContainingIgnoreCaseOrCompanyContainingIgnoreCaseOrLocation_CityContainingIgnoreCaseOrRequirementsContainingIgnoreCaseOrExperienceLevelContainingIgnoreCaseOrEmploymentTypeContainingIgnoreCase(
            String qTitle, String qCompany, String qCity, String qReq, String qExp, String qEmp, Pageable pageable
    );

    Page<JobOffer>
    findByDateAddedBetweenAndCompanyContainingIgnoreCaseAndLocation_CityContainingIgnoreCaseAndExperienceLevelContainingIgnoreCaseAndEmploymentTypeContainingIgnoreCaseAndTitleContainingIgnoreCase(
            LocalDate from, LocalDate to,
            String companyPart, String cityPart, String experiencePart, String employmentPart, String titlePart,
            Pageable pageable
    );
}
