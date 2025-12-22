package pl.ceveme.domain.model.entities;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "passwordTokens")
public class PasswordToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "passwordTokenId")
    private Long id;
    private String token;
    private LocalDateTime expirationDate;
    private LocalDateTime lastUse;

    @OneToOne
    private User user;

    public PasswordToken() {
    }

    public PasswordToken(String token, LocalDateTime expirationDate, LocalDateTime lastUse) {
        this.token = token;
        this.expirationDate = expirationDate;
        this.lastUse = lastUse;
    }


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public LocalDateTime getLastUse() {
        return lastUse;
    }

    public void setLastUse(LocalDateTime lastUse) {
        this.lastUse = lastUse;
    }

    public LocalDateTime getExpirationDate() {
        return expirationDate;
    }

    public void setExpirationDate(LocalDateTime expirationDate) {
        this.expirationDate = expirationDate;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}
