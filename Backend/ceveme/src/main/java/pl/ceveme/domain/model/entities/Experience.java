package pl.ceveme.domain.model.entities;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.util.Date;

@Entity
@Table(name = "experiences")
public class Experience {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private String companyName;
    private LocalDate startingDate;
    private LocalDate endDate;
    private Boolean currently;
    private String positionName;
    private String jobDescription;
    private String jobAchievements;

    @ManyToOne
    @JoinColumn(name = "employment_info_id")
    private EmploymentInfo employmentInfo;

    public Experience() {
    }

    public Experience(String companyName, LocalDate startingDate, LocalDate endDate, Boolean currently, String positionName, String jobDescription, String jobAchievements) {
        this.companyName = companyName;
        this.startingDate = startingDate;
        this.endDate = endDate;
        this.currently = currently;
        this.positionName = positionName;
        this.jobDescription = jobDescription;
        this.jobAchievements = jobAchievements;
    }

    public long getId() {
        return id;
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public LocalDate getStartingDate() {
        return startingDate;
    }

    public void setStartingDate(LocalDate startingDate) {
        this.startingDate = startingDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public Boolean getCurrently() {
        return currently;
    }

    public void setCurrently(Boolean currently) {
        this.currently = currently;
    }

    public String getPositionName() {
        return positionName;
    }

    public void setPositionName(String positionName) {
        this.positionName = positionName;
    }

    public String getJobDescription() {
        return jobDescription;
    }

    public void setJobDescription(String jobDescription) {
        this.jobDescription = jobDescription;
    }

    public String getJobAchievements() {
        return jobAchievements;
    }

    public void setJobAchievements(String jobAchievements) {
        this.jobAchievements = jobAchievements;
    }

    public EmploymentInfo getEmploymentInfo() {
        return employmentInfo;
    }

    public void setEmploymentInfo(EmploymentInfo employmentInfo) {
        this.employmentInfo = employmentInfo;
    }
}
