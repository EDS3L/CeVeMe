package pl.ceveme.domain.model.vo;

import jakarta.persistence.Embeddable;

import java.util.IllegalFormatException;

@Embeddable
public record Surname(String surname) {

    public Surname {
        try {
            validateSurname(surname);
        } catch (IllegalFormatException e) {
            throw new IllegalArgumentException("Invalid surname: " + e.getMessage(), e);
        }
    }

    private static void validateSurname(String surname) {
        if (surname == null || surname.isEmpty()) {
            throw new IllegalArgumentException("Surname cannot be null or empty");
        }
        if (surname.length() < 2) {
            throw new IllegalArgumentException("Surname must be at least 2 characters long");
        }
        if (!surname.matches("\\p{L}+")) {
            throw new IllegalArgumentException("Surname must contain only letters (including accented letters).");
        }

    }
}
