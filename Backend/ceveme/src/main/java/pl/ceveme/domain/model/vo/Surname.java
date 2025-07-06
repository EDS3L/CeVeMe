package pl.ceveme.domain.model.vo;

import jakarta.persistence.Embeddable;

@Embeddable
public record Surname(String surname) {

    public Surname {
        validateSurname(surname);
    }

    private static void validateSurname(String surname) {
        if (surname == null || surname.isEmpty()) {
            throw new IllegalArgumentException("Surname cannot be null or empty");
        }
        if (surname.length() < 3) {
            throw new IllegalArgumentException("Surname must be at least 2 characters long");
        }
        if (!surname.matches("\\p{L}+")) {
            throw new IllegalArgumentException("Surname must contain only letters (including accented letters).");
        }

    }
}
