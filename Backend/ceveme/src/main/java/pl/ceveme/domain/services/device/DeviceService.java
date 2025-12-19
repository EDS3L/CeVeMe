package pl.ceveme.domain.services.device;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Service;
import pl.ceveme.domain.model.entities.Device;

import java.time.LocalDate;

@Service
public class DeviceService {

    public Device getDeviceInformation(HttpServletRequest servletRequest) {
        String ip = getClientIpAddress(servletRequest);
        UserAgentBrowser.Browser browser = getBrowserInformation(servletRequest);
        LocalDate localDate = LocalDate.now();

        return new Device(ip, browser.name(),browser.version(), browser.deviceType(), localDate);

    }

    private UserAgentBrowser.Browser getBrowserInformation(HttpServletRequest servletRequest) {
        return UserAgentBrowser.parse(servletRequest.getHeader("User-Agent"));
    }


    private String getClientIpAddress(HttpServletRequest request) {
        String[] headersToCheck = {"X-Forwarded-For", "Proxy-Client-IP", "WL-Proxy-Client-IP", "HTTP_X_FORWARDED_FOR", "HTTP_X_FORWARDED", "HTTP_X_CLUSTER_CLIENT_IP", "HTTP_CLIENT_IP", "HTTP_FORWARDED_FOR", "HTTP_FORWARDED", "HTTP_VIA", "REMOTE_ADDR"};

        for (String header : headersToCheck) {
            String ip = request.getHeader(header);
            if (ip != null && !ip.isEmpty() && !"unknown".equalsIgnoreCase(ip)) {
                return ip.split(",")[0].trim();
            }
        }

        return request.getRemoteAddr();
    }
}
