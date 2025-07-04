package pl.ceveme.application.dto.scrap;

public record JobOfferRequest(String title, String company, String requirements, String niceToHave, String responsibilities, String experienceLevel, String message) {
}
