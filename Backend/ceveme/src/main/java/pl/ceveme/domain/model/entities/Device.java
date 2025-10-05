package pl.ceveme.domain.model.entities;

import jakarta.persistence.*;
import pl.ceveme.domain.services.device.UserAgentBrowser;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "devices")
public class Device {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String ip;
    @Embedded
    private UserAgentBrowser.Browser browser;
    private LocalDate lastLogin;

    public Device() {
    }

    public Device(String ip, UserAgentBrowser.Browser browser, LocalDate lastLogin) {
        this.ip = ip;
        this.browser = browser;
        this.lastLogin = lastLogin;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getIp() {
        return ip;
    }

    public void setIp(String ip) {
        this.ip = ip;
    }

    public UserAgentBrowser.Browser getBrowser() {
        return browser;
    }

    public void setBrowser(UserAgentBrowser.Browser browser) {
        this.browser = browser;
    }

    public LocalDate getLastLogin() {
        return lastLogin;
    }

    public void setLastLogin(LocalDate lastLogin) {
        this.lastLogin = lastLogin;
    }
}
