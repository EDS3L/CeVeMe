package pl.ceveme.domain.model.vo;



import jakarta.persistence.Embeddable;

import java.util.IllegalFormatException;

@Embeddable
public record Email(String email) {

    public Email {
        try {
            validate(email);
        } catch (IllegalFormatException e) {
            throw new IllegalArgumentException("Invalid email: " + e.getMessage(), e);
        }
    }


    private static void validate(String value) {
        if(value == null || value.isEmpty()) {
            throw new IllegalArgumentException("Email cannot be null or empty");
        }
        if (!value.matches("[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}")) {
            throw new IllegalArgumentException("Invalid email format");
        }
    }
}
