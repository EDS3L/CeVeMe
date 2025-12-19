package pl.ceveme.application.dto.scrap;

import pl.ceveme.domain.model.vo.Location;

import java.time.LocalDate;

public record JobOfferRequest(String title, String company, String requirements, String niceToHave,
                              String responsibilities, String experienceLevel, String salary, Location location,
                              String benefits, String employmentType, LocalDate dateAdded, LocalDate dateEnding,
                              String message) {
}

