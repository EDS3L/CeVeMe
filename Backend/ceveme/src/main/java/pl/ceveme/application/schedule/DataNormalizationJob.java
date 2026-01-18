package pl.ceveme.application.schedule;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pl.ceveme.application.database.*;
import pl.ceveme.domain.model.entities.JobOffer;
import pl.ceveme.domain.repositories.JobOfferRepository;

import java.util.List;

@Service
public class DataNormalizationJob {

    private final JobOfferRepository jobOfferRepository;

    private final LocationNormalizer locationNormalizer = new LocationNormalizer();
    private final EmploymentNormalizer employmentNormalizer = new EmploymentNormalizer();
    private final ExperienceNormalizer experienceNormalizer = new ExperienceNormalizer();
    private final SalaryNormalizer salaryNormalizer = new SalaryNormalizer();

    public DataNormalizationJob(JobOfferRepository jobOfferRepository) {
        this.jobOfferRepository = jobOfferRepository;
    }

    @Scheduled(cron = "0 0 10 * * *")
    @Transactional
    public void overwriteData() {
        int pageSize = 1000;
        int pageNumber = 0;
        boolean hasMore = true;
        int updatedCount = 0;

        while (hasMore) {
            Page<JobOffer> page = jobOfferRepository.findAll(PageRequest.of(pageNumber, pageSize));
            List<JobOffer> batch = page.getContent();

            if (batch.isEmpty()) {
                hasMore = false;
                break;
            }

            for (JobOffer offer : batch) {

                boolean isModified = false;


                if (offer.getSalary() != null) {
                    String rawSalary = offer.getSalary(); // np. "Kontrakt B2B: 120-150 zł"
                    ParsedSalary parsed = salaryNormalizer.normalize(rawSalary);


                    boolean salaryChanged = !java.util.Objects.equals(offer.getSalaryMin(),
                            parsed.min()) || !java.util.Objects.equals(offer.getSalaryMax(),
                            parsed.max()) || !java.util.Objects.equals(offer.getSalaryCurrency(),
                            parsed.currency()) || !java.util.Objects.equals(offer.getSalaryType(), parsed.type());

                    if (salaryChanged) {
                        offer.setSalaryMin(parsed.min());
                        offer.setSalaryMax(parsed.max());
                        offer.setSalaryCurrency(parsed.currency());
                        offer.setSalaryType(parsed.type());

                        System.out.println("Salary Update ID " + offer.getId() + ": " + rawSalary + " -> " + parsed.min() + " - " + parsed.max() + " " + parsed.currency() + " [" + parsed.type() + "]");

                        isModified = true;
                    }
                }


                if (offer.getLocation() != null) {
                    String oldCity = offer.getLocation().getCity();
                    String cleanCity = locationNormalizer.normalizeCity(oldCity);
                    boolean isRemote = locationNormalizer.isRemote(oldCity);
                    if (isRemote) {
                        offer.getLocation().setCity("REMOTE");
                        isModified = true;
                    }
                    if (cleanCity != null && !cleanCity.equals(oldCity)) {
                        offer.getLocation().setCity(cleanCity);
                        isModified = true;
                    }
                }


                String oldExp = offer.getExperienceLevel();
                String cleanExp = experienceNormalizer.normalize(oldExp);

                if (!cleanExp.equals("UNKNOWN") && !cleanExp.equals(oldExp)) {
                    offer.setExperienceLevel(cleanExp);
                    isModified = true;
                }

                String oldEmp = offer.getEmploymentType();
                String cleanEmp = employmentNormalizer.normalize(oldEmp);

                if (cleanEmp != null && !cleanEmp.equals(oldEmp) && !cleanEmp.equals("OTHER")) {
                    offer.setEmploymentType(cleanEmp);
                    isModified = true;
                }

                if (isModified) {
                    updatedCount++;

                }
            }
            jobOfferRepository.saveAll(batch);

            pageNumber++;
        }

        System.out.println("Zakończono. Nadpisano rekordów: " + updatedCount);
    }
}
