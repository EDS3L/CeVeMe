package pl.ceveme.application.usecase.devices;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pl.ceveme.domain.model.entities.Device;
import pl.ceveme.domain.model.entities.RefreshToken;
import pl.ceveme.domain.model.entities.User;
import pl.ceveme.domain.repositories.RefreshTokenRepository;
import pl.ceveme.domain.repositories.UserRepository;
import pl.ceveme.infrastructure.external.exception.UserNotFoundException;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class GetInfoAboutDevicesInSession {

    private final RefreshTokenRepository refreshTokenRepository;
    private final UserRepository userRepository;

    public GetInfoAboutDevicesInSession(RefreshTokenRepository refreshTokenRepository, UserRepository userRepository) {
        this.refreshTokenRepository = refreshTokenRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public List<Device> allDevicesInSession(Long userId) {
        if (!userRepository.existsById(userId)) {
            throw new UserNotFoundException("User not found");
        }

        return refreshTokenRepository.findDistinctDevicesByUserId(userId);
    }
}
