package pl.ceveme.application.dto.auth;

public record RemindPasswordRequest(String email, String newPassword, String confirmNewPassword) {
}
