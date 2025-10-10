package pl.ceveme.domain.services.jwt;


import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pl.ceveme.domain.model.entities.Device;
import pl.ceveme.domain.model.entities.RefreshToken;
import pl.ceveme.domain.model.entities.User;
import pl.ceveme.domain.repositories.DeviceRepository;
import pl.ceveme.domain.repositories.RefreshTokenRepository;
import pl.ceveme.domain.services.device.DeviceService;
import pl.ceveme.infrastructure.config.jwt.JwtService;

import java.time.Instant;
import java.util.Objects;
import java.util.UUID;


@Service
@Transactional
public class RefreshTokenService {

    private static final Logger log = LoggerFactory.getLogger(RefreshTokenService.class);
    private final ExpiredTokenCleanerService expiredTokenCleanerService;
    private final RefreshTokenRepository refreshTokenRepository;
    private final JwtService jwtService;
    private final DeviceService deviceService;
    private final DeviceRepository deviceRepository;

    private final String jit = UUID.randomUUID()
            .toString();
    private final Instant expiresAt = Instant.now()
            .plusSeconds(30L * 24 * 60 * 60);

    public RefreshTokenService(ExpiredTokenCleanerService expiredTokenCleanerService, RefreshTokenRepository refreshTokenRepository, JwtService jwtService, DeviceService deviceService, DeviceRepository deviceRepository) {
        this.expiredTokenCleanerService = expiredTokenCleanerService;
        this.refreshTokenRepository = refreshTokenRepository;
        this.jwtService = jwtService;
        this.deviceService = deviceService;
        this.deviceRepository = deviceRepository;
    }

    public String createRefreshToken(User user, HttpServletRequest request) {

        checkDeviceLimit(user);

        Device device = deviceService.getDeviceInformation(request);

        if (!user.getRefreshTokenList().isEmpty()) {
            if (!isDeviceRegistered(user, device)) {
                createNewRefreshToken(user, device);
            }
        } else {
            createNewRefreshToken(user, device);
        }

        return jwtService.generateRefreshToken(user.getEmail(), jit);
    }

    private boolean isDeviceRegistered(User user, Device newDevice) {
        for (RefreshToken rt : user.getRefreshTokenList()) {
            Device existing = rt.getDevice();
            if (Objects.equals(existing.getIp(), newDevice.getIp()) &&
                    Objects.equals(existing.getDeviceType(), newDevice.getDeviceType())) {
                return true; // urządzenie już zarejestrowane
            }
        }
        return false;
    }

    private void createNewRefreshToken(User user, Device device) {
        String jit = UUID.randomUUID().toString();
        Instant expiresAt = Instant.now().plusSeconds(30L * 24 * 60 * 60);

        RefreshToken refreshToken = new RefreshToken(jit, user, expiresAt, device);
        refreshToken.setCreatedAt(Instant.now());
        deviceRepository.save(device);
        refreshTokenRepository.save(refreshToken);
        user.getRefreshTokenList().add(refreshToken);
    }

//    private void createFirstRefreshTokenForDevice(User user, Device device, RefreshToken refreshToken) {
//        refreshToken = new RefreshToken(jit, user, expiresAt, device);
//        deviceRepository.save(device);
//        refreshTokenRepository.save(refreshToken);
//    }
//
//    private void checkCurrentDevice(User user, Device device, RefreshToken refreshToken) {
//        for(RefreshToken rt : user.getRefreshTokenList()) {
//            Device userDevice = rt.getDevice();
//
//            if(!Objects.equals(userDevice.getIp(), device.getIp()) && !Objects.equals(userDevice.getDeviceType(), device.getDeviceType())) {
//                refreshToken = new RefreshToken(jit, user, expiresAt, device);
//                refreshToken.setCreatedAt(Instant.now());
//                deviceRepository.save(device);
//                refreshTokenRepository.save(rt);
//
//            }
//        }
//    }

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

    private void checkDeviceLimit(User user) {
        long tokenCount = refreshTokenRepository.countByUser(user);
        int DEVICE_LIMIT = 4;
        if (tokenCount >= DEVICE_LIMIT) {
            throw new IllegalArgumentException("You can only use "+ DEVICE_LIMIT + " devices!");
        }
    }

    public void revokeRefreshToken(String jit) {
        refreshTokenRepository.deleteByJit(jit);
    }


}
