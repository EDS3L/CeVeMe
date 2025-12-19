package pl.ceveme.application.interceptor.limits;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;
import pl.ceveme.domain.model.entities.User;
import pl.ceveme.domain.model.enums.EndpointType;
import pl.ceveme.domain.services.limits.EndpointUsagesService;

import java.util.Map;

@Component
public class EndpointInterceptor implements HandlerInterceptor {

    private static final Logger log = LoggerFactory.getLogger(EndpointInterceptor.class);
    private final EndpointUsagesService endpointUsagesService;

    public EndpointInterceptor(EndpointUsagesService endpointUsagesService) {
        this.endpointUsagesService = endpointUsagesService;
    }

    private final Map<String, EndpointType> endpointMappings = Map.of(
            "/api/ai/geminiByLink", EndpointType.CV,
            "/api/ai/refinementText", EndpointType.REFINEMENT
    );
    @Override
    public boolean preHandle(HttpServletRequest request,
                             HttpServletResponse response,
                             Object handler) throws Exception {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        EndpointType endpointType = getEndpointType(request.getRequestURI());
        User currentUser = (User) authentication.getPrincipal();

        if (endpointType == null) {
            return true;
        }

        if (currentUser == null) {
            response.setStatus(HttpStatus.UNAUTHORIZED.value());
            return false;
        }

        boolean canUse = endpointUsagesService.canUseAiEndpoint(currentUser,endpointType);

        log.info("can use? {}",canUse);
        if (!canUse) {
            response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
            response.setContentType("application/json");
            response.getWriter().write(String.format(
                    "{\"error\":\"Usage limit exceeded for %s\", \"endpointType\":\"%s\"}",
                    endpointType.name(), endpointType.getCode()
            ));
            return false;
        }

        request.setAttribute("User", currentUser);
        request.setAttribute("EndpointType", endpointType);
        request.setAttribute("Endpoint", request.getRequestURI());

        return true;
    }


    @Override
    public void afterCompletion(HttpServletRequest request,
                                HttpServletResponse response,
                                Object handler, Exception ex) {

        if (response.getStatus() == 200) {
            User user = (User) request.getAttribute("User");
            EndpointType endpointType = (EndpointType) request.getAttribute("EndpointType");
            String endpoint = (String) request.getAttribute("Endpoint");

            if (user != null && endpointType != null && endpoint != null) {
                endpointUsagesService.recordUsages(user, endpointType, endpoint);
            }
        }
    }

    private EndpointType getEndpointType(String uri) {
        return endpointMappings.entrySet().stream()
                .filter(entry -> uri.startsWith(entry.getKey()))
                .map(Map.Entry::getValue)
                .findFirst()
                .orElse(null);
    }
}