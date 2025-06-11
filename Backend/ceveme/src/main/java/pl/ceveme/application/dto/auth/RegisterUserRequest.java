package pl.ceveme.application.dto.auth;

public record RegisterUserRequest(String name, String surname, String phoneNumber, String email, String password) {
}
