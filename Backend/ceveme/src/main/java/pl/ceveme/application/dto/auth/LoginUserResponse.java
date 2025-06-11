package pl.ceveme.application.dto.auth;

public record LoginUserResponse(Long userId, String token, String message) {
}
