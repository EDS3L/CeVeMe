package pl.ceveme.domain.services.limits;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pl.ceveme.application.dto.gemini.TimeoutResponse;
import pl.ceveme.domain.model.entities.LimitUsage;
import pl.ceveme.domain.model.entities.User;
import pl.ceveme.domain.model.enums.EndpointType;
import pl.ceveme.domain.repositories.UserRepository;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class CheckTimeout {

    private static final Logger log = LoggerFactory.getLogger(CheckTimeout.class);
    private final UserRepository userRepository;

    public CheckTimeout(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public boolean isTimeoutStillActive(Long userId, EndpointType endpointType) {
        if(endpointType.equals(EndpointType.REFINEMENT)) return lastUsageEndpointTime(userId, endpointType).plusMinutes(2).isBefore(LocalDateTime.now());
        return  lastUsageEndpointTime(userId, endpointType).plusMinutes(1).isBefore(LocalDateTime.now());

    }


    public TimeoutResponse checkTimeoutRemainingTime(Long userId, EndpointType endpointType) {

        if(lastUsageEndpointTime(userId,endpointType).isBefore(LocalDateTime.now())) {
            return new TimeoutResponse("Time to next use", timeLeft(userId,endpointType).toSeconds(), endpointType);
        }
        return null;
    }

    public Duration timeLeft(Long userId, EndpointType endpointType) {
        Duration window = endpointType == EndpointType.REFINEMENT
                ? Duration.ofMinutes(2)
                : Duration.ofMinutes(5);

        LocalDateTime last = lastUsageEndpointTime(userId, endpointType);
        LocalDateTime now  = LocalDateTime.now();

        Duration elapsed   = Duration.between(last, now);
        Duration remaining = window.minus(elapsed);
        return remaining.isNegative() ? Duration.ZERO : remaining;
    }

//    private LocalDateTime lastUsageEndpointTime(Long userId, EndpointType endpointType) {
//        User user = userRepository.findById(userId)
//                .orElseThrow(() -> new IllegalArgumentException("User with id " + userId + " not found"));
//
//        if(user.getLimitUsages() == null) return LocalDateTime.now();
//
//        return user.getLimitUsages().stream().filter(el -> el.getEndpointType().equals(endpointType)).toList().getLast().getTimestamp();
//    }

    //TODO poprawic dwa ify (zwracamy czas now() a musi byc minimum 2 minuty do tylu zeby dzialalo dobrze)
    private LocalDateTime lastUsageEndpointTime(Long userId, EndpointType endpointType) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User with id " + userId + " not found"));

        if(user.getLimitUsages() == null) return LocalDateTime.now().minusMinutes(5);

        List<LimitUsage> usages = user.getLimitUsages().stream().filter(el -> el.getEndpointType().equals(endpointType)).toList();
        if(usages.isEmpty()) {
            return  LocalDateTime.now().minusMinutes(5);
        }
        return usages.getLast().getTimestamp();
    }
}
