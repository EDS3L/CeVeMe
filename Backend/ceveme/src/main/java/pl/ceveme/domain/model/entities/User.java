package pl.ceveme.domain.model.entities;

import jakarta.persistence.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import pl.ceveme.domain.model.vo.*;
import pl.ceveme.infrastructure.adapter.security.BCryptPasswordEncoderAdapter;

import java.util.List;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Embedded
    private Name name;
    @Embedded
    private Surname surname;
    @Embedded
    private PhoneNumber phoneNumber;
    @Column(unique = true)
    @Embedded
    private Email email;
    private String password;
    private String image;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Cv> cvList;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<ApplicationHistory> applicationHistoryList;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private EmploymentInfo employmentInfo;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private ActivationToken activationToken;

    private boolean isActive;


    public User() {
    }

    public User(Name name, Surname surname, PhoneNumber phoneNumber, Email email, String image, String password, List<Cv> cvList, List<ApplicationHistory> applicationHistoryList, EmploymentInfo employmentInfo, boolean isActive, ActivationToken activationToken) {
        this.name = name;
        this.surname = surname;
        this.phoneNumber = phoneNumber;
        this.image = image;
        this.email = email;
        this.password = password;
        this.cvList = cvList;
        this.applicationHistoryList = applicationHistoryList;
        this.employmentInfo = employmentInfo;
        this.isActive = isActive;
        this.activationToken = activationToken;
    }

    public static User createNewUser(Name name, Surname surname, PhoneNumber phoneNumber, String password, Email email, String image, List<Cv> cvList, List<ApplicationHistory> applicationHistoryList, EmploymentInfo employmentInfo, ActivationToken activationToken) {
        return new User(name, surname, phoneNumber, email, image, password, cvList, applicationHistoryList, employmentInfo, false, activationToken);
    }

    public void changePassword(String currentPassword, String newPassword, BCryptPasswordEncoderAdapter passwordEncoder) {
        if (!passwordEncoder.matches(currentPassword, this.password)) {
            throw new IllegalArgumentException("Incorrect current password");
        }

        if (passwordEncoder.matches(newPassword, this.password)) {
            throw new IllegalArgumentException("New password cannot be the same as the current password");
        }
        Password pass = new Password(newPassword);
        this.password = passwordEncoder.encode(pass);
    }

    public void changeName(Name name) {
        this.name = name;
    }

    public void changeSurname(Surname surname) {
        this.surname = surname;
    }

    public void changeEmail(Email email) {
        this.email = email;
    }

    public void changePhoneNumber(PhoneNumber phoneNumber) {
        this.phoneNumber = phoneNumber;
    }


    public long getId() {
        return id;
    }

    public Name getName() {
        return name;
    }

    public void setName(Name name) {
        this.name = name;
    }

    public Surname getSurname() {
        return surname;
    }

    public void setSurname(Surname surname) {
        this.surname = surname;
    }

    public PhoneNumber getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(PhoneNumber phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public Email getEmail() {
        return email;
    }

    public void setEmail(Email email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public List<Cv> getCvList() {
        return cvList;
    }

    public void setCvList(List<Cv> cvList) {
        this.cvList = cvList;
    }

    public List<ApplicationHistory> getApplicationHistoryList() {
        return applicationHistoryList;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public void setApplicationHistoryList(List<ApplicationHistory> applicationHistoryList) {
        this.applicationHistoryList = applicationHistoryList;
    }

    public EmploymentInfo getEmploymentInfo() {
        return employmentInfo;
    }

    public void setEmploymentInfo(EmploymentInfo employmentInfo) {
        this.employmentInfo = employmentInfo;
    }

    public boolean isActive() {
        return isActive;
    }

    public void setActive(boolean active) {
        isActive = active;
    }

    public void addCertificate(Certificate certificate) {
        if (this.employmentInfo == null) {
            this.employmentInfo = new EmploymentInfo();
            this.employmentInfo.setUser(this);
        }
        this.employmentInfo.addCertificate(certificate);
    }

    public void addPortfolioItems(PortfolioItem portfolioItem) {
        if(this.employmentInfo == null) {
            this.employmentInfo = new EmploymentInfo();
            this.employmentInfo.setUser(this);
        }
        this.employmentInfo.addPortfolioItem(portfolioItem);
    }

    public void addLinks(Link link) {
        if(this.employmentInfo == null) {
            this.employmentInfo = new EmploymentInfo();
            this.employmentInfo.setUser(this);
        }
        this.employmentInfo.addLink(link);
    }

    public void addCourse(Course course) {
        if (this.employmentInfo == null) {
            this.employmentInfo = new EmploymentInfo();
            this.employmentInfo.setUser(this);
        }
        this.employmentInfo.addCourse(course);
    }

    public void addExperience(Experience experience) {
        if (this.employmentInfo == null) {
            this.employmentInfo = new EmploymentInfo();
            this.employmentInfo.setUser(this);
        }
        this.employmentInfo.addExperience(experience);
    }

    public void addLanguage(Language language) {
        if (this.employmentInfo == null) {
            this.employmentInfo = new EmploymentInfo();
            this.employmentInfo.setUser(this);
        }
        this.employmentInfo.addLanguage(language);
    }

    public void addSkill(Skill skill) {
        if (this.employmentInfo == null) {
            this.employmentInfo = new EmploymentInfo();
            this.employmentInfo.setUser(this);
        }
        this.employmentInfo.addSkill(skill);
    }

    public void addEducation(Education education) {
        if (this.employmentInfo == null) {
            this.employmentInfo = new EmploymentInfo();
            this.employmentInfo.setUser(this);
        }
        this.employmentInfo.addEducation(education);
    }

    @Override
    public String toString() {
        return "User{" +
                "name=" + name +
                ", surname=" + surname +
                ", phoneNumber=" + phoneNumber +
                ", email=" + email +
                '}';
    }
}
