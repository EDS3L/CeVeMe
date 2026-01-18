package pl.ceveme.application.dto.location;

public record FindJobsInRadiusCommand(String city, double kmDistance) {
}
