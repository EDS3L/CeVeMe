package pl.ceveme.domain.model.entities;

import jakarta.persistence.*;
import pl.ceveme.domain.model.enums.EndpointType;

import java.time.LocalDateTime;

@Entity
public class LimitUsage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private User user;

    @Enumerated(EnumType.STRING)
    private EndpointType endpointType;
    private LocalDateTime timestamp;
    private String endpoint;


    public LimitUsage() {
    }

    public LimitUsage(User user, EndpointType endpointType, LocalDateTime timestamp, String endpoint) {
        this.user = user;
        this.endpointType = endpointType;
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

    public EndpointType getLimitEndpointType() {
        return endpointType;
    }

    public void setLimitEndpointType(EndpointType endpointType) {
        this.endpointType = endpointType;
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
