package pl.ceveme.domain.model.entities;

import jakarta.persistence.*;
import pl.ceveme.domain.model.enums.EndpointType;
import pl.ceveme.domain.model.enums.UserRole;

@Entity
public class EndpointLimit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private UserRole role;

    @Enumerated(EnumType.STRING)
    private EndpointType endpointType;

    private Integer dailyLimit;
    private Integer monthlyLimit;


    public EndpointLimit() {
    }

    public EndpointLimit(UserRole role, EndpointType endpointType, Integer dailyLimit, Integer monthlyLimit) {
        this.role = role;
        this.endpointType = endpointType;
        this.dailyLimit = dailyLimit;
        this.monthlyLimit = monthlyLimit;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public UserRole getRole() {
        return role;
    }

    public void setRole(UserRole role) {
        this.role = role;
    }

    public EndpointType getLimitEndpointType() {
        return endpointType;
    }

    public void setLimitEndpointType(EndpointType endpointType) {
        this.endpointType = endpointType;
    }

    public Integer getDailyLimit() {
        return dailyLimit;
    }

    public void setDailyLimit(Integer dailyLimit) {
        this.dailyLimit = dailyLimit;
    }

    public Integer getMonthlyLimit() {
        return monthlyLimit;
    }

    public void setMonthlyLimit(Integer monthlyLimit) {
        this.monthlyLimit = monthlyLimit;
    }
}
