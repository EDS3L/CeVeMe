package pl.ceveme.domain.model.entities;

import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Entity
@Table(name = "employmentInfos")
public class EmploymentInfo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @OneToMany(mappedBy = "employmentInfo", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Language> languages = new ArrayList<>();

    @OneToMany(mappedBy = "employmentInfo", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Certificate> certificates = new ArrayList<>();

    @OneToMany(mappedBy = "employmentInfo", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Experience> experiences = new ArrayList<>();

    @OneToMany(mappedBy = "employmentInfo", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Course> courses = new ArrayList<>();

    @OneToMany(mappedBy = "employmentInfo", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Skill> skills = new ArrayList<>();

    @OneToMany(mappedBy = "employmentInfo", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<PortfolioItem> portfolioItems = new ArrayList<>();

    @OneToMany(mappedBy = "employmentInfo", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Link> links = new ArrayList<>();

    @OneToMany(mappedBy = "employmentInfo", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Education> educations = new ArrayList<>();

    @OneToOne
    private User user;

    public EmploymentInfo() {
    }

    public EmploymentInfo(List<Language> languages, List<Certificate> certificates, List<Experience> experiences, List<Course> courses, List<Skill> skills, List<PortfolioItem> portfolioItems, List<Link> links, List<Education> educations) {
        this.languages = languages;
        this.certificates = certificates;
        this.experiences = experiences;
        this.courses = courses;
        this.skills = skills;
        this.portfolioItems = portfolioItems;
        this.links = links;
        this.educations = educations;
    }

    public long getId() {
        return id;
    }

    public List<Language> getLanguages() {
        return languages;
    }

    public void setLanguages(List<Language> languages) {
        this.languages = languages;
    }

    public List<Certificate> getCertificates() {
        return certificates;
    }

    public void setCertificates(List<Certificate> certificates) {
        this.certificates = certificates;
    }

    public List<Experience> getExperiences() {
        return experiences;
    }

    public void setExperiences(List<Experience> experiences) {
        this.experiences = experiences;
    }

    public List<Course> getCourses() {
        return courses;
    }

    public void setCourses(List<Course> courses) {
        this.courses = courses;
    }

    public List<Skill> getSkills() {
        return skills;
    }

    public void setSkills(List<Skill> skills) {
        this.skills = skills;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public List<Education> getEducations() {
        return educations;
    }

    public void setEducations(List<Education> educations) {
        this.educations = educations;
    }

    public List<Link> getLinks() {
        return links;
    }

    public void setLinks(List<Link> links) {
        this.links = links;
    }

    public List<PortfolioItem> getPortfolioItems() {
        return portfolioItems;
    }

    public void setPortfolioItems(List<PortfolioItem> portfolioItems) {
        this.portfolioItems = portfolioItems;
    }

    public void addLink(Link link) {
        this.links.add(link);
        link.setEmploymentInfo(this);
    }

    public void addPortfolioItem(PortfolioItem portfolioItem) {
        this.portfolioItems.add(portfolioItem);
        portfolioItem.setEmploymentInfo(this);
    }

    public void addCertificate(Certificate certificate) {
        this.certificates.add(certificate);
        certificate.setEmploymentInfo(this);
    }

    public void removeCertificate(Certificate certificate) {
        if (!certificates.contains(certificate)) {
            throw new IllegalArgumentException("Certificate not found in employment info");
        }
        certificates.remove(certificate);
        certificate.setEmploymentInfo(null);
    }

    public Optional<Certificate> getCertificateById(Long id) {
        return certificates.stream()
                .filter(c -> c.getId() == id)
                .findFirst();
    }


    public void addCourse(Course course) {
        this.courses.add(course);
        course.setEmploymentInfo(this);
    }

    public void addExperience(Experience experience) {
        this.experiences.add(experience);
        experience.setEmploymentInfo(this);
    }

    public void addLanguage(Language language) {
        this.languages.add(language);
        language.setEmploymentInfo(this);
    }

    public void addSkill(Skill skill) {
        this.skills.add(skill);
        skill.setEmploymentInfo(this);
    }

    public void addEducation(Education education) {
        this.educations.add(education);
        education.setEmploymentInfo(this);
    }

    @Override
    public String toString() {
        return "EmploymentInfo{" +
                "languages=" + languages +
                ", certificates=" + certificates +
                ", experiences=" + experiences +
                ", courses=" + courses +
                ", skills=" + skills +
                ", portfolioItems=" + portfolioItems +
                ", links=" + links +
                '}';
    }
}
