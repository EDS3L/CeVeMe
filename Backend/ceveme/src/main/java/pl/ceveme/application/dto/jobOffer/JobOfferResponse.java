package pl.ceveme.application.dto.jobOffer;

import java.time.LocalDate;

public class JobOfferResponse {

    private Long id;
    private String title;
    private String company;
    private String city;
    private String salary;
    private String experienceLevel;
    private String employmentType;
    private LocalDate dateAdded;
    private LocalDate dateEnding;
    private String link;
    private String requirements;
    private String responsibilities;
    private String benefits;
    private String niceToHave;

    public JobOfferResponse() {
    }

    public JobOfferResponse(Long id, String title, String company, String city, String salary,
                           String experienceLevel, String employmentType, LocalDate dateAdded,
                           LocalDate dateEnding, String link, String requirements, 
                           String responsibilities, String benefits, String niceToHave) {
        this.id = id;
        this.title = title;
        this.company = company;
        this.city = city;
        this.salary = salary;
        this.experienceLevel = experienceLevel;
        this.employmentType = employmentType;
        this.dateAdded = dateAdded;
        this.dateEnding = dateEnding;
        this.link = link;
        this.requirements = requirements;
        this.responsibilities = responsibilities;
        this.benefits = benefits;
        this.niceToHave = niceToHave;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getSalary() {
        return salary;
    }

    public void setSalary(String salary) {
        this.salary = salary;
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

    public String getLink() {
        return link;
    }

    public void setLink(String link) {
        this.link = link;
    }

    public String getRequirements() {
        return requirements;
    }

    public void setRequirements(String requirements) {
        this.requirements = requirements;
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

    public String getNiceToHave() {
        return niceToHave;
    }

    public void setNiceToHave(String niceToHave) {
        this.niceToHave = niceToHave;
    }
}
