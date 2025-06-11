package pl.ceveme.domain.model.entities;

import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(name = "cvs")
public class Cv {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private String cvImage;
    private LocalDate createdAt;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @OneToOne
    private ApplicationHistory applicationHistory;

    public Cv() {
    }

    public Cv(String cvImage, LocalDate createdAt) {
        this.cvImage = cvImage;
        this.createdAt = createdAt;
    }

    public long getId() {
        return id;
    }

    public String getCvImage() {
        return cvImage;
    }

    public void setCvImage(String cvImage) {
        this.cvImage = cvImage;
    }

    public LocalDate getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDate createdAt) {
        this.createdAt = createdAt;
    }

    public void setId(long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}
