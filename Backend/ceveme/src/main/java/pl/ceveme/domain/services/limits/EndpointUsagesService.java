package pl.ceveme.domain.services.limits;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pl.ceveme.application.dto.user.UserLimitResponse;
import pl.ceveme.domain.model.entities.EndpointLimit;
import pl.ceveme.domain.model.entities.LimitUsage;
import pl.ceveme.domain.model.entities.User;
import pl.ceveme.domain.model.enums.EndpointType;
import pl.ceveme.domain.model.enums.UserRole;
import pl.ceveme.domain.repositories.EndpointLimitRepository;
import pl.ceveme.domain.repositories.LimitUsageRepository;
import pl.ceveme.domain.repositories.UserRepository;
import pl.ceveme.infrastructure.external.exception.TimeoutException;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Service
@Transactional
public class EndpointUsagesService {

    private static final Logger log = LoggerFactory.getLogger(EndpointUsagesService.class);
    private final LimitUsageRepository limitUsageRepository;
    private final EndpointLimitRepository endpointLimitRepository;
    private final UserRepository userRepository;
    private final CheckTimeout checkTimeout;

    private final LocalDateTime START_OF_DAY = LocalDate.now().atStartOfDay();
    private final LocalDateTime END_OF_DAY = LocalDate.now().atTime(23, 59, 59);
    private final LocalDateTime FIRST_DAY_OF_MONTH = LocalDate.now().withDayOfMonth(1)
            .atStartOfDay();
    private final LocalDateTime LAST_DAY_OF_MONTH = LocalDate.now().withDayOfMonth(LocalDate.now().getMonth().length(LocalDate.now().isLeapYear())).atTime(23,59,59);


    public EndpointUsagesService(LimitUsageRepository limitUsageRepository, EndpointLimitRepository endpointLimitRepository, UserRepository userRepository, CheckTimeout checkTimeout) {
        this.limitUsageRepository = limitUsageRepository;
        this.endpointLimitRepository = endpointLimitRepository;
        this.userRepository = userRepository;
        this.checkTimeout = checkTimeout;
    }

    public boolean canUseAiEndpoint(User user, EndpointType endpointType) throws TimeoutException {
        EndpointLimit endpointLimit = endpointLimitRepository.findByRoleAndEndpointType(user.getUserRole(),endpointType);

        if(endpointLimit == null) return false;
        if (endpointLimit.getDailyLimit() == -1) return true;



        Integer todayUsage = getUserUsageBetweenTime(user, endpointType, START_OF_DAY, END_OF_DAY);
        Integer monthlyUsage = getUserUsageBetweenTime(user, endpointType, FIRST_DAY_OF_MONTH, LAST_DAY_OF_MONTH);
        log.info("Today daily usages: {} out of: {}",todayUsage, endpointLimit.getDailyLimit() );
        log.info("Monthly usages: {} out of: {}",monthlyUsage, endpointLimit.getMonthlyLimit() );


        if(!checkTimeout.isTimeoutStillActive(user.getId(),endpointType)) throw new TimeoutException(checkTimeout.timeLeft(user.getId(), endpointType));

        if(endpointLimit.getRole() == UserRole.FREE) return todayUsage <= endpointLimit.getDailyLimit();

        return todayUsage <= endpointLimit.getDailyLimit() && monthlyUsage <= endpointLimit.getMonthlyLimit();
    }


    public void recordUsages(User user, EndpointType endpointType, String endpoint) {
        LimitUsage limitUsage = new LimitUsage();
        limitUsage.setUser(user);
        limitUsage.setEndpointType(endpointType);
        limitUsage.setEndpoint(endpoint);
        limitUsage.setTimestamp(LocalDateTime.now());

        limitUsageRepository.save(limitUsage);
    }

    public UserLimitResponse userLimits(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User with id " + userId + " not found"));

        if(user.getUserRole() == null) throw new IllegalArgumentException("Access decide!");

        UserRole role = user.getUserRole();

        Integer cvDailyLimit = limitUsageRepository.findDailyLimit(EndpointType.CV, role);
        Integer cvMonthlyLimit = limitUsageRepository.findMonthlyLimit(EndpointType.CV, role);
        Integer refinementDailyLimit = limitUsageRepository.findDailyLimit(EndpointType.REFINEMENT, role);
        Integer refinementMonthlyLimit = limitUsageRepository.findMonthlyLimit(EndpointType.REFINEMENT, role);


        Integer todayCvUsage = getUserUsageBetweenTime(user, EndpointType.CV, START_OF_DAY, END_OF_DAY);
        Integer monthCvUsage = getUserUsageBetweenTime(user, EndpointType.CV, FIRST_DAY_OF_MONTH, LAST_DAY_OF_MONTH);

        Integer todayRefinementUsage = getUserUsageBetweenTime(user, EndpointType.REFINEMENT, START_OF_DAY, END_OF_DAY);
        Integer monthRefinementMonthlyUsage = getUserUsageBetweenTime(user, EndpointType.REFINEMENT, FIRST_DAY_OF_MONTH, LAST_DAY_OF_MONTH);


        return new UserLimitResponse(cvDailyLimit, cvMonthlyLimit, refinementDailyLimit, refinementMonthlyLimit,todayCvUsage,monthCvUsage, todayRefinementUsage, monthRefinementMonthlyUsage, "");
    }


    private Integer getUserUsageBetweenTime(User user, EndpointType endpointType, LocalDateTime startOfDay, LocalDateTime endOfDay) {
        return limitUsageRepository.countByUserAndEndpointTypeAndTimestampBetween(
                user, endpointType, startOfDay, endOfDay
        );
    }
}
