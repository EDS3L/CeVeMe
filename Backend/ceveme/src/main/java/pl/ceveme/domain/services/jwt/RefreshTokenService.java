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
import java.util.Optional;
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

        Optional<RefreshToken> existingOtp = findUserDeviceRefreshToken(user, device);

        RefreshToken rt;
        if(existingOtp.isEmpty() ) {
            rt = createNewRefreshToken(user, device);
        } else {
            rt = existingOtp.get();

            if(rt.getExpiresAt().isBefore(Instant.now())) {
                rt.setJit(UUID.randomUUID().toString());
                rt.setCreatedAt(Instant.now());
            }

            rt.setLastUsed(Instant.now());

            refreshTokenRepository.save(rt);
        }

        return jwtService.generateRefreshToken(user.getEmail(),rt.getJit());


//        Optional<RefreshToken> existing = user.getRefreshTokenList()
//                .stream()
//                .filter(rt -> {
//                    Device d = rt.getDevice();
//                    return Objects.equals(d.getId(), device.getIp()) && Objects.equals(d.getDeviceType(), device.getDeviceType());
//                })
//                .findFirst();
//
//        RefreshToken rt = existing.orElseGet(() -> createNewRefreshToken(user, device));
//
//        return jwtService.generateRefreshToken(user.getEmail(), rt.getJit());

//        if (!user.getRefreshTokenList().isEmpty()) {
//            if (!isDeviceRegistered(user, device)) {
//                RefreshToken refreshToken = createNewRefreshToken(user, device);
//                return jwtService.generateRefreshToken(user.getEmail(), refreshToken.getJit());
//            }
//        } else {
//            RefreshToken refreshToken = createNewRefreshToken(user, device);
//            return jwtService.generateRefreshToken(user.getEmail(), refreshToken.getJit());
//        }
//
//        return null;
    }

    private Optional<RefreshToken> findUserDeviceRefreshToken(User user, Device newDevice) {
        return user.getRefreshTokenList()
                .stream()
                .filter(rt -> sameDevice(rt.getDevice(), newDevice))
                .findFirst();
    }


    private boolean sameDevice(Device a, Device b) {
        return Objects.equals(a.getDeviceType(), b.getDeviceType()) && Objects.equals(a.getIp(), b.getIp());
    }

    private boolean isDeviceRegistered(User user, Device newDevice) {
        for (RefreshToken rt : user.getRefreshTokenList()) {
            Device existing = rt.getDevice();
            if (Objects.equals(existing.getIp(), newDevice.getIp()) && Objects.equals(existing.getDeviceType(), newDevice.getDeviceType())) {
                return true;
            }
        }
        return false;
    }

    private RefreshToken createNewRefreshToken(User user, Device device) {
        RefreshToken refreshToken = new RefreshToken(jit, user, expiresAt, device);
        refreshToken.setCreatedAt(Instant.now());
        deviceRepository.save(device);
        return refreshTokenRepository.save(refreshToken);
    }

    public RefreshToken validRefreshToken(String token) {
        String jit = jwtService.extractJtiFromRefreshToken(token);

        RefreshToken refreshToken = refreshTokenRepository.findByJit(jit)
                .orElseThrow(() -> new IllegalArgumentException("Refresh token not found by " + jit));
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
            throw new IllegalArgumentException("You can only use " + DEVICE_LIMIT + " devices!");
        }
    }

    public void revokeRefreshToken(String jit) {
        refreshTokenRepository.deleteByJit(jit);
    }


}
