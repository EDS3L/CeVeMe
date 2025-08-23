package pl.ceveme.application.dto.user;

public record ChangePasswordRequest(String email, String newPassword, String confirmPassword) {
}
