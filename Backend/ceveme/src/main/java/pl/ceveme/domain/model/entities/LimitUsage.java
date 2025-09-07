package pl.ceveme.domain.model.entities;

import jakarta.persistence.*;
import pl.ceveme.domain.model.enums.LimitEndpointType;

import java.time.LocalDateTime;

@Entity
public class LimitUsage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToMany
    private User user;

    @Enumerated(EnumType.STRING)
    private LimitEndpointType limitEndpointType;

    private LocalDateTime timestamp;
    private String endpoint;

    public LimitUsage(User user, LimitEndpointType limitEndpointType, LocalDateTime timestamp, String endpoint) {
        this.user = user;
        this.limitEndpointType = limitEndpointType;
        this.timestamp = timestamp;
        this.endpoint = endpoint;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public LimitEndpointType getLimitEndpointType() {
        return limitEndpointType;
    }

    public void setLimitEndpointType(LimitEndpointType limitEndpointType) {
        this.limitEndpointType = limitEndpointType;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public String getEndpoint() {
        return endpoint;
    }

    public void setEndpoint(String endpoint) {
        this.endpoint = endpoint;
    }
}
