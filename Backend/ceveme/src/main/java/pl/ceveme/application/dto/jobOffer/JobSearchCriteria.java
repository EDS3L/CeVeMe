package pl.ceveme.application.dto.jobOffer;

import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;
import java.util.List;

public class JobSearchCriteria {

    private String q;
    private String company;
    private String city;
    private String experienceLevel;
    private String employmentType;
    private String title;
    private Integer salaryMin;
    private Integer salaryMax;
    private String salaryType;
    private String locationCity;
    private Double radiusKm;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private LocalDate dateAddedFrom;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private LocalDate dateAddedTo;

    private List<String> skills;
    private Integer pageNumber = 0;
    private Integer size = 50;
    private String sort = "newest";

    public JobSearchCriteria() {
    }

    public String getQ() {
        return q;
    }

    public void setQ(String q) {
        this.q = q;
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

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Integer getSalaryMin() {
        return salaryMin;
    }

    public void setSalaryMin(Integer salaryMin) {
        this.salaryMin = salaryMin;
    }

    public Integer getSalaryMax() {
        return salaryMax;
    }

    public void setSalaryMax(Integer salaryMax) {
        this.salaryMax = salaryMax;
    }

    public String getSalaryType() {
        return salaryType;
    }

    public void setSalaryType(String salaryType) {
        this.salaryType = salaryType;
    }

    public LocalDate getDateAddedFrom() {
        return dateAddedFrom;
    }

    public void setDateAddedFrom(LocalDate dateAddedFrom) {
        this.dateAddedFrom = dateAddedFrom;
    }

    public LocalDate getDateAddedTo() {
        return dateAddedTo;
    }

    public void setDateAddedTo(LocalDate dateAddedTo) {
        this.dateAddedTo = dateAddedTo;
    }

    public List<String> getSkills() {
        return skills;
    }

    public void setSkills(List<String> skills) {
        this.skills = skills;
    }

    public Integer getPageNumber() {
        return pageNumber;
    }

    public void setPageNumber(Integer pageNumber) {
        this.pageNumber = pageNumber;
    }

    public Integer getSize() {
        return size;
    }

    public void setSize(Integer size) {
        this.size = size;
    }

    public String getSort() {
        return sort;
    }

    public void setSort(String sort) {
        this.sort = sort;
    }

    public String getLocationCity() {
        return locationCity;
    }

    public void setLocationCity(String locationCity) {
        this.locationCity = locationCity;
    }

    public Double getRadiusKm() {
        return radiusKm;
    }

    public void setRadiusKm(Double radiusKm) {
        this.radiusKm = radiusKm;
    }
}
