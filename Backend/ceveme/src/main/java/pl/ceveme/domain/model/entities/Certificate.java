package pl.ceveme.domain.model.entities;


import jakarta.persistence.*;

import java.time.LocalDate;
import java.util.Date;

@Entity
@Table(name = "certificates")
public class Certificate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private String name;
    private LocalDate dateOfCertificate;

    @ManyToOne
    @JoinColumn(name = "employment_info_id")
    private EmploymentInfo employmentInfo;

    public Certificate() {
    }

    public Certificate(String name, LocalDate dateOfCertificate) {
        this.name = name;
        this.dateOfCertificate = dateOfCertificate;
    }

    public long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public LocalDate getDateOfCertificate() {
        return dateOfCertificate;
    }

    public void setDateOfCertificate(LocalDate dateOfCertificate) {
        this.dateOfCertificate = dateOfCertificate;
    }

    public EmploymentInfo getEmploymentInfo() {
        return employmentInfo;
    }

    public void setEmploymentInfo(EmploymentInfo employmentInfo) {
        this.employmentInfo = employmentInfo;
    }
}

