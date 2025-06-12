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


    public ApplicationHistory() {
    }

    public ApplicationHistory(LocalDate applicationDate, JobOffer jobOffer) {
        this.jobOffer = jobOffer;
        this.applicationDate = applicationDate;
    }

    public long getId() {
        return id;
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

    public void setId(long id) {
        this.id = id;
    }
}
