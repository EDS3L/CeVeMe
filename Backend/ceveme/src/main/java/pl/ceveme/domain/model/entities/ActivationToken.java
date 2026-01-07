package pl.ceveme.domain.model.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

import javax.annotation.Nullable;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "activationTokens")
public class ActivationToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(unique = true)
    private String uuid = UUID.randomUUID() + "";

    private LocalDate expirationDate;

    @OneToOne
    @JoinColumn(name = "user_id", unique = true)
    private User user;

    public ActivationToken() {
    }

    public ActivationToken(LocalDate expirationDate) {
        this.uuid = UUID.randomUUID() + "";
        this.expirationDate = expirationDate;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUuid() {
        return uuid;
    }

    public void setUuid(String uuid) {
        this.uuid = uuid;
    }

    public LocalDate getExpirationDate() {
        return expirationDate;
    }

    public void setExpirationDate(LocalDate expirationDate) {
        this.expirationDate = expirationDate;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public boolean isExpired() {
        return expirationDate != null && expirationDate.isBefore(LocalDate.now());
    }
}
