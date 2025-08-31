package pl.ceveme.domain.model.entities;


import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(name = "applicationHistories")
public class ApplicationHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @OneToOne
    private JobOffer jobOffer;
    private LocalDate applicationDate;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @OneToOne
    private Cv cv;

    @Enumerated(EnumType.STRING)
    private STATUS status;

    public ApplicationHistory() {
    }


    public ApplicationHistory(JobOffer jobOffer, LocalDate applicationDate, User user, Cv cv, STATUS status) {
        this.jobOffer = jobOffer;
        this.applicationDate = applicationDate;
        this.user = user;
        this.cv = cv;
        this.status = status;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public JobOffer getJobOffer() {
        return jobOffer;
    }

    public void setJobOffer(JobOffer jobOffer) {
        this.jobOffer = jobOffer;
    }

    public LocalDate getApplicationDate() {
        return applicationDate;
    }

    public void setApplicationDate(LocalDate applicationDate) {
        this.applicationDate = applicationDate;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Cv getCv() {
        return cv;
    }

    public void setCv(Cv cv) {
        this.cv = cv;
    }

    public STATUS getStatus() {
        return status;
    }

    public void setStatus(STATUS status) {
        this.status = status;
    }

    public enum STATUS {
        PENDING, SUBMITTED, REJECTED, REQUESTED, SCREENING, INTERVIEW, ASSIGNMENT, OFFERED, ACCEPTED, DECLINED, CLOSED,
    }
}
