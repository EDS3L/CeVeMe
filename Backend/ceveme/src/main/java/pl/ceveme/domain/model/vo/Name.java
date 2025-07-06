package pl.ceveme.domain.model.vo;

import jakarta.persistence.Embeddable;

import java.util.IllegalFormatException;

@Embeddable
public record Name(String name) {


    public Name {
        validate(name);
    }

    private static void validate(String name) {
        if (name == null || name.isEmpty()) {
            throw new IllegalArgumentException("Name cannot be null or empty");
        }
        if (name.length() < 3) {
            throw new IllegalArgumentException("Name must be at least 2 characters long");
        }
        if (!name.matches("[a-zA-Z]*")) {
            throw new IllegalArgumentException("Name must contain only letters (no digits or special characters).");
        }

    }

}
