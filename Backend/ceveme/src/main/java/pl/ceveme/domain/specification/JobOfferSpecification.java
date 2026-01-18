package pl.ceveme.domain.specification;

import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import org.springframework.data.jpa.domain.Specification;
import pl.ceveme.application.dto.jobOffer.JobSearchCriteria;
import pl.ceveme.application.dto.location.BoundingBox;
import pl.ceveme.application.dto.location.LocationResponse;
import pl.ceveme.application.usecase.location.GeoUtils;
import pl.ceveme.domain.model.entities.JobOffer;
import pl.ceveme.domain.model.enums.SalaryType;
import pl.ceveme.infrastructure.external.location.OpenStreetMapImpl;

import java.io.IOException;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class JobOfferSpecification {



    public static Specification<JobOffer> buildSpecification(JobSearchCriteria criteria, OpenStreetMapImpl openStreetMap) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            predicates.add(cb.greaterThanOrEqualTo(root.get("dateEnding"), LocalDate.now()));

            if (hasText(criteria.getQ())) {
                predicates.add(buildFullTextSearch(criteria.getQ(), root, cb));
            }

            if (hasText(criteria.getCompany())) {
                predicates.add(cb.like(cb.lower(root.get("company")), "%" + criteria.getCompany().toLowerCase() + "%"));
            }

            if (hasText(criteria.getCity())) {
                predicates.add(cb.like(cb.lower(root.get("location").get("city")),
                        "%" + criteria.getCity().toLowerCase() + "%"));
            }

            if (hasText(criteria.getExperienceLevel())) {
                predicates.add(cb.like(cb.lower(root.get("experienceLevel")),
                        "%" + criteria.getExperienceLevel().toLowerCase() + "%"));
            }

            if (hasText(criteria.getEmploymentType())) {
                predicates.add(cb.like(cb.lower(root.get("employmentType")),
                        "%" + criteria.getEmploymentType().toLowerCase() + "%"));
            }

            if (hasText(criteria.getTitle())) {
                predicates.add(cb.like(cb.lower(root.get("title")), "%" + criteria.getTitle().toLowerCase() + "%"));
            }

            if (criteria.getDateAddedFrom() != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("dateAdded"), criteria.getDateAddedFrom()));
            }

            if (criteria.getDateAddedTo() != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("dateAdded"), criteria.getDateAddedTo()));
            }

            if (criteria.getSkills() != null && !criteria.getSkills().isEmpty()) {
                predicates.add(buildSkillsSearch(criteria.getSkills(), root, cb));
            }

            if (hasText(criteria.getLocationCity()) && criteria.getRadiusKm() != null) {
                try {
                    predicates.add(buildLocationRadiusSearch(criteria.getLocationCity(),criteria.getRadiusKm(),root,cb,openStreetMap));
                } catch (IOException | InterruptedException e) {
                    throw new RuntimeException(e);
                }
            }

            // Salary filtering
            if (criteria.getSalaryMin() != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("salaryMin"), criteria.getSalaryMin().doubleValue()));
            }

            if (criteria.getSalaryMax() != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("salaryMax"), criteria.getSalaryMax().doubleValue()));
            }

            if (hasText(criteria.getSalaryType())) {
                try {
                    SalaryType salaryType = SalaryType.valueOf(criteria.getSalaryType().toUpperCase());
                    predicates.add(cb.equal(root.get("salaryType"), salaryType));
                } catch (IllegalArgumentException e) {
                    // Invalid salary type - ignore this filter
                }
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }

    public static Predicate buildLocationRadiusSearch(String city, Double radiusKm, Root<JobOffer> root, CriteriaBuilder cb, OpenStreetMapImpl openStreetMap) throws IOException, InterruptedException {
        LocationResponse location = openStreetMap.findByCityName(city);
        BoundingBox box = GeoUtils.calculateBoundingBox(location.latitude(), location.longitude(), radiusKm);

        return cb.and(cb.isNotNull(root.get("location")),
                cb.between(root.get("location").get("latitude"), box.minLat(), box.maxLat()),
                cb.between(root.get("location").get("longitude"), box.minLon(), box.maxLon()));
    }

    private static Predicate buildFullTextSearch(String query, Root<JobOffer> root, CriteriaBuilder cb) {
        String[] keywords = Arrays.stream(query.toLowerCase().split("\\s+")).filter(k -> !k.isEmpty()).toArray(String[]::new);

        if (keywords.length == 0) {
            return cb.conjunction();
        }

        List<Predicate> keywordPredicates = new ArrayList<>();

        for (String keyword : keywords) {
            String pattern = "%" + keyword + "%";
            List<Predicate> fieldPredicates = new ArrayList<>();

            fieldPredicates.add(cb.like(cb.lower(root.get("title")), pattern));
            fieldPredicates.add(cb.like(cb.lower(root.get("company")), pattern));
            fieldPredicates.add(cb.like(cb.lower(root.get("location").get("city")), pattern));
            fieldPredicates.add(cb.like(cb.lower(root.get("requirements")), pattern));
            fieldPredicates.add(cb.like(cb.lower(root.get("experienceLevel")), pattern));
            fieldPredicates.add(cb.like(cb.lower(root.get("employmentType")), pattern));

            keywordPredicates.add(cb.or(fieldPredicates.toArray(new Predicate[0])));
        }

        return cb.and(keywordPredicates.toArray(new Predicate[0]));
    }

    private static Predicate buildSkillsSearch(List<String> skills, Root<JobOffer> root, CriteriaBuilder cb) {
        List<Predicate> skillPredicates = new ArrayList<>();

        for (String skill : skills) {
            String pattern = "%" + skill.toLowerCase() + "%";
            skillPredicates.add(cb.like(cb.lower(root.get("requirements")), pattern));
        }

        return cb.and(skillPredicates.toArray(new Predicate[0]));
    }

    private static boolean hasText(String str) {
        return str != null && !str.trim().isEmpty();
    }
}
