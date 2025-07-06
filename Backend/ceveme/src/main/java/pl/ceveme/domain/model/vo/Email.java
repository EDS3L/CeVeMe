package pl.ceveme.domain.model.vo;


import jakarta.persistence.Embeddable;

@Embeddable
public record Email(String email) {

    public Email {
        validate(email);
    }


    private static void validate(String value) {
        if (value == null || value.isEmpty()) {
            throw new IllegalArgumentException("Email cannot be null or empty");
        }
        if (!value.matches("[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}")) {
            throw new IllegalArgumentException("Invalid email format");
        }
    }
}
