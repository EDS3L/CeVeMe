package pl.ceveme.domain.model.vo;

import jakarta.persistence.Embeddable;

import java.util.IllegalFormatException;

@Embeddable
public record Password(String password) {

    public Password {
        try {
            validate(password);
        } catch (IllegalFormatException e) {
            throw new IllegalArgumentException("Invalid password: " + e.getMessage(), e);
        }
    }

    private static void validate(String password) {
        if (password == null || password.isEmpty()) {
            throw new IllegalArgumentException("Password cannot be null or empty");
        }
        if (password.length() < 8) {
            throw new IllegalArgumentException("Password must be at least 8 characters long");
        }
        if (!password.matches(".*[A-Z].*")) {
            throw new IllegalArgumentException("Password must contain at least one uppercase letter.");
        }
        if (!password.matches(".*[0-9].*")) {
            throw new IllegalArgumentException("Password must contain at least one digit.");
        }
        if (!password.matches(".*[\\W_].*")) {
            throw new IllegalArgumentException("Password must contain at least one special character.");
        }
    }


    public static String toString(Password password) {
        return password.toString();
    }
}
