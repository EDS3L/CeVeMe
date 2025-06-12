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

    @OneToOne
    private JobOffer jobOffer;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @OneToOne
    private ApplicationHistory applicationHistory;

    public Cv() {
    }

    public Cv(String cvImage, LocalDate createdAt, JobOffer jobOffer, User user, ApplicationHistory applicationHistory) {
        this.cvImage = cvImage;
        this.createdAt = createdAt;
        this.jobOffer = jobOffer;
        this.user = user;
        this.applicationHistory = applicationHistory;
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

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public JobOffer getJobOffer() {
        return jobOffer;
    }

    public void setJobOffer(JobOffer jobOffer) {
        this.jobOffer = jobOffer;
    }

    public ApplicationHistory getApplicationHistory() {
        return applicationHistory;
    }

    public void setApplicationHistory(ApplicationHistory applicationHistory) {
        this.applicationHistory = applicationHistory;
    }
}
