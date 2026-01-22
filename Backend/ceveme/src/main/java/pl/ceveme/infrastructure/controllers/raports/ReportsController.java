package pl.ceveme.infrastructure.controllers.raports;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import pl.ceveme.application.dto.raports.*;
import pl.ceveme.application.usecase.raports.GetReportsUseCase;

import java.util.List;

@RestController
@RequestMapping("/api/reports")
public class ReportsController {

    private final GetReportsUseCase getReportsUseCase;

    public ReportsController(GetReportsUseCase getReportsUseCase) {
        this.getReportsUseCase = getReportsUseCase;
    }

    @GetMapping("/date-added")
    public ResponseEntity<List<DateAddedPerExperienceLevelResponse>> getDateAddedPerExperienceLevel(
            @RequestParam(defaultValue = "%") String experience,  @RequestParam(defaultValue = "%") String fromDate, @RequestParam(defaultValue = "%") String toDate) {
        return ResponseEntity.ok(getReportsUseCase.executeDateAddedRaport(experience,fromDate,toDate));
    }

    @GetMapping("/experience-per-city")
    public ResponseEntity<List<ExperiencePerCityResponse>> getExperiencePerCity(
            @RequestParam(defaultValue = "%") String city,
            @RequestParam(defaultValue = "%") String experience) {
        return ResponseEntity.ok(getReportsUseCase.executeExperiencePerCityRaport(city, experience));
    }

    @GetMapping("/experience-per-voivodeship")
    public ResponseEntity<List<ExperiencePerVoivodeshipResponse>> getExperiencePerVoivodeship(
            @RequestParam(defaultValue = "%") String experience,
            @RequestParam(defaultValue = "%") String voivodeship) {
        return ResponseEntity.ok(getReportsUseCase.executeExperiencePerVoivodeshipRaport(experience, voivodeship));
    }

    @GetMapping("/salary-per-city")
    public ResponseEntity<List<SalaryPerCityResponse>> getSalaryPerCity(
            @RequestParam(defaultValue = "%") String city) {
        return ResponseEntity.ok(getReportsUseCase.executeSalaryPerCityRaport(city));
    }

    @GetMapping("/salary-per-experience")
    public ResponseEntity<List<SalaryPerExperienceResponse>> getSalaryPerExperience(
            @RequestParam(defaultValue = "%") String experience) {
        return ResponseEntity.ok(getReportsUseCase.executeSalaryPerExperienceRaport(experience));
    }

    @GetMapping("/salary-per-voivodeship")
    public ResponseEntity<List<SalaryPerVoivodeshipResponse>> getSalaryPerVoivodeship(
            @RequestParam(defaultValue = "%") String voivodeship) {
        return ResponseEntity.ok(getReportsUseCase.executeSalaryPerVoivodeshipRaport(voivodeship));
    }
}
