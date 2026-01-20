package pl.ceveme.application.usecase.raports;

import org.springframework.stereotype.Service;
import pl.ceveme.application.dto.raports.*;
import pl.ceveme.application.port.in.DateAddedPerExperienceLevel;
import pl.ceveme.application.port.in.ExperiencePerCity;
import pl.ceveme.application.port.in.ExperiencePerVoivodeship;
import pl.ceveme.domain.repositories.JobOfferRepository;

import java.util.List;

@Service
public class GetReportsUseCase {

    private final JobOfferRepository jobOfferRepository;

    public GetReportsUseCase(JobOfferRepository jobOfferRepository) {
        this.jobOfferRepository = jobOfferRepository;
    }

    public List<DateAddedPerExperienceLevelResponse> executeDateAddedRaport(String experience) {
        return jobOfferRepository.getDateAddedPerExperienceLevel(experience)
                .stream()
                .map(p -> new DateAddedPerExperienceLevelResponse(
                        p.getDateAdded(),
                        p.getExperienceLevel(),
                        p.getOfferCount()))
                .toList();
    }

    public List<ExperiencePerCityResponse> executeExperiencePerCityRaport(String city, String experience) {
        return jobOfferRepository.getExperiencePerCity(city, experience)
                .stream()
                .map(p -> new ExperiencePerCityResponse(
                        p.getExperienceLevel(),
                        p.getSalary(),
                        p.getCityCount()))
                .toList();
    }

    public List<ExperiencePerVoivodeshipResponse> executeExperiencePerVoivodeshipRaport(String experience, String voivodeship) {
        return jobOfferRepository.getExperiencePerVoivodeship(experience, voivodeship)
                .stream()
                .map(p -> new ExperiencePerVoivodeshipResponse(
                        p.getExperienceLevel(),
                        p.getVoivodeship(),
                        p.getExperienceCount()))
                .toList();
    }

    public List<SalaryPerCityResponse> executeSalaryPerCityRaport(String city) {
        return jobOfferRepository.getSalaryPerCity(city)
                .stream()
                .map(p -> new SalaryPerCityResponse(
                        p.getSalary(),
                        p.getCity(),
                        p.getCityCount()))
                .toList();
    }

    public List<SalaryPerExperienceResponse> executeSalaryPerExperienceRaport(String experience) {
        return jobOfferRepository.getSalaryPerExperience(experience)
                .stream()
                .map(p -> new SalaryPerExperienceResponse(
                        p.getSalary(),
                        p.getExperienceLevel()))
                .toList();
    }

    public List<SalaryPerVoivodeshipResponse> executeSalaryPerVoivodeshipRaport(String voivodeship) {
        return jobOfferRepository.getSalaryPerVoivodeship(voivodeship)
                .stream()
                .map(p -> new SalaryPerVoivodeshipResponse(
                        p.getSalary(),
                        p.getVoivodeship()))
                .toList();
    }
}
