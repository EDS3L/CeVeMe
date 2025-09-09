package pl.ceveme.infrastructure.init;

import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;
import pl.ceveme.domain.model.entities.EndpointLimit;
import pl.ceveme.domain.model.enums.EndpointType;
import pl.ceveme.domain.model.enums.UserRole;
import pl.ceveme.domain.repositories.EndpointLimitRepository;

@Component
public class ApplicationInitializer implements ApplicationRunner {

    private final EndpointLimitRepository endpointLimitRepository;

    public ApplicationInitializer(EndpointLimitRepository endpointLimitRepository) {
        this.endpointLimitRepository = endpointLimitRepository;
    }

    @Override
    public void run(ApplicationArguments args) throws Exception {
        if (endpointLimitRepository.count() == 0) {
            initializeLimits();
        }
    }

    private void initializeLimits() {
        // FREE
        createLimit(UserRole.FREE, EndpointType.CV, 5,0);
        createLimit(UserRole.FREE, EndpointType.REFINEMENT, 1,0);


        // PREMIUM
        createLimit(UserRole.PREMIUM, EndpointType.CV, 30,300);
        createLimit(UserRole.PREMIUM, EndpointType.REFINEMENT, 50,500);


        // ULTIMATE
        for (EndpointType type : EndpointType.values()) {
            createLimit(UserRole.ULTIMATE, type, -1,-1);
        }
    }

    private void createLimit(UserRole role, EndpointType type, int dailyLimit, int monthlyLimit) {
        EndpointLimit endpointLimit = new EndpointLimit();
        endpointLimit.setRole(role);
        endpointLimit.setLimitEndpointType(type);
        endpointLimit.setDailyLimit(dailyLimit);
        endpointLimit.setMonthlyLimit(monthlyLimit);
        endpointLimitRepository.save(endpointLimit);
    }
}
