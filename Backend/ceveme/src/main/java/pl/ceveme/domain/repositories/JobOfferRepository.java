package pl.ceveme.domain.repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import pl.ceveme.domain.model.entities.JobOffer;
import pl.ceveme.domain.model.entities.User;
import pl.ceveme.domain.model.vo.Email;

import java.time.LocalDate;
import java.util.Optional;

public interface JobOfferRepository extends JpaRepository<JobOffer, Long> {

    @Query("""
        select j
        from JobOffer j
        where j.dateEnding >= :today
          and (
               :q is null or :q = '' 
               or lower(j.title)           like lower(concat('%', :q, '%'))
               or lower(j.company)         like lower(concat('%', :q, '%'))
               or lower(j.location.city)   like lower(concat('%', :q, '%'))
               or lower(j.requirements)    like lower(concat('%', :q, '%'))
               or lower(j.experienceLevel) like lower(concat('%', :q, '%'))
               or lower(j.employmentType)  like lower(concat('%', :q, '%'))
          )
        """)
    Page<JobOffer> searchActive(
            @Param("today") LocalDate today,
            @Param("q") String q,
            Pageable pageable
    );


    @Query("""
        select j
        from JobOffer j
        where j.dateEnding >= :today
          and (:from is null or j.dateAdded >= :from)
          and (:to   is null or j.dateAdded <= :to)
          and (:company is null or :company = '' 
               or lower(j.company) like lower(concat('%', :company, '%')))
          and (:city    is null or :city = '' 
               or lower(j.location.city) like lower(concat('%', :city, '%')))
          and (:exp     is null or :exp = '' 
               or lower(j.experienceLevel) like lower(concat('%', :exp, '%')))
          and (:emp     is null or :emp = '' 
               or lower(j.employmentType)  like lower(concat('%', :emp, '%')))
          and (:title   is null or :title = '' 
               or lower(j.title)           like lower(concat('%', :title, '%')))
        """)
    Page<JobOffer> search(
            @Param("today")  LocalDate today,
            @Param("from")   LocalDate from,
            @Param("to")     LocalDate to,
            @Param("company") String company,
            @Param("city")    String city,
            @Param("exp")     String exp,
            @Param("emp")     String emp,
            @Param("title")   String title,
            Pageable pageable
    );

    Page<JobOffer> findByDateEndingGreaterThanEqual(LocalDate date, Pageable pageable);

    Optional<JobOffer> findByLink(String link);
}
