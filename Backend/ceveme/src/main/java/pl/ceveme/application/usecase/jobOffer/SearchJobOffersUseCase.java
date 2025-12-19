package pl.ceveme.application.usecase.jobOffer;

import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import pl.ceveme.domain.model.entities.JobOffer;
import pl.ceveme.domain.repositories.JobOfferRepository;
import pl.ceveme.domain.services.jobOffer.SalaryInfo;
import pl.ceveme.domain.services.jobOffer.SalaryParser;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class SearchJobOffersUseCase {

    private final JobOfferRepository jobOfferRepository;
    private final SalaryParser salaryParser;

    public SearchJobOffersUseCase(JobOfferRepository jobOfferRepository, SalaryParser salaryParser) {
        this.jobOfferRepository = jobOfferRepository;
        this.salaryParser = salaryParser;
    }

    public Page<JobOffer> search(String q, int pageNumber, int size, String sort) {
        Pageable pageable = PageRequest.of(Math.max(0, pageNumber - 1), normalizeSize(size), mapSort(sort));
        LocalDate today = LocalDate.now();
        String qq = def(q);
        if (qq.isEmpty()) {
            return jobOfferRepository.findAll(activeSpec(today), pageable);
        }
        String[] keywords = Arrays.stream(qq.toLowerCase().split("\\s+")).filter(k -> !k.isEmpty()).toArray(String[]::new);
        if (keywords.length == 0) {
            return jobOfferRepository.findAll(activeSpec(today), pageable);
        }
        return jobOfferRepository.findAll(activeWithKeywordsSpec(today, Arrays.asList(keywords)), pageable);
    }

    public Page<JobOffer> searchBy(
            String company, String city, String experienceLevel, String employmentType, String title,
            LocalDate dateAddedFrom, LocalDate dateAddedTo,
            int pageNumber, int size, String sort
    ) {
        Pageable pageable = PageRequest.of(Math.max(0, pageNumber - 1), normalizeSize(size), mapSort(sort));
        LocalDate from = dateAddedFrom != null ? dateAddedFrom : LocalDate.of(1970, 1, 1);
        LocalDate to = dateAddedTo != null ? dateAddedTo : LocalDate.of(2100, 12, 31);
        LocalDate today = LocalDate.now();
        return jobOfferRepository.findAll(filterSpec(today, from, to, def(company), def(city), def(experienceLevel), def(employmentType), def(title)), pageable);
    }

    private Specification<JobOffer> activeSpec(LocalDate today) {
        return (root, query, cb) -> cb.greaterThanOrEqualTo(root.get("dateEnding"), today);
    }

    private Specification<JobOffer> activeWithKeywordsSpec(LocalDate today, List<String> keywords) {
        return (root, query, cb) -> {
            List<Predicate> ands = new ArrayList<>();
            ands.add(cb.greaterThanOrEqualTo(root.get("dateEnding"), today));
            Join<Object, Object> loc = root.join("location", JoinType.LEFT);
            for (String kw : keywords) {
                String like = "%" + kw + "%";
                List<Predicate> ors = new ArrayList<>();
                ors.add(cb.like(cb.lower(root.get("title")), like));
                ors.add(cb.like(cb.lower(root.get("company")), like));
                ors.add(cb.like(cb.lower(loc.get("city")), like));
                ors.add(cb.like(cb.lower(root.get("requirements")), like));
                ors.add(cb.like(cb.lower(root.get("experienceLevel")), like));
                ors.add(cb.like(cb.lower(root.get("employmentType")), like));
                ands.add(cb.or(ors.toArray(new Predicate[0])));
            }
            return cb.and(ands.toArray(new Predicate[0]));
        };
    }

    private Specification<JobOffer> filterSpec(LocalDate today, LocalDate from, LocalDate to, String company, String city, String exp, String emp, String title) {
        return (root, query, cb) -> {
            List<Predicate> ands = new ArrayList<>();
            ands.add(cb.greaterThanOrEqualTo(root.get("dateEnding"), today));
            ands.add(cb.greaterThanOrEqualTo(root.get("dateAdded"), from));
            ands.add(cb.lessThanOrEqualTo(root.get("dateAdded"), to));
            Join<Object, Object> loc = root.join("location", JoinType.LEFT);
            if (!company.isEmpty()) ands.add(cb.like(cb.lower(root.get("company")), "%" + company.toLowerCase() + "%"));
            if (!city.isEmpty()) ands.add(cb.like(cb.lower(loc.get("city")), "%" + city.toLowerCase() + "%"));
            if (!exp.isEmpty()) ands.add(cb.like(cb.lower(root.get("experienceLevel")), "%" + exp.toLowerCase() + "%"));
            if (!emp.isEmpty()) ands.add(cb.like(cb.lower(root.get("employmentType")), "%" + emp.toLowerCase() + "%"));
            if (!title.isEmpty()) ands.add(cb.like(cb.lower(root.get("title")), "%" + title.toLowerCase() + "%"));
            return cb.and(ands.toArray(new Predicate[0]));
        };
    }

    public Page<JobOffer> orderByDateDESC(int pageNumber) {
        Pageable pageableDesc = PageRequest.of(pageNumber, 50, Sort.by("dateAdded").descending());

        return jobOfferRepository.findAllByOrderByDateAdded(LocalDate.now(),pageableDesc);
    }

    public Page<JobOffer> orderByDateASC(int pageNumber) {
        Pageable pageableAsc = PageRequest.of(pageNumber, 50, Sort.by("dateAdded").ascending());
        return jobOfferRepository.findAllByOrderByDateAdded(LocalDate.now(), pageableAsc);
    }

    public Page<JobOffer> orderBySalaryDESC(int pageNumber) {
        Pageable pageable = PageRequest.of(pageNumber, 50);
        Page<JobOffer> page = jobOfferRepository.findActive(LocalDate.now(), pageable);

        List<JobOffer> sorted = page.getContent().stream()
                .sorted(Comparator.comparing(
                        (JobOffer jo) -> {
                            SalaryInfo si = salaryParser.parse(jo.getSalary());
                            return Optional.ofNullable(si.getMinMonthlyPln())
                                    .orElse(BigDecimal.valueOf(-1));
                        },
                        Comparator.naturalOrder()
                ).reversed())
                .collect(Collectors.toList());

        return new PageImpl<>(sorted, page.getPageable(), page.getTotalElements());
    }

    public Page<JobOffer> orderBySalaryASC(int pageNumber) {
        Pageable pageable = PageRequest.of(pageNumber, 50);
        Page<JobOffer> page = jobOfferRepository.findActive(LocalDate.now(), pageable);

        List<JobOffer> sorted = page.getContent().stream()
                .sorted(Comparator.comparing(
                        (JobOffer jo) -> {
                            SalaryInfo si = salaryParser.parse(jo.getSalary());
                            return Optional.ofNullable(si.getMinMonthlyPln())
                                    .orElse(BigDecimal.valueOf(-1));
                        },
                        Comparator.naturalOrder()
                ))
                .collect(Collectors.toList());

        return new PageImpl<>(sorted, page.getPageable(), page.getTotalElements());
    }

    private int normalizeSize(int size) {
        if (size < 1) return 50;
        if (size > 200) return 200;
        return size;
    }

    private Sort mapSort(String key) {
        if (key == null) key = "newest";
        return switch (key) {
            case "newest" -> Sort.by(Sort.Order.desc("dateAdded"), Sort.Order.desc("id"));
            case "endingSoon" -> Sort.by(Sort.Order.asc("dateEnding"), Sort.Order.desc("id"));
            case "companyAsc" -> Sort.by(Sort.Order.asc("company")
                    .ignoreCase(), Sort.Order.desc("id"));
            case "titleAsc" -> Sort.by(Sort.Order.asc("title")
                    .ignoreCase(), Sort.Order.desc("id"));
            case "cityAsc" -> Sort.by(Sort.Order.asc("location.city")
                    .ignoreCase(), Sort.Order.desc("id"));
            default -> Sort.by(Sort.Order.desc("dateAdded"), Sort.Order.desc("id"));
        };
    }

    private String def(String s) {
        return (s == null) ? "" : s;
    }
}
