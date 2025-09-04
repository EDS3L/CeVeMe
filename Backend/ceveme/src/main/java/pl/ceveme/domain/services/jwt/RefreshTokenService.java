package pl.ceveme.domain.services.jwt;


import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import pl.ceveme.domain.model.entities.RefreshToken;
import pl.ceveme.domain.model.entities.User;
import pl.ceveme.domain.repositories.RefreshTokenRepository;
import pl.ceveme.infrastructure.config.jwt.JwtService;

import java.time.Instant;
import java.util.UUID;


@Service
@Transactional
public class RefreshTokenService {

    private final ExpiredTokenCleanerService expiredTokenCleanerService;
    private final RefreshTokenRepository refreshTokenRepository;
    private final JwtService jwtService;

    public RefreshTokenService(ExpiredTokenCleanerService expiredTokenCleanerService, RefreshTokenRepository refreshTokenRepository, JwtService jwtService) {
        this.expiredTokenCleanerService = expiredTokenCleanerService;
        this.refreshTokenRepository = refreshTokenRepository;
        this.jwtService = jwtService;
    }

    public String createRefreshToken(User user, String deviceInfo) {

        long tokenCount = refreshTokenRepository.countByUser(user);
        if (tokenCount >= 3) {
            throw new IllegalArgumentException("You can only use 3 device!");
        }

        String jit = UUID.randomUUID()
                .toString();
        Instant expiresAt = Instant.now()
                .plusSeconds(30L * 24 * 60 * 60);

        RefreshToken refreshToken = new RefreshToken(jit, user, expiresAt, deviceInfo);
        refreshToken.setCreatedAt(Instant.now());
        refreshTokenRepository.save(refreshToken);

        return jwtService.generateRefreshToken(user.getEmail(), jit);
    }

    public RefreshToken validRefreshToken(String token) {
        String jit = jwtService.extractJtiFromRefreshToken(token);

        RefreshToken refreshToken = refreshTokenRepository.findByJit(jit)
                .orElseThrow(() -> new IllegalArgumentException("Refresh token not found"));
        System.out.println("refresh token servicve: " + refreshToken.getExpiresAt());
        if (refreshToken.getExpiresAt()
                .isBefore(Instant.now())) {
            expiredTokenCleanerService.deleteExpiredToken(jit);
            throw new IllegalArgumentException("Refresh token expired");
        }

        refreshToken.setLastUsed(Instant.now());
        refreshTokenRepository.save(refreshToken);

        return refreshToken;
    }

    public void revokeRefreshToken(String jit) {
        refreshTokenRepository.deleteByJit(jit);

    }


}
