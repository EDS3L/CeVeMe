package pl.ceveme.domain.model.entities;


import jakarta.persistence.*;

import java.util.Date;

@Entity
@Table(name = "certificates")
public class Certificate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private String name;
    private Date dateOfCertificate;

    @ManyToOne
    @JoinColumn(name = "employment_info_id")
    private EmploymentInfo employmentInfo;

    public Certificate() {
    }

    public Certificate(String name, Date dateOfCertificate) {
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

    public Date getDateOfCertificate() {
        return dateOfCertificate;
    }

    public void setDateOfCertificate(Date dateOfCertificate) {
        this.dateOfCertificate = dateOfCertificate;
    }

    public EmploymentInfo getEmploymentInfo() {
        return employmentInfo;
    }

    public void setEmploymentInfo(EmploymentInfo employmentInfo) {
        this.employmentInfo = employmentInfo;
    }
}

