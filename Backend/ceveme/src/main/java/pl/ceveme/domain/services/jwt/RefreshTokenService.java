package pl.ceveme.domain.services.jwt;


import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import pl.ceveme.domain.model.entities.RefreshToken;
import pl.ceveme.domain.model.entities.User;
import pl.ceveme.domain.repositories.RefreshTokenRepository;
import pl.ceveme.infrastructure.config.jwt.JwtService;
import pl.ceveme.infrastructure.external.scrap.nofluffjobs.NoFluffJobsScrapper;

import java.time.Instant;
import java.util.UUID;


@Service
@Transactional
public class RefreshTokenService {

    private final ExpiredTokenCleanerService expiredTokenCleanerService;
    private final RefreshTokenRepository refreshTokenRepository;
    private final JwtService jwtService;
    private static final Logger log = LoggerFactory.getLogger(RefreshTokenService.class);

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
        log.info("Token refresh for: {}  at time: {}",refreshToken.getUser().getEmail().email(), Instant.now());
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
