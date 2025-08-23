package pl.ceveme.domain.repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import pl.ceveme.domain.model.entities.JobOffer;

import java.time.LocalDate;

public interface JobOfferRepository extends JpaRepository<JobOffer, Long> {

    Page<JobOffer>
            findByDateEndingGreaterThanEqualAndTitleContainingIgnoreCaseOrDateEndingGreaterThanEqualAndCompanyContainingIgnoreCaseOrDateEndingGreaterThanEqualAndLocation_CityContainingIgnoreCaseOrDateEndingGreaterThanEqualAndRequirementsContainingIgnoreCaseOrDateEndingGreaterThanEqualAndExperienceLevelContainingIgnoreCaseOrDateEndingGreaterThanEqualAndEmploymentTypeContainingIgnoreCase(
            LocalDate today1, String qTitle,
            LocalDate today2, String qCompany,
            LocalDate today3, String qCity,
            LocalDate today4, String qReq,
            LocalDate today5, String qExp,
            LocalDate today6, String qEmp,
            Pageable pageable
    );


    Page<JobOffer>
    findByDateEndingGreaterThanEqualAndDateAddedBetweenAndCompanyContainingIgnoreCaseAndLocation_CityContainingIgnoreCaseAndExperienceLevelContainingIgnoreCaseAndEmploymentTypeContainingIgnoreCaseAndTitleContainingIgnoreCase(
            LocalDate today,
            LocalDate from, LocalDate to,
            String companyPart, String cityPart, String experiencePart, String employmentPart, String titlePart,
            Pageable pageable
    );

    Page<JobOffer> findByDateEndingGreaterThanEqual(LocalDate date, Pageable pageable);
}
