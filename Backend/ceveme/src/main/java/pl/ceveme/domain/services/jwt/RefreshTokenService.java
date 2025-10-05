package pl.ceveme.domain.services.jwt;


import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pl.ceveme.domain.model.entities.Device;
import pl.ceveme.domain.model.entities.RefreshToken;
import pl.ceveme.domain.model.entities.User;
import pl.ceveme.domain.repositories.RefreshTokenRepository;
import pl.ceveme.domain.services.device.DeviceService;
import pl.ceveme.infrastructure.config.jwt.JwtService;

import java.time.Instant;
import java.util.List;
import java.util.UUID;


@Service
@Transactional
public class RefreshTokenService {

    private static final Logger log = LoggerFactory.getLogger(RefreshTokenService.class);
    private final ExpiredTokenCleanerService expiredTokenCleanerService;
    private final RefreshTokenRepository refreshTokenRepository;
    private final JwtService jwtService;
    private final DeviceService deviceService;

    private final String jit = UUID.randomUUID()
            .toString();
    private final Instant expiresAt = Instant.now()
            .plusSeconds(30L * 24 * 60 * 60);


    public RefreshTokenService(ExpiredTokenCleanerService expiredTokenCleanerService, RefreshTokenRepository refreshTokenRepository, JwtService jwtService, DeviceService deviceService) {
        this.expiredTokenCleanerService = expiredTokenCleanerService;
        this.refreshTokenRepository = refreshTokenRepository;
        this.jwtService = jwtService;
        this.deviceService = deviceService;
    }

    public String createRefreshToken(User user, HttpServletRequest request) {

        checkDeviceLimit(user);

        Device device = deviceService.getDeviceInformation(request);

        if (checkingToCreateAnAdditionalDevice(user, device.getIp())) {
            RefreshToken refreshToken = new RefreshToken(jit, user, expiresAt, device);
            refreshToken.setCreatedAt(Instant.now());
            refreshToken.setDevice(device);
            refreshTokenRepository.save(refreshToken);
        }

        return jwtService.generateRefreshToken(user.getEmail(), jit);
    }

    public RefreshToken validRefreshToken(String token) {
        String jit = jwtService.extractJtiFromRefreshToken(token);

        RefreshToken refreshToken = refreshTokenRepository.findByJit(jit)
                .orElseThrow(() -> new IllegalArgumentException("Refresh token not found"));
        log.info("Token refresh for: {}  at time: {}", refreshToken.getUser()
                .getEmail()
                .email(), Instant.now());
        if (refreshToken.getExpiresAt()
                .isBefore(Instant.now())) {
            expiredTokenCleanerService.deleteExpiredToken(jit);
            throw new IllegalArgumentException("Refresh token expired");
        }

        refreshToken.setLastUsed(Instant.now());
        refreshTokenRepository.save(refreshToken);

        return refreshToken;
    }

    private boolean checkingToCreateAnAdditionalDevice(User user, String ip) {
        List<RefreshToken> refreshTokens = user.getRefreshTokenList();
        if (refreshTokens.isEmpty()) return true;

        boolean deviceExists = refreshTokens.stream()
                .anyMatch(token -> token.getDevice()
                        .getIp()
                        .equals(ip));

        return !deviceExists;
    }

    private void checkDeviceLimit(User user) {
        long tokenCount = refreshTokenRepository.countByUser(user);
        int DEVICE_LIMIT = 4;
        if (tokenCount >= DEVICE_LIMIT) {
            throw new IllegalArgumentException("You can only use "+ DEVICE_LIMIT + " device!");
        }
    }

    public void revokeRefreshToken(String jit) {
        refreshTokenRepository.deleteByJit(jit);
    }


}
