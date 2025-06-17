package pl.ceveme.domain.model.entities;


import jakarta.persistence.*;
import pl.ceveme.domain.model.vo.Location;

import java.time.LocalDate;

@Entity
@Table(name = "jobOffers")
public class JobOffer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String link;

    private String title;

    private String company;

    private String salary;

    @Embedded
    private Location location;

    @Lob
    private String requirements;

    @Lob
    private String niceToHave;

    @Lob
    private String responsibilities;

    @Lob
    private String benefits;

    private String experienceLevel;

    private String employmentType;

    private LocalDate dateAdded;

    private LocalDate dateEnding;

    public JobOffer() {
    }

    public JobOffer(String link, String title, String company, String salary, Location location, String requirements, String niceToHave, String responsibilities, String benefits, String experienceLevel, String employmentType, LocalDate dateAdded, LocalDate dateEnding) {
        this.link = link;
        this.title = title;
        this.company = company;
        this.salary = salary;
        this.location = location;
        this.requirements = requirements;
        this.niceToHave = niceToHave;
        this.responsibilities = responsibilities;
        this.benefits = benefits;
        this.experienceLevel = experienceLevel;
        this.employmentType = employmentType;
        this.dateAdded = dateAdded;
        this.dateEnding = dateEnding;
    }

    public Long getId() {
        return id;
    }

    public String getLink() {
        return link;
    }

    public void setLink(String link) {
        this.link = link;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getCompany() {
        return company;
    }

    public void setCompany(String company) {
        this.company = company;
    }

    public String getSalary() {
        return salary;
    }

    public void setSalary(String salary) {
        this.salary = salary;
    }

    public Location getLocation() {
        return location;
    }

    public void setLocation(Location location) {
        this.location = location;
    }

    public String getRequirements() {
        return requirements;
    }

    public void setRequirements(String requirements) {
        this.requirements = requirements;
    }

    public String getNiceToHave() {
        return niceToHave;
    }

    public void setNiceToHave(String niceToHave) {
        this.niceToHave = niceToHave;
    }

    public String getResponsibilities() {
        return responsibilities;
    }

    public void setResponsibilities(String responsibilities) {
        this.responsibilities = responsibilities;
    }

    public String getBenefits() {
        return benefits;
    }

    public void setBenefits(String benefits) {
        this.benefits = benefits;
    }

    public String getExperienceLevel() {
        return experienceLevel;
    }

    public void setExperienceLevel(String experienceLevel) {
        this.experienceLevel = experienceLevel;
    }

    public String getEmploymentType() {
        return employmentType;
    }

    public void setEmploymentType(String employmentType) {
        this.employmentType = employmentType;
    }

    public LocalDate getDateAdded() {
        return dateAdded;
    }

    public void setDateAdded(LocalDate dateAdded) {
        this.dateAdded = dateAdded;
    }

    public LocalDate getDateEnding() {
        return dateEnding;
    }

    public void setDateEnding(LocalDate dateEnding) {
        this.dateEnding = dateEnding;
    }

    @Override
    public String toString() {
        return super.toString();
    }

}
