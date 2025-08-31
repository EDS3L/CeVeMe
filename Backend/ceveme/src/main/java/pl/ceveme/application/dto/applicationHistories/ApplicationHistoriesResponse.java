package pl.ceveme.application.dto.applicationHistories;

import pl.ceveme.domain.model.entities.ApplicationHistory;

import java.time.LocalDate;

public record ApplicationHistoriesResponse(String companyName, String offerUrl, LocalDate dateOfApplication, LocalDate dateOfLastModified, String cvFile, ApplicationHistory.STATUS status, String title) {
}
