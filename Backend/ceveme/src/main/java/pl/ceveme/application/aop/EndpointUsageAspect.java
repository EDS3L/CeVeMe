package pl.ceveme.application.aop;


import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import pl.ceveme.domain.model.entities.User;
import pl.ceveme.domain.model.enums.EndpointType;
import pl.ceveme.domain.services.limits.EndpointUsagesService;

@Aspect
@Component
public class EndpointUsageAspect {


    private static final Logger log = LoggerFactory.getLogger(EndpointUsageAspect.class);
    private final EndpointUsagesService endpointUsagesService;

    public EndpointUsageAspect(EndpointUsagesService endpointUsagesService) {
        this.endpointUsagesService = endpointUsagesService;
    }

    @Around("@annotation(checkUsage)")
    public Object checkEndpointUsage(ProceedingJoinPoint joinPoint,
                                     CheckAiEndpointUsage checkUsage) throws Throwable {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = (User) authentication.getPrincipal();
        EndpointType endpointType = checkUsage.value();

        if(currentUser.getUserRole() == null) {
            throw new IllegalArgumentException("Access denied!");
        }

        if (!endpointUsagesService.canUseAiEndpoint(currentUser, endpointType)) {
            throw new IllegalArgumentException( //todo: zrobić własny błąd
                    "Usage limit exceeded for " + endpointType.name()
            );
        }

        Object result = joinPoint.proceed();

        if (checkUsage.recordUsage()) {
            String endpointName = checkUsage.customName().isEmpty()
                    ? joinPoint.getSignature().getName()
                    : checkUsage.customName();
            endpointUsagesService.recordUsages(currentUser, endpointType, endpointName);
        }

        return result;
    }
}
