package pl.ceveme.domain.model.entities;

import jakarta.persistence.*;
import pl.ceveme.domain.model.enums.LimitEndpointType;
import pl.ceveme.domain.model.enums.UserRole;

@Entity
public class EndpointLimit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private UserRole role;

    @Enumerated(EnumType.STRING)
    private LimitEndpointType limitEndpointType;

    private Integer dailyLimit;
    private Integer monthlyLimit;


    public EndpointLimit(UserRole role, LimitEndpointType limitEndpointType, Integer dailyLimit, Integer monthlyLimit) {
        this.role = role;
        this.limitEndpointType = limitEndpointType;
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

    public LimitEndpointType getLimitEndpointType() {
        return limitEndpointType;
    }

    public void setLimitEndpointType(LimitEndpointType limitEndpointType) {
        this.limitEndpointType = limitEndpointType;
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
