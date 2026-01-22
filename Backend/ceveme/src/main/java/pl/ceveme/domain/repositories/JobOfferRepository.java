package pl.ceveme.domain.repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import pl.ceveme.application.port.in.*;
import pl.ceveme.domain.model.entities.JobOffer;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface JobOfferRepository extends JpaRepository<JobOffer, Long>, JpaSpecificationExecutor<JobOffer> {

    @Query("""
            select j
            from JobOffer j
            where j.dateEnding >= :today
              and (:q is null or :q = '' 
                   or lower(j.title) like lower(concat('%', :q, '%'))
                   or lower(j.company) like lower(concat('%', :q, '%'))
                   or lower(j.location.city) like lower(concat('%', :q, '%'))
                   or lower(j.requirements) like lower(concat('%', :q, '%'))
                   or lower(j.experienceLevel) like lower(concat('%', :q, '%'))
                   or lower(j.employmentType) like lower(concat('%', :q, '%')))
            """)
    Page<JobOffer> searchActive(@Param("today") LocalDate today, @Param("q") String q, Pageable pageable);

    @Query(value = """
            SELECT j.*
            FROM job_offer j
            LEFT JOIN location l ON j.location_id = l.id
            WHERE j.date_ending >= :today
              AND (
                SELECT COUNT(*)
                FROM (SELECT UNNEST(CAST(:keywords AS text[])) AS keyword) kw
                WHERE LOWER(j.title) LIKE LOWER('%' || kw.keyword || '%')
                   OR LOWER(j.company) LIKE LOWER('%' || kw.keyword || '%')
                   OR LOWER(l.city) LIKE LOWER('%' || kw.keyword || '%')
                   OR LOWER(j.requirements) LIKE LOWER('%' || kw.keyword || '%')
                   OR LOWER(j.experience_level) LIKE LOWER('%' || kw.keyword || '%')
                   OR LOWER(j.employment_type) LIKE LOWER('%' || kw.keyword || '%')
              ) = :keywordCount
            """, countQuery = """
            SELECT COUNT(*)
            FROM job_offer j
            LEFT JOIN location l ON j.location_id = l.id
            WHERE j.date_ending >= :today
              AND (
                SELECT COUNT(*)
                FROM (SELECT UNNEST(CAST(:keywords AS text[])) AS keyword) kw
                WHERE LOWER(j.title) LIKE LOWER('%' || kw.keyword || '%')
                   OR LOWER(j.company) LIKE LOWER('%' || kw.keyword || '%')
                   OR LOWER(l.city) LIKE LOWER('%' || kw.keyword || '%')
                   OR LOWER(j.requirements) LIKE LOWER('%' || kw.keyword || '%')
                   OR LOWER(j.experience_level) LIKE LOWER('%' || kw.keyword || '%')
                   OR LOWER(j.employment_type) LIKE LOWER('%' || kw.keyword || '%')
              ) = :keywordCount
            """, nativeQuery = true)
    Page<JobOffer> searchActiveWithKeywords(@Param("today") LocalDate today, @Param("keywords") String[] keywords, @Param("keywordCount") int keywordCount, Pageable pageable);

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
    Page<JobOffer> search(@Param("today") LocalDate today, @Param("from") LocalDate from, @Param("to") LocalDate to, @Param("company") String company, @Param("city") String city, @Param("exp") String exp, @Param("emp") String emp, @Param("title") String title, Pageable pageable);

    Page<JobOffer> findByDateEndingGreaterThanEqual(LocalDate date, Pageable pageable);

    Optional<JobOffer> findByLink(String link);

    @Query("""
            select (count(o) > 0)
            from JobOffer o
            where lower(trim(o.link)) = lower(trim(:link))
            """)
    boolean existsByLinkNormalized(@Param("link") String link);

    @Query("""
            select (count(o) > 0)
            from JobOffer o
            where lower(trim(o.title)) = lower(trim(:title))
              and lower(trim(o.company)) = lower(trim(:company))
            """)
    boolean existsByTitleAndCompanyNormalized(@Param("title") String title, @Param("company") String company);


    @Query("""
            select j
            from JobOffer j
            where j.dateEnding >= :today
            """)
    Page<JobOffer> findAllByOrderByDateAdded(@Param("today") LocalDate today, Pageable pageable);

    @Query("""
            select j
            from JobOffer j
            where j.dateEnding >= :today AND
            j.salary IS NOT NULL
            """)
    Page<JobOffer> findActive(@Param("today") LocalDate today, Pageable pageable);


    @Query("""
            SELECT j FROM JobOffer j
            WHERE j.dateEnding < :today
              AND j.location IS NOT NULL
              AND (j.location.latitude BETWEEN :minLat AND :maxLat)
              AND (j.location.longitude BETWEEN :minLon AND :maxLon)
            """)
    List<JobOffer> findAllOffersAround(@Param("minLat") double minLat, @Param("maxLat") double maxLat, @Param("minLon") double minLon, @Param("maxLon") double maxLon, @Param("today") LocalDate today);


    @Query("""
            SELECT DATE_FORMAT(jo.dateAdded, '%Y-%m') AS dateAdded,
                   jo.experienceLevel AS experienceLevel,
                   COUNT(jo.experienceLevel) AS offerCount
            FROM JobOffer jo
            WHERE jo.dateAdded IS NOT NULL
            AND jo.experienceLevel IS NOT NULL
            AND jo.experienceLevel LIKE :experienceLevel
            AND DATE_FORMAT(jo.dateAdded, '%Y-%m') BETWEEN :fromDate AND :toDate
            GROUP BY 1, 2
            HAVING COUNT(jo.experienceLevel) > 10
            """)
    List<DateAddedPerExperienceLevel> getDateAddedPerExperienceLevel(@Param("experienceLevel") String experienceLevel, @Param("fromDate") String fromDate,
                                                                     @Param("toDate") String toDate
    );

    @Query("""
            SELECT jo.location.city AS city, 
                   jo.experienceLevel AS experienceLevel, 
                   CAST(ROUND(AVG(jo.salaryMin), 2) AS double) AS salary, 
                   COUNT(jo.experienceLevel) AS cityCount
            FROM JobOffer jo
            WHERE jo.location.city IS NOT NULL
              AND jo.experienceLevel IS NOT NULL
              AND jo.location.city LIKE :city
              AND jo.experienceLevel LIKE :experienceLevel
            GROUP BY jo.location.city, jo.experienceLevel
            HAVING COUNT(jo.experienceLevel) > 15
            """)
    List<ExperiencePerCity> getExperiencePerCity(@Param("city") String city, @Param("experienceLevel") String experienceLevel);

    @Query("""
            SELECT jo.location.voivodeships AS voivodeship, 
                   jo.experienceLevel AS experienceLevel, 
                   COUNT(jo.experienceLevel) AS experienceCount
            FROM JobOffer jo
            WHERE jo.location.voivodeships IS NOT NULL
              AND jo.experienceLevel IS NOT NULL
              AND jo.experienceLevel LIKE :experienceLevel
              AND jo.location.voivodeships LIKE :voivodeships
            GROUP BY jo.location.voivodeships, jo.experienceLevel
            """)
    List<ExperiencePerVoivodeship> getExperiencePerVoivodeship(@Param("experienceLevel") String experienceLevel, @Param("voivodeships") String voivodeships);

    @Query("""
            SELECT jo.location.city AS city, 
                   CAST(ROUND(AVG(jo.salaryMin), 2) AS double) AS salary, 
                   COUNT(jo.location.city) AS cityCount
            FROM JobOffer jo
            WHERE jo.location.city IS NOT NULL
              AND jo.salaryMin IS NOT NULL
              AND jo.location.city LIKE :city
            GROUP BY jo.location.city
            HAVING COUNT(jo.location.city) > 20
            """)
    List<SalaryPerCity> getSalaryPerCity(@Param("city") String city);

    @Query("""
            SELECT jo.experienceLevel AS experienceLevel, 
                   CAST(ROUND(AVG(jo.salaryMin), 2) AS double) AS salary
            FROM JobOffer jo
            WHERE jo.experienceLevel IS NOT NULL
              AND jo.salaryMin IS NOT NULL
              AND jo.experienceLevel LIKE :experienceLevel
            GROUP BY jo.experienceLevel
            """)
    List<SalaryPerExperience> getSalaryPerExperience(@Param("experienceLevel") String experienceLevel);

    @Query("""
            SELECT jo.location.voivodeships AS voivodeship,
                   CAST(ROUND(AVG(jo.salaryMin), 2) AS double) AS salary
            FROM JobOffer jo
            WHERE jo.location.voivodeships IS NOT NULL
              AND jo.salaryMin IS NOT NULL
              AND jo.location.voivodeships LIKE :voivodeships
            GROUP BY jo.location.voivodeships
            """)
    List<SalaryPerVoivodeship> getSalaryPerVoivodeship(@Param("voivodeships") String voivodeships);

}
